<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Kategori;
use App\Models\Barang;
use App\Models\Penjualan;
use App\Models\RingkasanBulanan;

class MockDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Users
        $owner = User::create([
            'id' => 1,
            'name' => 'Owner Cafe',
            'email' => 'owner@cafe.com',
            'password' => Hash::make('password321'),
        ]);

        $user = User::create([
            'id' => 2,
            'name' => 'User Cafe',
            'email' => 'user@cafe.com',
            'password' => Hash::make('password123'),
        ]);

        // 2. Seed Kategori
        $kategoriCoffee = Kategori::create([
            'id' => 1,
            'user_id' => $owner->id,
            'nama_kategori' => 'Coffee Base',
        ]);

        $kategoriNonCoffee = Kategori::create([
            'id' => 2,
            'user_id' => $owner->id,
            'nama_kategori' => 'Non Coffee',
        ]);

        $kategoriSnack = Kategori::create([
            'id' => 3,
            'user_id' => $owner->id,
            'nama_kategori' => 'Snack',
        ]);

        $kategoriTea = Kategori::create([
            'id' => 4,
            'user_id' => $owner->id,
            'nama_kategori' => 'Tea',
        ]);

        $kategoriDessert = Kategori::create([
            'id' => 5,
            'user_id' => $owner->id,
            'nama_kategori' => 'Dessert',
        ]);

        // 3. Seed Barang
        $barangs = [
            [
                'id' => 1,
                'user_id' => $owner->id,
                'kategori_id' => $kategoriCoffee->id,
                'nama_barang' => 'Espresso',
                'harga_barang' => 18000,
                'stok_barang' => 50,
                'deskripsi_barang' => 'Ekstrak kopi murni dengan aroma pekat khas pilihan barista.',
                'foto_barang' => 'https://res.cloudinary.com/dr4vebyea/image/upload/v1787565474/zoyugru1y2wkiipaofro.webp',
                'foto_public_id' => 'zoyugru1y2wkiipaofro',
            ],
            [
                'id' => 2,
                'user_id' => $owner->id,
                'kategori_id' => $kategoriCoffee->id,
                'nama_barang' => 'Americano',
                'harga_barang' => 16000,
                'stok_barang' => 50,
                'deskripsi_barang' => 'Espresso dengan tambahan air panas, rasa mantap & bersih.',
                'foto_barang' => 'https://res.cloudinary.com/dr4vebyea/image/upload/v1787565464/oxeozk6pbcz4fpiq3gbj.jpg',
                'foto_public_id' => 'oxeozk6pbcz4fpiq3gbj',
            ],
            [
                'id' => 3,
                'user_id' => $owner->id,
                'kategori_id' => $kategoriNonCoffee->id,
                'nama_barang' => 'Matcha Latte',
                'harga_barang' => 25000,
                'stok_barang' => 35,
                'deskripsi_barang' => 'Bubuk matcha autentik dipadukan dengan susu segar lembut.',
                'foto_barang' => 'https://res.cloudinary.com/dr4vebyea/image/upload/v1787565455/a5jxvohgalkxq1isolak.jpg',
                'foto_public_id' => 'a5jxvohgalkxq1isolak',
            ],
            [
                'id' => 4,
                'user_id' => $owner->id,
                'kategori_id' => $kategoriNonCoffee->id,
                'nama_barang' => 'Chocolate Hot',
                'harga_barang' => 23000,
                'stok_barang' => 30,
                'deskripsi_barang' => 'Cokelat hangat kaya rasa dengan kelembutan krimer pilihan.',
                'foto_barang' => 'https://res.cloudinary.com/dr4vebyea/image/upload/v1787565439/caztw3xeoss6tha3sdyd.jpg',
                'foto_public_id' => 'caztw3xeoss6tha3sdyd',
            ],
            [
                'id' => 5,
                'user_id' => $owner->id,
                'kategori_id' => $kategoriSnack->id,
                'nama_barang' => 'Onion Rings',
                'harga_barang' => 17000,
                'stok_barang' => 40,
                'deskripsi_barang' => 'Bawang bombay renyah digoreng keemasan dengan saus gurih.',
                'foto_barang' => 'https://res.cloudinary.com/dr4vebyea/image/upload/v1787565427/icksozzxu8o3sdhk7r6e.jpg',
                'foto_public_id' => 'icksozzxu8o3sdhk7r6e',
            ],
            [
                'id' => 6,
                'user_id' => $owner->id,
                'kategori_id' => $kategoriSnack->id,
                'nama_barang' => 'Garlic Bread',
                'harga_barang' => 19000,
                'stok_barang' => 35,
                'deskripsi_barang' => 'Roti panggang mentega bawang yang wangi dan renyah.',
                'foto_barang' => 'https://res.cloudinary.com/dr4vebyea/image/upload/v1787565416/r5y8h2ttkiwqe6veixxh.jpg',
                'foto_public_id' => 'r5y8h2ttkiwqe6veixxh',
            ],
            [
                'id' => 7,
                'user_id' => $owner->id,
                'kategori_id' => $kategoriTea->id,
                'nama_barang' => 'Thai Tea',
                'harga_barang' => 16000,
                'stok_barang' => 50,
                'deskripsi_barang' => 'Teh khas Thailand beraroma rempah manis dipadu susu.',
                'foto_barang' => 'https://res.cloudinary.com/dr4vebyea/image/upload/v1787565404/qqvwfjehslluzbqjniw4.png',
                'foto_public_id' => 'qqvwfjehslluzbqjniw4',
            ],
            [
                'id' => 8,
                'user_id' => $owner->id,
                'kategori_id' => $kategoriTea->id,
                'nama_barang' => 'Jasmine Green Tea',
                'harga_barang' => 14000,
                'stok_barang' => 60,
                'deskripsi_barang' => 'Teh hijau melati menyegarkan, cocok untuk bersantai.',
                'foto_barang' => 'https://res.cloudinary.com/dr4vebyea/image/upload/v1787565392/xtn3ljnvlnih4txama8h.jpg',
                'foto_public_id' => 'xtn3ljnvlnih4txama8h',
            ],
            [
                'id' => 9,
                'user_id' => $owner->id,
                'kategori_id' => $kategoriDessert->id,
                'nama_barang' => 'Croissant Butter',
                'harga_barang' => 24000,
                'stok_barang' => 25,
                'deskripsi_barang' => 'Pastry berlapis mentega kaya rasa, empuk dan renyah.',
                'foto_barang' => 'https://res.cloudinary.com/dr4vebyea/image/upload/v1787565384/km0daq6bqd89wep7aglw.png',
                'foto_public_id' => 'km0daq6bqd89wep7aglw',
            ],
            [
                'id' => 10,
                'user_id' => $owner->id,
                'kategori_id' => $kategoriDessert->id,
                'nama_barang' => 'Waffle Ice Cream',
                'harga_barang' => 28000,
                'stok_barang' => 20,
                'deskripsi_barang' => 'Waffle hangat disajikan dengan topping es krim vanila lezat.',
                'foto_barang' => 'https://res.cloudinary.com/dr4vebyea/image/upload/v1787565369/vxuegpbtgmdoo5sgwaxy.jpg',
                'foto_public_id' => 'vxuegpbtgmdoo5sgwaxy',
            ],
            [
                'id' => 11,
                'user_id' => $owner->id,
                'kategori_id' => $kategoriCoffee->id,
                'nama_barang' => 'Cold Brew',
                'harga_barang' => 22000,
                'stok_barang' => 30,
                'deskripsi_barang' => 'Kopi seduh dingin ekstraksi 12 jam, menghasilkan rasa halus dan rendah asam.',
                'foto_barang' => 'https://res.cloudinary.com/dr4vebyea/image/upload/v1787569329/tsbjmvuw6ygnauuzqpgz.jpg',
                'foto_public_id' => 'tsbjmvuw6ygnauuzqpgz',
            ],
            [
                'id' => 12,
                'user_id' => $owner->id,
                'kategori_id' => $kategoriCoffee->id,
                'nama_barang' => 'Caramel Macchiato',
                'harga_barang' => 26000,
                'stok_barang' => 40,
                'deskripsi_barang' => 'Espresso dengan paduan susu segar, sirup vanila, dan siraman karamel gurih.',
                'foto_barang' => 'https://res.cloudinary.com/dr4vebyea/image/upload/v1787569212/h0oypjwjro5bnre3fgnd.jpg',
                'foto_public_id' => 'h0oypjwjro5bnre3fgnd',
            ],
        ];

        foreach ($barangs as $barang) {
            Barang::create($barang);
        }

        // 4. Seed Penjualan (Ditambah variasi data hingga Agustus 2026)
        $penjualans = [
            // --- April 2026 ---
            ['id' => 1, 'barang_id' => 2, 'user_id' => $owner->id, 'jumlah' => 10, 'total_harga' => 160000, 'created_at' => '2026-04-10 10:00:00'],
            ['id' => 2, 'barang_id' => 9, 'user_id' => $owner->id, 'jumlah' => 5, 'total_harga' => 120000, 'created_at' => '2026-04-18 14:20:00'],
            ['id' => 3, 'barang_id' => 3, 'user_id' => $owner->id, 'jumlah' => 8, 'total_harga' => 200000, 'created_at' => '2026-04-25 09:15:00'],

            // --- Mei 2026 ---
            ['id' => 4, 'barang_id' => 2, 'user_id' => $owner->id, 'jumlah' => 12, 'total_harga' => 192000, 'created_at' => '2026-05-08 11:30:00'],
            ['id' => 5, 'barang_id' => 10, 'user_id' => $owner->id, 'jumlah' => 5, 'total_harga' => 140000, 'created_at' => '2026-05-14 16:45:00'],
            ['id' => 6, 'barang_id' => 6, 'user_id' => $owner->id, 'jumlah' => 10, 'total_harga' => 190000, 'created_at' => '2026-05-22 13:10:00'],

            // --- Juni 2026 ---
            ['id' => 7, 'barang_id' => 7, 'user_id' => $owner->id, 'jumlah' => 15, 'total_harga' => 240000, 'created_at' => '2026-06-05 10:05:00'],
            ['id' => 8, 'barang_id' => 5, 'user_id' => $owner->id, 'jumlah' => 10, 'total_harga' => 170000, 'created_at' => '2026-06-14 15:00:00'],
            ['id' => 9, 'barang_id' => 9, 'user_id' => $owner->id, 'jumlah' => 8, 'total_harga' => 192000, 'created_at' => '2026-06-21 14:00:00'],

            // --- Juli 2026 ---
            ['id' => 10, 'barang_id' => 1, 'user_id' => $owner->id, 'jumlah' => 20, 'total_harga' => 360000, 'created_at' => '2026-07-04 09:30:00'],
            ['id' => 11, 'barang_id' => 8, 'user_id' => $owner->id, 'jumlah' => 15, 'total_harga' => 210000, 'created_at' => '2026-07-12 17:20:00'],
            ['id' => 12, 'barang_id' => 4, 'user_id' => $owner->id, 'jumlah' => 6, 'total_harga' => 138000, 'created_at' => '2026-07-19 11:45:00'],

            // --- Agustus 2026 ---
            ['id' => 13, 'barang_id' => 3, 'user_id' => $owner->id, 'jumlah' => 10, 'total_harga' => 250000, 'created_at' => '2026-08-02 10:15:00'],
            ['id' => 14, 'barang_id' => 1, 'user_id' => $owner->id, 'jumlah' => 15, 'total_harga' => 270000, 'created_at' => '2026-08-05 11:40:00'],
            ['id' => 15, 'barang_id' => 7, 'user_id' => $owner->id, 'jumlah' => 12, 'total_harga' => 192000, 'created_at' => '2026-08-09 13:25:00'],
            ['id' => 16, 'barang_id' => 10, 'user_id' => $owner->id, 'jumlah' => 8, 'total_harga' => 224000, 'created_at' => '2026-08-12 16:20:00'],
            ['id' => 17, 'barang_id' => 6, 'user_id' => $owner->id, 'jumlah' => 12, 'total_harga' => 228000, 'created_at' => '2026-08-15 12:00:00'],
            ['id' => 18, 'barang_id' => 2, 'user_id' => $owner->id, 'jumlah' => 10, 'total_harga' => 160000, 'created_at' => '2026-08-19 14:10:00'],
            ['id' => 19, 'barang_id' => 5, 'user_id' => $owner->id, 'jumlah' => 8, 'total_harga' => 136000, 'created_at' => '2026-08-22 15:45:00'],
            ['id' => 20, 'barang_id' => 4, 'user_id' => $owner->id, 'jumlah' => 7, 'total_harga' => 161000, 'created_at' => '2026-08-24 17:00:00'],
        ];

        foreach ($penjualans as $penjualan) {
            Penjualan::create($penjualan);
        }

        // 5. Seed RingkasanBulanan (Total kalkulasi sudah disesuaikan persis dengan data Penjualan)
        $ringkasans = [
            [
                'id' => 1,
                'user_id' => $owner->id,
                'bulan' => '04',
                'tahun' => '2026',
                'total_penjualan' => 3,
                'total_omzet' => 480000,
                'total_item_terjual' => 23,
                'analisis_ai' => 'Penjualan bulan April didominasi oleh minuman Matcha Latte dan Americano. Produk Croissant Butter mulai diminati sebagai pendamping kopi.',
                'created_at' => '2026-04-30 23:59:59',
            ],
            [
                'id' => 2,
                'user_id' => $owner->id,
                'bulan' => '05',
                'tahun' => '2026',
                'total_penjualan' => 3,
                'total_omzet' => 522000,
                'total_item_terjual' => 27,
                'analisis_ai' => 'Terjadi peningkatan volume penjualan sebesar 17%. Garlic Bread dan Waffle Ice Cream menjadi kontributor pendapatan terbesar bulan ini.',
                'created_at' => '2026-05-31 23:59:59',
            ],
            [
                'id' => 3,
                'user_id' => $owner->id,
                'bulan' => '06',
                'tahun' => '2026',
                'total_penjualan' => 3,
                'total_omzet' => 602000,
                'total_item_terjual' => 33,
                'analisis_ai' => 'Thai Tea dan Onion Rings sangat diminati pelanggan di pertengahan tahun. Tren penjualan makanan ringan (Snack) menunjukkan grafik positif.',
                'created_at' => '2026-06-30 23:59:59',
            ],
            [
                'id' => 4,
                'user_id' => $owner->id,
                'bulan' => '07',
                'tahun' => '2026',
                'total_penjualan' => 3,
                'total_omzet' => 708000,
                'total_item_terjual' => 41,
                'analisis_ai' => 'Bulan dengan performa tertinggi. Espresso mencetak rekor penjualan terbanyak, disusul tingginya permintaan Jasmine Green Tea.',
                'created_at' => '2026-07-31 23:59:59',
            ],
        ];

        foreach ($ringkasans as $ringkasan) {
            RingkasanBulanan::create($ringkasan);
        }
    }
}