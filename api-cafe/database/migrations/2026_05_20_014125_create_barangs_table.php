<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
{
    Schema::create('barangs', function (Blueprint $table) {
        $table->id();
        $table->foreignId('kategori_id')->constrained('kategoris')->cascadeOnDelete();
        $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
        $table->string('nama_barang');
        $table->integer('harga_barang');
        $table->integer('stok_barang');
        $table->text('deskripsi_barang')->nullable();
        $table->string('foto_barang')->nullable();
        $table->timestamps();
    });
}

    public function down(): void
    {
        Schema::dropIfExists('barangs');
    }
};
