<?php

namespace App\Http\Controllers;

use App\Models\Penjualan;
use App\Models\RingkasanBulanan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RingkasanBulananController extends Controller
{
    /**
     * FITUR: Hitung Statistik Omzet & Top 3 Menu Terlaris Bulanan
     * ENDPOINT: POST /api/ringkasan/hitung
     * KEGUNAAN: Menghasilkan format raw text untuk dikirim ke API AI (OpenAI/Gemini)
     */
    public function hitungStatistik(Request $request): JsonResponse{
        $validated = $request->validate([
            'bulan' => 'required|integer|min:1|max:12',
            'tahun' => 'required|integer|min:2000',
        ]);

        $bulan = $validated['bulan'];
        $tahun = $validated['tahun'];

        $penjualans = Penjualan::with('barang')
            ->where('user_id', Auth::id())
            ->whereMonth('created_at', $bulan)
            ->whereYear('created_at', $tahun)
            ->get();

        if ($penjualans->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'Tidak ada data penjualan pada periode ini',
                'data' => null,
            ], 404);
        }

        $totalOmzet = $penjualans->sum('total_harga');
        $totalItemTerjual = $penjualans->sum('jumlah');

        $top3 = $penjualans
            ->groupBy('barang_id')
            ->map(fn($group) => [
                'nama_barang' => $group->first()->barang->nama_barang,
                'total_terjual' => $group->sum('jumlah'),
            ])
            ->sortByDesc('total_terjual')
            ->values()
            ->take(3);

        $bulanIndo = $this->namaBulanIndonesia($bulan);
        $omzetFormat = 'Rp ' . number_format($totalOmzet, 0, ',', '.');

        $rawDataAi = "Laporan Penjualan Cafe - {$bulanIndo} {$tahun}\n";
        $rawDataAi .= "Total Omzet: {$omzetFormat}\n";
        $rawDataAi .= "Total Item Terjual: {$totalItemTerjual} item\n\n";
        $rawDataAi .= "Top 3 Menu Terlaris:\n";

        foreach ($top3 as $index => $item) {
            $no = $index + 1;
            $rawDataAi .= "{$no}. {$item['nama_barang']} - {$item['total_terjual']} terjual\n";
        }

        return response()->json([
            'status' => true,
            'message' => 'Statistik bulanan berhasil dihitung',
            'data' => [
                'bulan' => $bulan,
                'tahun' => $tahun,
                'total_omzet' => $totalOmzet,
                'total_item_terjual' => $totalItemTerjual,
                'top_3_terlaris' => $top3,
                'raw_data_ai' => $rawDataAi,
            ],
        ]);
    }

    /**
     * FITUR: Ambil Semua Riwayat Arsip Ringkasan AI
     * ENDPOINT: GET /api/ringkasan
     */
    public function index(): JsonResponse
    {
        $ringkasans = RingkasanBulanan::where('user_id', Auth::id())
            ->latest()
            ->paginate(15);

        return response()->json([
            'status' => true,
            'message' => 'Data ringkasan bulanan berhasil diambil',
            'data' => $ringkasans,
        ]);
    }

    /**
     * FITUR: Simpan Hasil Analisis AI ke Database
     * ENDPOINT: POST /api/ringkasan
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'bulan' => 'required|integer|min:1|max:12',
            'tahun' => 'required|integer|min:2000',
            'total_omzet' => 'required|integer|min:0',
            'total_item_terjual' => 'required|integer|min:0',
            'analisis_ai' => 'required|string',
        ]);

        $ringkasan = RingkasanBulanan::create([
            'user_id' => Auth::id(),
            'bulan' => $validated['bulan'],
            'tahun' => $validated['tahun'],
            'total_omzet' => $validated['total_omzet'],
            'total_item_terjual' => $validated['total_item_terjual'],
            'analisis_ai' => $validated['analisis_ai'],
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Ringkasan bulanan berhasil disimpan',
            'data' => $ringkasan,
        ], 201);
    }

    /**
     * HELPER METHOD: Mengubah Angka Bulan ke String Bahasa Indonesia
     */
    private function namaBulanIndonesia(int $bulan): string
    {
        $bulanList = [
            1 => 'Januari',
            2 => 'Februari',
            3 => 'Maret',
            4 => 'April',
            5 => 'Mei',
            6 => 'Juni',
            7 => 'Juli',
            8 => 'Agustus',
            9 => 'September',
            10 => 'Oktober',
            11 => 'November',
            12 => 'Desember',
        ];

        return $bulanList[$bulan] ?? 'Tidak valid';
    }

}