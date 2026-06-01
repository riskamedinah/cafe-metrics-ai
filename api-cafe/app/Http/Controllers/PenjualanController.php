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
   public function index(): JsonResponse
   {
        $penjualans = Penjualan::with('barang')
            ->where('user_id', Auth::id())
            ->latest()
            ->paginate(15);

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

}

