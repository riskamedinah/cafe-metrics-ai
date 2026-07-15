<?php

namespace App\Http\Controllers;

use App\Models\Kategori;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class KategoriController extends Controller
{
    /**
     * FITUR: List Semua Data Kategori
     * ENDPOINT: GET /api/kategori
     * AKSES: Terproteksi Token (Hanya mengambil data milik user yang login)
     * @return JsonResponse
     */
   public function index(): JsonResponse
    {
        $kategoris = Kategori::where('user_id', Auth::id())->latest()->get();

        return response()->json([
            'status' => true,
            'message' => 'Data kategori berhasil diambil',
            'data' => $kategoris,
        ]);
    }

    /**
     * FITUR: Membuat Kategori Baru
     * ENDPOINT: POST /api/kategori
     * AKSES: Terproteksi Token
     * @param Request $request [nama_kategori]
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama_kategori' => 'required|string|max:255',
        ]);

        $kategori = Kategori::create([
            'user_id' => Auth::id(),
            'nama_kategori' => $validated['nama_kategori'],
        ]); 

        return response()->json([
            'status' => true,
            'message' => 'Kategori berhasil ditambahkan',
            'data' => $kategori,
        ], 201);
    }

    /**
     * FITUR: Mengubah Data Kategori
     * ENDPOINT: PUT /api/kategori/{id}
     * AKSES: Terproteksi Token (Hanya bisa mengubah milik sendiri)
     * @param Request $request [nama_kategori]
     * @param int $id
     * @return JsonResponse
     */
    public function update(Request $request, $id): JsonResponse
    {
        $kategori = Kategori::where('id', $id)
            ->where('user_id', Auth::id())
            ->first();

        if (!$kategori) {
            return response()->json([
                'status' => false,
                'message' => 'Kategori tidak ditemukan',
                'data' => null,
            ], 404);
        }

        $validated = $request->validate([
            'nama_kategori' => 'required|string|max:255',
        ]);

        $kategori->update($validated);

        return response()->json([
            'status' => true,
            'message' => 'Kategori berhasil diperbarui',
            'data' => $kategori,
        ]);
    }

    /**
     * FITUR: Menghapus Kategori
     * ENDPOINT: DELETE /api/kategori/{id}
     * AKSES: Terproteksi Token (Hanya bisa menghapus milik sendiri)
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $kategori = Kategori::where('id', $id)
            ->where('user_id', Auth::id())
            ->first();

        if (!$kategori) {
            return response()->json([
                'status' => false,
                'message' => 'Kategori tidak ditemukan',
                'data' => null,
            ], 404);
        }

        $kategori->delete();

        return response()->json([
            'status' => true,
            'message' => 'Kategori berhasil dihapus',
            'data' => null,
        ]);
    }

}