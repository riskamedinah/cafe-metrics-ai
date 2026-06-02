<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/tes-ambil-url', function () {
    // 1. Proses upload gambar tiruan ke Cloudinary
    $uploaded = app(\Cloudinary\Cloudinary::class)
        ->uploadApi()
        ->upload('https://picsum.photos/400/300', [
            'folder' => 'cafe_tes_routes'
        ]);

    // 2. CARA AKSES TEKS URL-NYA
    // Kita simpan string URL-nya ke dalam variabel $urlAsli
    $urlAsli = $uploaded['secure_url'];

    // 3. Tampilkan di browser dalam bentuk JSON biar kelihatan struktur teksnya
    return response()->json([
        'status' => 'Berhasil mendapatkan string URL!',
        'teks_url_db' => $urlAsli, 
        'catatan' => 'Variabel $urlAsli inilah yang nantinya kamu insert ke database.'
    ]);
});