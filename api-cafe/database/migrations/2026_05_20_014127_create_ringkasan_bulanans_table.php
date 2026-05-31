<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void
{
    Schema::create('ringkasan_bulanans', function (Blueprint $table) {
       $table->id();
       $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
       $table->integer('bulan');
       $table->integer('tahun');
       $table->integer('total_omzet')->default(0);
       $table->integer('total_item_terjual')->default(0);
       $table->text('analisis_ai');
       $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ringkasan_bulanans');
    }
};
