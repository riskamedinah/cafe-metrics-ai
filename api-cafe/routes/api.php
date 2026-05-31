<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\BarangController;
use App\Http\Controllers\PenjualanController;
use App\Http\Controllers\RingkasanBulananController;
use App\Http\Controllers\AuthController; // <-- Nanti kita bikin ini

// 🔓 Rute Terbuka (Bisa diakses siapa saja untuk dapet token)
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

// 🔒 Rute Terkunci (Wajib bawa Bearer Token hasil login)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);

    Route::apiResource('kategori', KategoriController::class);
    Route::apiResource('barang', BarangController::class);
    Route::apiResource('penjualan', PenjualanController::class);

    Route::post('ringkasan/hitung', [RingkasanBulananController::class, 'hitungStatistik']);
    Route::get('ringkasan', [RingkasanBulananController::class, 'index']);
    Route::post('ringkasan', [RingkasanBulananController::class, 'store']);
});