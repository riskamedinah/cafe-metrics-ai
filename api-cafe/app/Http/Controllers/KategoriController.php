<?php

namespace App\Http\Controllers;

use App\Models\Kategori;
use App\Http\Requests\StoreKategoriRequest;
use App\Http\Requests\UpdateKategoriRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class KategoriController extends Controller
{
    /**
     * Tampilkan semua kategori milik user yang sedang login.
     * Dipakai untuk mengisi tabel di halaman "Management Kategori" Figma.
     */
    public function index(): JsonResponse
    {
        $kategoris = Kategori::where('user_id', Auth::id())->get();

        return response()->json([
            'success' => true,
            'message' => 'Daftar kategori berhasil diambil',
            'data' => $kategoris
        ], 200);
    }

    /**
     * Simpan kategori baru dari form input Figma.
     */
    public function store(StoreKategoriRequest $request): JsonResponse
    {
        // Data otomatis divalidasi oleh StoreKategoriRequest sebelum masuk ke sini
        $validated = $request->validated();

        // Gabungkan data input dengan user_id owner yang sedang login
        $kategori = Kategori::create([
            'user_id' => Auth::id(),
            'nama_kategori' => $validated['nama_kategori']
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Kategori baru berhasil ditambahkan',
            'data' => $kategori
        ], 201);
    }

    /**
     * Tampilkan detail satu kategori (jika diperlukan).
     */
    public function show(Kategori $kategori): JsonResponse
    {
        // Validasi kepemilikan data
        if ($kategori->user_id !== Auth::id()) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $kategori
        ], 200);
    }

    /**
     * Proses edit/update kategori dari modal edit di Figma.
     */
    public function update(UpdateKategoriRequest $request, Kategori $kategori): JsonResponse
    {
        if ($kategori->user_id !== Auth::id()) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        $validated = $request->validated();
        $kategori->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Kategori berhasil diperbarui',
            'data' => $kategori
        ], 200);
    }

    /**
     * Hapus kategori dari tombol "Delete" di tabel Figma.
     */
    public function destroy(Kategori $kategori): JsonResponse
    {
        if ($kategori->user_id !== Auth::id()) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        // Karena di migration kita pakai cascade, barang di dalam kategori ini otomatis ikut terhapus
        $kategori->delete();

        return response()->json([
            'success' => true,
            'message' => 'Kategori berhasil dihapus'
        ], 200);
    }
}