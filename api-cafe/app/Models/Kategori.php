<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kategori extends Model
{
    protected $fillable =
    [
        'user_id',
        'nama_kategori'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function barangs() {
        return $this->hasMany(Barang::class);
    }
}
