<?php

namespace App\Http\Controllers;

use App\Models\Penjualan;
use App\Models\RingkasanBulanan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

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
        $totalPenjualan = $penjualans->count();

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
                'total_penjualan' => $totalPenjualan,
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
            'total_penjualan' => 'required|integer|min:0',
            'total_omzet' => 'required|integer|min:0',
            'total_item_terjual' => 'required|integer|min:0',
            'analisis_ai' => 'required|string',
        ]);

        $ringkasan = RingkasanBulanan::create([
            'user_id' => Auth::id(),
            'bulan' => $validated['bulan'],
            'tahun' => $validated['tahun'],
            'total_penjualan' => $validated['total_penjualan'],
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

  public function generateAi(Request $request): JsonResponse
{
    $validated = $request->validate([
        'raw_data_ai' => 'required|string',
    ]);

    $apiKey = env('GEMINI_API_KEY');
    if (!$apiKey) {
        return response()->json(['status' => false, 'message' => 'Gemini API key tidak ditemukan'], 500);
    }

    // 1. Kunci prompt agar fokus ke angka dan stok produk saja
    $prompt = "Kamu adalah sistem analisis data penjualan yang kaku, objektif, dan hanya fokus pada angka. Tugasmu adalah meringkas data transaksi yang diberikan.\n\n" .
              "ATURAN KETAT:\n" .
              "1. DILARANG MEMBERIKAN SARAN STRATEGIS/BISNIS DI LUAR DATA (Jangan menyuruh mengubah konsep bisnis, melakukan survei, mengevaluasi toko, atau memberi saran promosi makro).\n" .
              "2. Fokus Rekomendasi HANYA boleh seputar manajemen stok produk yang nyata-nyata ada di dalam data (misal: naikkan stok produk terlaris, amankan pasokan, atau pantau item yang kurang laku).\n" .
              "3. Jangan berasumsi tentang jenis toko jika tidak disebutkan di data. Cukup sebutkan performa produknya.\n" .
              "4. Gunakan bahasa Indonesia yang formal, ringkas, dan langsung ke inti angka transaksi.\n\n" .
              "DATA TRANSAKSI UNTUK DIANALISIS:\n" . $validated['raw_data_ai'] . "\n\n" .
              "Balas dengan JSON valid dengan format tepat seperti ini:\n" .
              "{\n" .
              "  \"ringkasan\": \"Teks ringkasan performa omzet dan total item terjual...\",\n" .
              "  \"rekomendasi\": [\"Rekomendasi stok produk terlaris...\", \"Rekomendasi evaluasi stok item lainnya...\"],\n" .
              "  \"analisis_tren\": \"Teks analisis perbandingan kuantitas antar produk berdasarkan data tersebut...\"\n" .
              "}\n\n" .
              "Hanya kembalikan JSON, tanpa teks penjelasan lain di luar JSON.";

    // 2. Gunakan model Gemini 3.1 Flash Lite yang kuotanya aktif
    $model = 'gemini-3.1-flash-lite'; 

    try {
        $response = Http::retry(2, 3000)
            ->post("https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}", [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 0.0, // Dipaksa 0.0 agar jawaban kaku dan patuh pada prompt
                    'responseMimeType' => 'application/json', // Memaksa server Gemini merespons format JSON murni
                ],
            ]);

        if ($response->failed()) {
            Log::error('Gemini API failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            return response()->json([
                'status' => false,
                'message' => 'Gemini API error',
                'detail' => $response->json()['error']['message'] ?? 'No detail',
            ], 500);
        }

        $result = $response->json();
        $text = $result['candidates'][0]['content']['parts'][0]['text'] ?? null;
        if (!$text) {
            return response()->json(['status' => false, 'message' => 'Respons AI kosong'], 500);
        }

        // 3. Bersihkan pembungkus markdown jika AI tidak sengaja menyertakannya
        $text = trim($text);
        if (preg_match('/```json\s*(.*?)\s*```/s', $text, $matches)) {
            $text = $matches[1];
        }
        
        $aiData = json_decode($text, true);
        if (!$aiData || !isset($aiData['ringkasan'])) {
            return response()->json(['status' => false, 'message' => 'Format respons AI tidak valid'], 500);
        }

        // 4. Return data bersih ke frontend (React/Flutter/Blade) siap pakai di UI kamu
        return response()->json([
            'status' => true,
            'message' => 'Analisis AI berhasil',
            'data' => [
                'ringkasan' => $aiData['ringkasan'],
                'rekomendasi' => $aiData['rekomendasi'] ?? [],
                'analisis_tren' => $aiData['analisis_tren'] ?? '',
            ],
        ]);
    } catch (\Exception $e) {
        Log::error('Gemini exception: ' . $e->getMessage());
        return response()->json(['status' => false, 'message' => 'Gagal menghubungi Gemini'], 500);
    }
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