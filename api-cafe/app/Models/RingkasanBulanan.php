<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RingkasanBulanan extends Model
{
   protected $fillable = [
        'user_id',
        'bulan',
        'tahun',
          'total_penjualan', 
        'total_omzet',
        'total_item_terjual',
        'analisis_ai'
   ];

   public function user() {
        return $this->belongsTo(User::class);
   }
}