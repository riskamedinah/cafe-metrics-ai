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
 * FITUR: Ringkasan Dashboard
 * ENDPOINT: GET /api/dashboard
 * AKSES: Terproteksi Token
 */
public function dashboardSummary(): JsonResponse
{
    $userId = Auth::id();
    $now = now();
    $bulanIni = $now->month;
    $tahunIni = $now->year;

    // Hitung total penjualan dan pendapatan bulan ini
    $penjualanBulanIni = Penjualan::where('user_id', $userId)
        ->whereMonth('created_at', $bulanIni)
        ->whereYear('created_at', $tahunIni)
        ->get();

    $totalPenjualan = $penjualanBulanIni->count();
    $totalPendapatan = $penjualanBulanIni->sum('total_harga');

    // Data per minggu untuk grafik
    $chartData = [];
    // Tentukan jumlah minggu dalam bulan ini (1-4 atau 5)
    $weeksInMonth = $now->weekOfMonth; // Laravel helper: minggu keberapa dalam bulan (1-5)
    // Kita ingin 4 atau 5 titik data (Minggu 1,2,3,4,5)
    for ($week = 1; $week <= 5; $week++) {
        // Hitung awal dan akhir minggu (perkiraan: minggu dimulai dari tanggal 1)
        // Cara sederhana: bagi tanggal menjadi 5 interval berdasarkan jumlah hari dalam bulan
        $daysInMonth = $now->daysInMonth;
        $startDay = ($week - 1) * 7 + 1;
        $endDay = min($week * 7, $daysInMonth);
        
        $startDate = now()->setDay($startDay)->startOfDay();
        $endDate = now()->setDay($endDay)->endOfDay();

        $mingguData = Penjualan::where('user_id', $userId)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('COUNT(*) as total_penjualan, SUM(total_harga) as total_harga')
            ->first();

        $chartData[] = [
            'minggu' => "Minggu $week",
            'totalPenjualan' => (int) ($mingguData->total_penjualan ?? 0),
            'totalHarga' => (int) ($mingguData->total_harga ?? 0),
        ];
    }

    return response()->json([
        'status' => true,
        'message' => 'Data dashboard berhasil diambil',
        'data' => [
            'total_penjualan' => $totalPenjualan,
            'total_pendapatan' => $totalPendapatan,
            'chart_data' => $chartData,
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

    // Hitung selisih stok yang perlu dikurangi/ditambah
    $selisih = $jumlahBaru - $jumlahLama;

    // Cek stok jika selisih positif (jumlah bertambah)
    if ($selisih > 0 && $barang->stok_barang < $selisih) {
        return response()->json([
            'status' => false,
            'message' => 'Stok barang tidak mencukupi untuk penambahan jumlah.',
            'data' => null,
        ], 422);
    }

    DB::transaction(function () use ($penjualan, $barang, $jumlahBaru, $selisih) {
        // Update stok barang
        $barang->decrement('stok_barang', $selisih); // jika selisih negatif, akan menambah stok

        // Update penjualan
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
        // Kembalikan stok
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

