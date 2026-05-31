<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Penjualan extends Model
{
   protected $fillable = [
        'barang_id',
        'user_id',
        'jumlah',
        'total_harga'
   ];

   public function barang() {
        return $this->belongsTo(Barang::class);
   }

   public function user() {
        return $this->belongsTo(User::class);
   }
        
}