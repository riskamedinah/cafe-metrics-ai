<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\BarangController;
use App\Http\Controllers\PenjualanController;
use App\Http\Controllers\RingkasanBulananController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PasswordResetController;

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [PasswordResetController::class, 'reset']);

// Protected Routes (Requires Authentication)
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/dashboard', [PenjualanController::class, 'dashboardSummary']);

    // Kategori
    Route::get('/kategori', [KategoriController::class, 'index']);
    Route::post('/kategori', [KategoriController::class, 'store']);
    Route::put('/kategori/{id}', [KategoriController::class, 'update']);
    Route::delete('/kategori/{id}', [KategoriController::class, 'destroy']);

    // Barang
    Route::get('/barang', [BarangController::class, 'index']);
    Route::post('/barang', [BarangController::class, 'store']);
    Route::put('/barang/{id}', [BarangController::class, 'update']);     
    Route::delete('/barang/{id}', [BarangController::class, 'destroy']);

    // Penjualan
    Route::get('/penjualan', [PenjualanController::class, 'index']);
    Route::post('/penjualan', [PenjualanController::class, 'store']);
    Route::put('/penjualan/{id}', [PenjualanController::class, 'update']);
    Route::delete('/penjualan/{id}', [PenjualanController::class, 'destroy']);

    // Ringkasan Bulanan
    Route::post('/ringkasan/hitung', [RingkasanBulananController::class, 'hitungStatistik']);
    Route::get('/ringkasan', [RingkasanBulananController::class, 'index']);
    Route::post('/ringkasan', [RingkasanBulananController::class, 'store']);
    Route::post('/generate-ai', [RingkasanBulananController::class, 'generateAi']);

});