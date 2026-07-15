<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\QueryException; 
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class BarangController extends Controller
{
    /**
     * FITUR: List Semua Data Barang
     * ENDPOINT: GET /api/barang
     * AKSES: Terproteksi Token (Hanya mengambil data barang milik user yang login)
     */
   public function index(): JsonResponse
   {
        $barang = Barang::with('kategori')
            ->where('user_id', Auth::id())
            ->latest() 
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Data barang berhasil diambil',
            'data' => $barang,
        ]);
   }

   /**
     * FITUR: Tambah Barang/Menu Baru
     * ENDPOINT: POST /api/barang
     * AKSES: Terproteksi Token (Menyertakan upload foto ke Laravel Storage)
     */
   public function store(Request $request): JsonResponse
   {
        $validated = $request->validate([
            'kategori_id' => 'required|exists:kategoris,id',
            'nama_barang' => 'required|string|max:255',
            'harga_barang' => 'required|integer|min:0',
            'stok_barang' => 'required|integer|min:0',
            'deskripsi_barang' => 'nullable|string',
            'foto_barang' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $fotoPath = null;
    if ($request->hasFile('foto_barang')) {
        $uploadResult = Cloudinary::uploadApi()->upload(  
            $request->file('foto_barang')->getRealPath(),
            ['folder' => 'cafe_metrics']
        );
        $fotoPath = $uploadResult['secure_url'];           
    }

        $barang = Barang::create([
            'kategori_id' => $validated['kategori_id'],
            'user_id' => Auth::id(),
            'nama_barang' => $validated['nama_barang'],
            'harga_barang' => $validated['harga_barang'],
            'stok_barang' => $validated['stok_barang'],
            'deskripsi_barang' => $validated['deskripsi_barang'] ?? null,
            'foto_barang' => $fotoPath,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Barang berhasil ditambahkan',
            'data' => $barang->load('kategori'),
        ], 201);
   }

   /**
 * FITUR: Update Barang
 * ENDPOINT: PUT /api/barang/{id}
 * AKSES: Terproteksi Token
 */
public function update(Request $request, int $id): JsonResponse
{
    $barang = Barang::where('id', $id)
        ->where('user_id', Auth::id())
        ->first();

    if (!$barang) {
        return response()->json([
            'status' => false,
            'message' => 'Barang tidak ditemukan',
            'data' => null,
        ], 404);
    }

    // Validasi dulu
    $validated = $request->validate([
        'kategori_id' => 'required|exists:kategoris,id',
        'nama_barang' => 'required|string|max:255',
        'harga_barang' => 'required|integer|min:0',
        'stok_barang' => 'required|integer|min:0',
        'deskripsi_barang' => 'nullable|string',
        'foto_barang' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
    ]);

    // Proses upload jika ada file baru
    if ($request->hasFile('foto_barang')) {
        // Hapus foto lama dari Cloudinary jika ada
        if ($barang->foto_public_id) {
            Cloudinary::uploadApi()->destroy($barang->foto_public_id);
        }

        $uploadResult = Cloudinary::uploadApi()->upload(
            $request->file('foto_barang')->getRealPath(),
            ['folder' => 'cafe_metrics']
        );
        $barang->foto_barang = $uploadResult['secure_url'];
        $barang->foto_public_id = $uploadResult['public_id'];
    }

    // Update data barang
    $barang->update([
        'kategori_id' => $validated['kategori_id'],
        'nama_barang' => $validated['nama_barang'],
        'harga_barang' => $validated['harga_barang'],
        'stok_barang' => $validated['stok_barang'],
        'deskripsi_barang' => $validated['deskripsi_barang'] ?? $barang->deskripsi_barang,
    ]);

    return response()->json([
        'status' => true,
        'message' => 'Barang berhasil diperbarui',
        'data' => $barang->fresh()->load('kategori'),
    ]);
}

/**
 * FITUR: Hapus Barang
 * ENDPOINT: DELETE /api/barang/{id}
 * AKSES: Terproteksi Token
 */
public function destroy(int $id): JsonResponse
{
    $barang = Barang::where('id', $id)
        ->where('user_id', Auth::id())
        ->first();

    if (!$barang) {
        return response()->json([
            'status' => false,
            'message' => 'Barang tidak ditemukan',
            'data' => null,
        ], 404);
    }

    try {
        if ($barang->foto_public_id) {
            Cloudinary::uploadApi()->destroy($barang->foto_public_id);
        }

        $barang->delete();
    } catch (QueryException $e) {
        if ($e->getCode() == 23000) {
            return response()->json([
                'status' => false,
                'message' => 'Barang tidak dapat dihapus karena masih memiliki riwayat penjualan.',
                'data' => null,
            ], 422);
        }
        throw $e;
    }

    return response()->json([
        'status' => true,
        'message' => 'Barang berhasil dihapus',
        'data' => null,
    ]);
}
}