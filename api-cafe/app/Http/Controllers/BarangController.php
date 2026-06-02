<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
           $uploaded = cloudinary()->upload(
                $request->file('foto_barang')->getRealPath(),
                ['folder' => 'cafe_metrics']
            );
            $fotoPath = $uploaded->getSecurePath();
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

}