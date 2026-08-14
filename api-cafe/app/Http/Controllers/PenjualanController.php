<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\Penjualan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PenjualanController extends Controller
{
    /**
     * FITUR: Riwayat Transaksi Penjualan
     * ENDPOINT: GET /api/penjualan
     * AKSES: Terproteksi Token (Menampilkan data pagination)
     */
   public function index(Request $request): JsonResponse
   {
        $penjualans = Penjualan::with('barang')
            ->where('user_id', Auth::id())
            ->latest()
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'status' => true,
            'message' => 'Data penjualan berhasil diambil',
            'data' => $penjualans,
        ]);
   }

   /**
     * FITUR: Catat Transaksi Baru & Potong Stok
     * ENDPOINT: POST /api/penjualan
     * AKSES: Terproteksi Token (Menggunakan Database Transaction)
     */
   public function store(Request $request): JsonResponse
   {
        $validated = $request->validate([
            'barang_id' => 'required|exists:barangs,id',
            'jumlah' => 'required|integer|min:1',
        ]);

        $barang = Barang::where('id', $validated['barang_id'])
            ->where('user_id', Auth::id())
            ->first();

        if (!$barang) {
            return response()->json([
                'status' => false,
                'message' => 'Barang tidak ditemukan',
                'data' => null,
            ], 404);
        }

        if ($barang->stok_barang < $validated['jumlah']) {
            return response()->json([
                'status' => false,
                'message' => 'Stok barang tidak mencukupi',
                'data' => null,
            ], 422);
        }

        $penjualan = DB::transaction(function () use ($barang, $validated) {
            $barang->decrement('stok_barang', $validated['jumlah']);

            return Penjualan::create([
                'barang_id' => $validated['barang_id'],
                'user_id' => Auth::id(),
                'jumlah' => $validated['jumlah'],
                'total_harga' => $barang->harga_barang * $validated['jumlah'],
            ]);
        });

        return response()->json([
            'status' => true,
            'message' => 'Penjualan berhasil dicatat',
            'data' => $penjualan->load('barang'),
        ], 201);
}

/**
 * FITUR: Ringkasan Dashboard (Optimized & All-in-One)
 * ENDPOINT: GET /api/dashboard
 */
public function dashboardSummary(): JsonResponse
{
    $userId = Auth::id();
    $now = now();
    $bulanIni = $now->month;
    $tahunIni = $now->year;

    $statsBulan = Penjualan::where('user_id', $userId)
        ->whereMonth('created_at', $bulanIni)
        ->whereYear('created_at', $tahunIni)
        ->selectRaw('COUNT(*) as total_penjualan, COALESCE(SUM(total_harga), 0) as total_pendapatan')
        ->first();

    $totalProduk = \App\Models\Barang::where('user_id', $userId)->count();
    $totalKategori = \App\Models\Kategori::where('user_id', $userId)->count();

    $daysInMonth = $now->daysInMonth;
    $salesGrouped = Penjualan::where('user_id', $userId)
        ->whereMonth('created_at', $bulanIni)
        ->whereYear('created_at', $tahunIni)
        ->selectRaw('DAY(created_at) as day_number, COUNT(*) as total_penjualan, SUM(total_harga) as total_harga')
        ->groupBy('day_number')
        ->get();

    $chartData = [];
    for ($week = 1; $week <= 5; $week++) {
        $startDay = ($week - 1) * 7 + 1;
        $endDay = min($week * 7, $daysInMonth);

        $filtered = $salesGrouped->whereBetween('day_number', [$startDay, $endDay]);

        $chartData[] = [
            'minggu' => "Minggu $week",
            'totalPenjualan' => (int) $filtered->sum('total_penjualan'),
            'totalHarga' => (int) $filtered->sum('total_harga'),
        ];
    }

    $latestPenjualan = Penjualan::with('barang')
        ->where('user_id', $userId)
        ->latest()
        ->take(5)
        ->get();

    return response()->json([
        'status' => true,
        'message' => 'Data dashboard berhasil diambil',
        'data' => [
            'total_penjualan'  => (int) $statsBulan->total_penjualan,
            'total_pendapatan' => (int) $statsBulan->total_pendapatan,
            'total_produk'     => $totalProduk,
            'total_kategori'   => $totalKategori,
            'chart_data'       => $chartData,
            'table'            => $latestPenjualan,
        ],
    ]);
}

/**
 * Update transaksi penjualan
 * PUT /api/penjualan/{id}
 */
public function update(Request $request, int $id): JsonResponse
{
    $validated = $request->validate([
        'jumlah' => 'required|integer|min:1',
    ]);

    $penjualan = Penjualan::where('id', $id)
        ->where('user_id', Auth::id())
        ->first();

    if (!$penjualan) {
        return response()->json([
            'status' => false,
            'message' => 'Data penjualan tidak ditemukan',
            'data' => null,
        ], 404);
    }

    $barang = $penjualan->barang;
    if (!$barang) {
        return response()->json([
            'status' => false,
            'message' => 'Barang tidak ditemukan',
            'data' => null,
        ], 404);
    }

    $jumlahLama = $penjualan->jumlah;
    $jumlahBaru = $validated['jumlah'];

    $selisih = $jumlahBaru - $jumlahLama;

    if ($selisih > 0 && $barang->stok_barang < $selisih) {
        return response()->json([
            'status' => false,
            'message' => 'Stok barang tidak mencukupi untuk penambahan jumlah.',
            'data' => null,
        ], 422);
    }

    DB::transaction(function () use ($penjualan, $barang, $jumlahBaru, $selisih) {
        $barang->decrement('stok_barang', $selisih);

        $penjualan->update([
            'jumlah' => $jumlahBaru,
            'total_harga' => $barang->harga_barang * $jumlahBaru,
        ]);
    });

    return response()->json([
        'status' => true,
        'message' => 'Penjualan berhasil diperbarui',
        'data' => $penjualan->fresh()->load('barang'),
    ]);
}

/**
 * Hapus transaksi penjualan
 * DELETE /api/penjualan/{id}
 */
public function destroy(int $id): JsonResponse
{
    $penjualan = Penjualan::where('id', $id)
        ->where('user_id', Auth::id())
        ->first();

    if (!$penjualan) {
        return response()->json([
            'status' => false,
            'message' => 'Data penjualan tidak ditemukan',
            'data' => null,
        ], 404);
    }

    DB::transaction(function () use ($penjualan) {
        $penjualan->barang->increment('stok_barang', $penjualan->jumlah);
        $penjualan->delete();
    });

    return response()->json([
        'status' => true,
        'message' => 'Penjualan berhasil dihapus',
        'data' => null,
    ]);
}
}

