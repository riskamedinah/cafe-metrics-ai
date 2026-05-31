<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Http\Requests\StoreBarangRequest;
use App\Http\Requests\UpdateBarangRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class BarangController extends Controller
{
    /**
     * Ambil data semua barang/menu cafe milik user yang login.
     * Dipakai untuk mengisi komponen list tabel di "Management Barang" Figma.
     */
    public function index(): JsonResponse
    {
        // Kita sertakan data kategorinya sekalian menggunakan eager loading (with)
        $barangs = Barang::with('kategori')
            ->where('user_id', Auth::id())
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Daftar menu/barang berhasil diambil',
            'data' => $barangs
        ], 200);
    }

    /**
     * Simpan barang/menu baru beserta upload foto dari form Figma.
     */
    public function store(StoreBarangRequest $request): JsonResponse
    {
        $validated = $request->validated();

        // Logika handle upload foto produk
        $fotoPath = null;
        if ($request->hasFile('foto_barang')) {
            // Menyimpan di folder storage/app/public/produk
            $fotoPath = $request->file('foto_barang')->store('produk', 'public');
        }

        $barang = Barang::create([
            'kategori_id'     => $validated['kategori_id'],
            'user_id'         => Auth::id(),
            'nama_barang'     => $validated['nama_barang'],
            'harga_barang'    => $validated['harga_barang'],
            'stok_barang'     => $validated['stok_barang'],
            'deskripsi_barang'=> $validated['deskripsi_barang'] ?? null,
            'foto_barang'     => $fotoPath
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Menu baru berhasil ditambahkan',
            'data' => $barang
        ], 201);
    }

    /**
     * Ambil info detail 1 barang/menu.
     */
    public function show(Barang $barang): JsonResponse
    {
        if ($barang->user_id !== Auth::id()) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $barang->load('kategori')
        ], 200);
    }

    /**
     * Proses edit menu + handle pergantian foto produk lama.
     */
    public function update(UpdateBarangRequest $request, Barang $barang): JsonResponse
    {
        if ($barang->user_id !== Auth::id()) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        $validated = $request->validated();

        // Cek jika user mengunggah foto baru di form edit Figma
        if ($request->hasFile('foto_barang')) {
            // Hapus foto lama dari storage biar hemat memori
            if ($barang->foto_barang && Storage::disk('public')->exists($barang->foto_barang)) {
                Storage::disk('public')->delete($barang->foto_barang);
            }
            // Simpan foto baru
            $validated['foto_barang'] = $request->file('foto_barang')->store('produk', 'public');
        }

        $barang->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Menu berhasil diperbarui',
            'data' => $barang
        ], 200);
    }

    /**
     * Hapus barang sekaligus hapus file fotonya di server.
     */
    public function destroy(Barang $barang): JsonResponse
    {
        if ($barang->user_id !== Auth::id()) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        // Hapus file fisik foto produk sebelum menghapus baris data di db
        if ($barang->foto_barang && Storage::disk('public')->exists($barang->foto_barang)) {
            Storage::disk('public')->delete($barang->foto_barang);
        }

        $barang->delete();

        return response()->json([
            'success' => true,
            'message' => 'Menu berhasil dihapus dari database'
        ], 200);
    }
}