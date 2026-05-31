<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateBarangRequest extends FormRequest
{
  public function authorize(): bool
{
    return true; // Wajib di-true
}

public function rules(): array
{
    // Untuk edit, aturannya mirip dengan simpan baru
    return [
        'kategori_id'      => 'required|exists:kategoris,id',
        'nama_barang'      => 'required|string|max:255',
        'harga_barang'     => 'required|integer|min:0',
        'stok_barang'      => 'required|integer|min:0',
        'deskripsi_barang' => 'nullable|string',
        'foto_barang'      => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
    ];
}
}
