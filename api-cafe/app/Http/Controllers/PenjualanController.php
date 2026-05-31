<?php

namespace App\Http\Controllers;

use App\Models\Penjualan;
use App\Models\Barang;
use App\Http\Requests\StorePenjualanRequest;
use App\Http\Requests\UpdatePenjualanRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PenjualanController extends Controller
{
    /**
     * Ambil semua riwayat transaksi penjualan milik user yang login.
     * Dipakai untuk menampilkan tabel histori di halaman "Management Penjualan" Figma.
     */
    public function index(): JsonResponse
    {
        $penjualans = Penjualan::with('barang')
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Riwayat transaksi penjualan berhasil diambil',
            'data' => $penjualans
        ], 200);
    }

    /**
     * Catat transaksi penjualan baru + Otomatis Potong Stok Barang.
     */
    public function store(StorePenjualanRequest $request): JsonResponse
    {
        $validated = $request->validated();

        // Cari barang yang mau dibeli
        $barang = Barang::where('id', $validated['barang_id'])
            ->where('user_id', Auth::id())
            ->first();

        if (!$barang) {
            return response()->json([
                'success' => false,
                'message' => 'Menu/Barang tidak ditemukan'
            ], 404);
        }

        // Cek apakah stok di cafe mencukupi
        if ($barang->stok_barang < $validated['jumlah']) {
            return response()->json([
                'success' => false,
                'message' => "Stok tidak mencukupi! Stok tersisa saat ini: {$barang->stok_barang}"
            ], 422);
        }

        // Hitung otomatis total harga berdasarkan jumlah beli * harga barang
        $totalHarga = $barang->harga_barang * $validated['jumlah'];

        try {
            // Gunakan DB Transaction agar jika salah satu proses gagal, database otomatis rollback
            $penjualan = DB::transaction(function () use ($validated, $barang, $totalHarga) {
                // 1. Kurangi stok barang
                $barang->decrement('stok_barang', $validated['jumlah']);

                // 2. Buat data penjualan
                return Penjualan::create([
                    'barang_id'   => $validated['barang_id'],
                    'user_id'     => Auth::id(),
                    'jumlah'      => $validated['jumlah'],
                    'total_harga' => $totalHarga
                ]);
            });

            return response()->json([
                'success' => true,
                'message' => 'Transaksi penjualan berhasil dicatat, stok menu telah terpotong',
                'data' => $penjualan->load('barang')
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memproses transaksi: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Tampilkan detail satu transaksi penjualan.
     */
    public function show(Penjualan $penjualan): JsonResponse
    {
        // Cek kepemilikan data
        if ($penjualan->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $penjualan->load('barang')
        ], 200);
    }

    /**
     * (Opsional) Mengubah data transaksi jika ada salah input jumlah.
     * Stok barang otomatis disesuaikan kembali (dikembalikan/dikurangi lagi).
     */
    public function update(UpdatePenjualanRequest $request, Penjualan $penjualan): JsonResponse
    {
        // Cek kepemilikan data
        if ($penjualan->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak'
            ], 403);
        }

        $validated = $request->validated();
        $barang = $penjualan->barang;

        // Cek apakah barang masih ada
        if (!$barang) {
            return response()->json([
                'success' => false,
                'message' => 'Barang terkait tidak ditemukan'
            ], 404);
        }

        try {
            DB::transaction(function () use ($validated, $penjualan, $barang) {
                // Kembalikan dulu stok barang ke jumlah sebelum edit
                $barang->increment('stok_barang', $penjualan->jumlah);
                
                // Hitung stok setelah dikembalikan
                $stokSetelahDikembalikan = $barang->stok_barang;

                // Cek stok baru mencukupi atau tidak
                if ($stokSetelahDikembalikan < $validated['jumlah']) {
                    throw ValidationException::withMessages([
                        'jumlah' => ['Stok tidak mencukupi untuk pembaruan ini. Stok tersedia: ' . $stokSetelahDikembalikan]
                    ]);
                }

                // Kurangi stok dengan jumlah yang baru
                $barang->decrement('stok_barang', $validated['jumlah']);

                // Update data transaksi
                $penjualan->update([
                    'jumlah'      => $validated['jumlah'],
                    'total_harga' => $barang->harga_barang * $validated['jumlah']
                ]);
            });

            return response()->json([
                'success' => true,
                'message' => 'Transaksi penjualan berhasil diperbarui',
                'data' => $penjualan->fresh()->load('barang')
            ], 200);
            
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui transaksi: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Hapus transaksi penjualan + Kembalikan stok barang ke semula.
     */
    public function destroy(Penjualan $penjualan): JsonResponse
    {
        // Cek kepemilikan data
        if ($penjualan->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak'
            ], 403);
        }

        try {
            DB::transaction(function () use ($penjualan) {
                // Kembalikan stok barang yang tadinya terjual
                if ($penjualan->barang) {
                    $penjualan->barang->increment('stok_barang', $penjualan->jumlah);
                }
                $penjualan->delete();
            });

            return response()->json([
                'success' => true,
                'message' => 'Transaksi penjualan berhasil dihapus, stok barang dikembalikan ke semula'
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus transaksi: ' . $e->getMessage()
            ], 500);
        }
    }
}