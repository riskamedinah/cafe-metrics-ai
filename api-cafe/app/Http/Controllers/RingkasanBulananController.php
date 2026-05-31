<?php

namespace App\Http\Controllers;

use App\Models\RingkasanBulanan;
use App\Models\Penjualan;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class RingkasanBulananController extends Controller
{
    /**
     * Ambil semua riwayat ringkasan bulanan yang pernah di-generate oleh AI.
     * Dipakai untuk halaman "Arsip Laporan / Insights" di Figma.
     */
    public function index(): JsonResponse
    {
        $ringkasans = RingkasanBulanan::where('user_id', Auth::id())
            ->orderBy('tahun', 'desc')
            ->orderBy('bulan', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Daftar ringkasan bulanan berhasil diambil',
            'data' => $ringkasans
        ], 200);
    }

    /**
     * Langkah 1: Kumpulkan data penjualan & hitung statistik kafe.
     * Fungsi ini akan dipanggil pas user milih bulan di Figma lalu klik "Hitung Total Operasional".
     */
    public function hitungStatistik(Request $request): JsonResponse
    {
        $request->validate([
            'bulan' => 'required|integer|between:1,12',
            'tahun' => 'required|integer|min:2020',
        ]);

        $userId = Auth::id();
        $bulan = $request->bulan;
        $tahun = $request->tahun;

        // 1. Hitung Total Omzet & Total Barang Terjual di bulan tersebut
        $statistik = Penjualan::where('user_id', $userId)
            ->whereMonth('created_at', $bulan)
            ->whereYear('created_at', $tahun)
            ->selectRaw('SUM(total_harga) as total_omzet, SUM(jumlah) as total_barang_terjual')
            ->first();

        $totalOmzet = $statistik->total_omzet ?? 0;
        $totalTerjual = $statistik->total_barang_terjual ?? 0;

        // 2. Cari 3 Menu Terlaris (Top Selling Items)
        $menuTerlaris = Penjualan::join('barangs', 'penjualans.barang_id', '=', 'barangs.id')
            ->where('penjualans.user_id', $userId)
            ->whereMonth('penjualans.created_at', $bulan)
            ->whereYear('penjualans.created_at', $tahun)
            ->select('barangs.nama_barang', DB::raw('SUM(penjualans.jumlah) as kuantitas_terjual'))
            ->groupBy('barangs.id', 'barangs.nama_barang')
            ->orderByDesc('kuantitas_terjual')
            ->take(3)
            ->get();

        // 3. Susun teks narasi mentah untuk bahan bakar Prompt AI nanti
        $namaBulan = Carbon::create()->month($bulan)->translatedFormat('F');
        $teksMenu = $menuTerlaris->map(fn($item) => "- {$item->nama_barang} ({$item->kuantitas_terjual} pcs)")->implode("\n");
        
        $rawDataUntukAI = "Laporan Kafe Bulan: $namaBulan $tahun.\n" .
                          "Total Omzet: Rp " . number_format($totalOmzet, 0, ',', '.') . "\n" .
                          "Total Produk Terjual: $totalTerjual pcs\n" .
                          "Menu Terlaris:\n" . ($teksMenu ?: "- Belum ada data transaksi");

        return response()->json([
            'success' => true,
            'data' => [
                'bulan' => $bulan,
                'tahun' => $tahun,
                'total_omzet' => $totalOmzet,
                'total_barang_terjual' => $totalTerjual,
                'menu_terlaris' => $menuTerlaris,
                'raw_data_ai' => $rawDataUntukAI // Teks ini yang nanti dikirim ke fungsi generate AI
            ]
        ], 200);
    }

    /**
     * Langkah 2: Simpan hasil analisis dari AI ke Database.
     * Dipakai setelah tombol "Simpan Laporan" diklik di Figma.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'bulan' => 'required|integer|between:1,12',
            'tahun' => 'required|integer|min:2020',
            'total_omzet' => 'required|integer',
            'analisis_ai' => 'required|string', // Teks jawaban/insight dari Gemini/OpenAI
        ]);

        // Cek apakah bulan tersebut sudah pernah disimpan, kalau sudah kita overwrite (update)
        $ringkasan = RingkasanBulanan::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'bulan'   => $validated['bulan'],
                'tahun'   => $validated['tahun'],
            ],
            [
                'total_omzet' => $validated['total_omzet'],
                'analisis_ai' => $validated['analisis_ai'],
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Analisis AI bulanan berhasil disimpan ke arsip!',
            'data' => $ringkasan
        ], 201);
    }
}