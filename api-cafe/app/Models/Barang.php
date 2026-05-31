<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Barang extends Model
{
   protected $fillable = [
       'kategori_id',
       'user_id',
       'nama_barang',
       'harga_barang',
       'stok_barang',
       'deskripsi_barang',
       'foto_barang'
   ];

   protected $appends = ['foto_url'];

   public function getFotoUrlAttribute(): ?string{
        return $this->foto_barang ? Storage::url($this->foto_barang) : null;
   }
    
   public function kategori() {
        return $this->belongsTo(Kategori::class);
   }

   public function user() {
        return $this->belongsTo(User::class);
   }
        
}