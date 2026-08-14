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
        // 1. Buat User Contoh
        $owner = User::create([
            'id' => 6,
            'name' => 'Owner Cafe',
            'email' => 'owner@cafe.com',
            'password' => Hash::make('password321'),
            'created_at' => '2026-01-01 00:00:00',
            'updated_at' => '2026-01-01 00:00:00',
        ]);

        User::create([
            'id' => 7,
            'name' => 'User Cafe',
            'email' => 'user@cafe.com',
            'password' => Hash::make('user123'),
            'created_at' => '2026-01-01 00:00:00',
            'updated_at' => '2026-01-01 00:00:00',
        ]);

        // 2. Buat Kategori
        $kategoris = [
            ['id' => 3, 'user_id' => $owner->id, 'nama_kategori' => 'Fashion', 'created_at' => '2026-07-02 13:49:53', 'updated_at' => '2026-07-08 02:05:20'],
            ['id' => 4, 'user_id' => $owner->id, 'nama_kategori' => 'Merchandise', 'created_at' => '2026-07-02 13:49:53', 'updated_at' => '2026-07-02 13:49:53'],
            ['id' => 5, 'user_id' => $owner->id, 'nama_kategori' => 'Footwear', 'created_at' => '2026-08-01 08:00:00', 'updated_at' => '2026-08-01 08:00:00'],
            ['id' => 6, 'user_id' => $owner->id, 'nama_kategori' => 'Bags', 'created_at' => '2026-08-01 08:00:00', 'updated_at' => '2026-08-01 08:00:00'],
            ['id' => 7, 'user_id' => $owner->id, 'nama_kategori' => 'Equipment', 'created_at' => '2026-08-01 08:00:00', 'updated_at' => '2026-08-01 08:00:00'],
            ['id' => 8, 'user_id' => $owner->id, 'nama_kategori' => 'Accessories', 'created_at' => '2026-08-01 08:00:00', 'updated_at' => '2026-08-01 08:00:00'],
        ];

        foreach ($kategoris as $k) {
            Kategori::create($k);
        }

        // 3. Buat Barang (20 Item Cloudinary)
        $barangs = [
            ['id' => 2, 'kategori_id' => 3, 'user_id' => $owner->id, 'nama_barang' => 'Sepatu Running', 'harga_barang' => 100000, 'stok_barang' => 52, 'deskripsi_barang' => 'Asics Gel Trabuco 12.', 'foto_barang' => 'https://res.cloudinary.com/dr4vebyea/image/upload/v1786732577/qzehk9zugmbmcd8jvlnj.svg', 'created_at' => '2026-05-01 08:30:00', 'updated_at' => '2026-05-01 08:30:00'],
            ['id' => 3, 'kategori_id' => 4, 'user_id' => $owner->id, 'nama_barang' => 'Tumbler Stainless', 'harga_barang' => 150000, 'stok_barang' => 50, 'deskripsi_barang' => 'Vacuum Insulated 600ml.', 'foto_barang' => 'https://res.cloudinary.com/dr4vebyea/image/upload/v1786732576/arpewpvg3slbt5skflc8.svg', 'created_at' => '2026-05-01 08:30:00', 'updated_at' => '2026-05-01 08:30:00'],
            ['id' => 4, 'kategori_id' => 3, 'user_id' => $owner->id, 'nama_barang' => 'Tas Ransel', 'harga_barang' => 80000, 'stok_barang' => 49, 'deskripsi_barang' => 'Water Resistant, muat laptop 15 inch.', 'foto_barang' => 'https://res.cloudinary.com/dr4vebyea/image/upload/v1786732577/g02jrlxnuulj9lb9sqec.svg', 'created_at' => '2026-05-01 08:30:00', 'updated_at' => '2026-05-01 08:30:00'],
            ['id' => 5, 'kategori_id' => 3, 'user_id' => $owner->id, 'nama_barang' => 'Kaos Activewear', 'harga_barang' => 120000, 'stok_barang' => 51, 'deskripsi_barang' => 'Black Cotton Breathable Fit.', 'foto_barang' => 'https://res.cloudinary.com/dr4vebyea/image/upload/v1786732577/doohzkyhjnhgac2igisk.svg', 'created_at' => '2026-05-01 08:30:00', 'updated_at' => '2026-05-01 08:30:00'],
            ['id' => 6, 'kategori_id' => 3, 'user_id' => $owner->id, 'nama_barang' => 'Jaket Windbreaker', 'harga_barang' => 220000, 'stok_barang' => 30, 'deskripsi_barang' => 'Ultra-lightweight & water repellent untuk running harian.', 'foto_barang' => 'https://res.cloudinary.com/dr4vebyea/image/upload/v1786732996/yvp5vuhyxs11ltp0v8pi.jpg', 'created_at' => '2026-05-02 09:00:00', 'updated_at' => '2026-05-02 09:00:00'],
            ['id' => 7, 'kategori_id' => 3, 'user_id' => $owner->id, 'nama_barang' => 'Celana Jogger Training', 'harga_barang' => 145000, 'stok_barang' => 40, 'deskripsi_barang' => 'Bahan fleece fleksibel dan nyaman untuk olahraga maupun daily wear.', 'foto_barang' => 'https://res.cloudinary.com/dr4vebyea/image/upload/v1786733055/sav6ykwjsutjz3bcvoxm.webp', 'created_at' => '2026-05-02 09:00:00', 'updated_at' => '2026-05-02 09:00:00'],
            ['id' => 8, 'kategori_id' => 3, 'user_id' => $owner->id, 'nama_barang' => 'Hoodie Sport', 'harga_barang' => 210000, 'stok_barang' => 25, 'deskripsi_barang' => 'Warm fleece lining nyaman untuk pemulihan suhu.', 'foto_barang' => 'https://res.cloudinary.com/dr4vebyea/image/upload/v1786733076/elw8v6kvzm04apujuuj0.jpg', 'created_at' => '2026-05-02 09:00:00', 'updated_at' => '2026-05-02 09:00:00'],
            ['id' => 9, 'kategori_id' => 3, 'user_id' => $owner->id, 'nama_barang' => 'Jersey Training', 'harga_barang' => 135000, 'stok_barang' => 45, 'deskripsi_barang' => 'Anti-odor technology dengan bahan elastis.', 'foto_barang' => 'https://res.cloudinary.com/dr4vebyea/image/upload/v1786733097/be7pbzgcxxx6jmkeadco.jpg', 'created_at' => '2026-05-02 09:00:00', 'updated_at' => '2026-05-02 09:00:00'],
            ['id' => 10, 'kategori_id' => 5, 'user_id' => $owner->id, 'nama_barang' => 'Sneaker Casual White', 'harga_barang' => 280000, 'stok_barang' => 20, 'deskripsi_barang' => 'Minimalist leather sneakers untuk aktivitas harian.', 'foto_barang' => 'https://res.cloudinary.com/dr4vebyea/image/upload/v1786733113/pmtci2ggbjbdapw5cxwm.jpg', 'created_at' => '2026-05-03 10:15:00', 'updated_at' => '2026-05-03 10:15:00'],
            ['id' => 11, 'kategori_id' => 5, 'user_id' => $owner->id, 'nama_barang' => 'Sandal Slide', 'harga_barang' => 85000, 'stok_barang' => 60, 'deskripsi_barang' => 'Soft EVA Cushion fleksibel pasca berolahraga.', 'foto_barang' => 'https://res.cloudinary.com/dr4vebyea/image/upload/v1786733130/o8eze8qqlieu27na7hp5.jpg', 'created_at' => '2026-05-03 10:15:00', 'updated_at' => '2026-05-03 10:15:00'],
            ['id' => 12, 'kategori_id' => 5, 'user_id' => $owner->id, 'nama_barang' => 'Sepatu Trail Pro', 'harga_barang' => 350000, 'stok_barang' => 15, 'deskripsi_barang' => 'High traction outsole khusus medan tanah/bebatuan.', 'foto_barang' => 'https://res.cloudinary.com/dr4vebyea/image/upload/v1786733741/andlcf010p3hyouvvunn.jpg', 'created_at' => '2026-05-03 10:15:00', 'updated_at' => '2026-05-03 10:15:00'],
            ['id' => 13, 'kategori_id' => 6, 'user_id' => $owner->id, 'nama_barang' => 'Tas Waistbag', 'harga_barang' => 95000, 'stok_barang' => 40, 'deskripsi_barang' => 'Compact & waterproof untuk menyimpan barang kecil.', 'foto_barang' => 'https://res.cloudinary.com/dr4vebyea/image/upload/v1786733727/ixsiuthxhohcgraofonh.webp', 'created_at' => '2026-05-04 11:20:00', 'updated_at' => '2026-05-04 11:20:00'],
            ['id' => 14, 'kategori_id' => 6, 'user_id' => $owner->id, 'nama_barang' => 'Tote Bag Canvas', 'harga_barang' => 45000, 'stok_barang' => 70, 'deskripsi_barang' => 'Heavy canvas tebal untuk membawa perlengkapan ekstra.', 'foto_barang' => 'https://res.cloudinary.com/dr4vebyea/image/upload/v1786733710/ewpvhutdzyhlgd265jwe.webp', 'created_at' => '2026-05-04 11:20:00', 'updated_at' => '2026-05-04 11:20:00'],
            ['id' => 15, 'kategori_id' => 6, 'user_id' => $owner->id, 'nama_barang' => 'Backpack Duffel', 'harga_barang' => 310000, 'stok_barang' => 18, 'deskripsi_barang' => 'Kapasitas 35L serbaguna untuk travel & gym.', 'foto_barang' => 'https://res.cloudinary.com/dr4vebyea/image/upload/v1786733694/cgz5w16c2vsocrr5chlq.jpg', 'created_at' => '2026-05-04 11:20:00', 'updated_at' => '2026-05-04 11:20:00'],
            ['id' => 16, 'kategori_id' => 7, 'user_id' => $owner->id, 'nama_barang' => 'Matras Yoga Latex', 'harga_barang' => 120000, 'stok_barang' => 35, 'deskripsi_barang' => 'Anti-slip latex mat 6mm untuk workout dan yoga.', 'foto_barang' => 'https://res.cloudinary.com/dr4vebyea/image/upload/v1786733676/gwyfvwz5jg3noecjb46p.jpg', 'created_at' => '2026-05-05 13:00:00', 'updated_at' => '2026-05-05 13:00:00'],
            ['id' => 17, 'kategori_id' => 7, 'user_id' => $owner->id, 'nama_barang' => 'Resistance Band Set', 'harga_barang' => 65000, 'stok_barang' => 50, 'deskripsi_barang' => '5 tingkat beban latihan kekuatan otot di rumah.', 'foto_barang' => 'https://res.cloudinary.com/dr4vebyea/image/upload/v1786733660/cw6ne4hvadixygvruvgl.webp', 'created_at' => '2026-05-05 13:00:00', 'updated_at' => '2026-05-05 13:00:00'],
            ['id' => 18, 'kategori_id' => 8, 'user_id' => $owner->id, 'nama_barang' => 'Topi Mesh Cap', 'harga_barang' => 75000, 'stok_barang' => 50, 'deskripsi_barang' => 'Breathable mesh dengan strap reflektif malam hari.', 'foto_barang' => 'https://res.cloudinary.com/dr4vebyea/image/upload/v1786733643/xnvsrtj2q03ea6ujn3x3.jpg', 'created_at' => '2026-05-05 14:10:00', 'updated_at' => '2026-05-05 14:10:00'],
            ['id' => 19, 'kategori_id' => 8, 'user_id' => $owner->id, 'nama_barang' => 'Kaos Kaki Performance', 'harga_barang' => 50000, 'stok_barang' => 90, 'deskripsi_barang' => 'Extra cushioning di area tumit dan jari kaki.', 'foto_barang' => 'https://res.cloudinary.com/dr4vebyea/image/upload/v1786733625/mrewmdmze6duuu92yimv.jpg', 'created_at' => '2026-05-05 14:10:00', 'updated_at' => '2026-05-05 14:10:00'],
            ['id' => 20, 'kategori_id' => 8, 'user_id' => $owner->id, 'nama_barang' => 'Headband Microfiber', 'harga_barang' => 25000, 'stok_barang' => 100, 'deskripsi_barang' => 'Menyerap keringat secara maksimal di dahi.', 'foto_barang' => 'https://res.cloudinary.com/dr4vebyea/image/upload/v1786733606/i8zbeo6tquallcta4h5r.jpg', 'created_at' => '2026-05-05 14:10:00', 'updated_at' => '2026-05-05 14:10:00'],
            ['id' => 21, 'kategori_id' => 8, 'user_id' => $owner->id, 'nama_barang' => 'Handuk Microfiber', 'harga_barang' => 35000, 'stok_barang' => 60, 'deskripsi_barang' => 'Ukuran ringkas, cepat kering dan daya serap tinggi.', 'foto_barang' => 'https://res.cloudinary.com/dr4vebyea/image/upload/v1786733593/iv9k4tqxvldkbsoqntzp.webp', 'created_at' => '2026-05-05 14:10:00', 'updated_at' => '2026-05-05 14:10:00'],
        ];

        foreach ($barangs as $b) {
            Barang::create($b);
        }

        // 4. Buat Penjualan (17 Transaksi Persis)
        $penjualans = [
            ['id' => 1, 'barang_id' => 2, 'user_id' => $owner->id, 'jumlah' => 2, 'total_harga' => 200000, 'created_at' => '2026-04-10 10:00:00', 'updated_at' => '2026-04-10 10:00:00'],
            ['id' => 2, 'barang_id' => 3, 'user_id' => $owner->id, 'jumlah' => 1, 'total_harga' => 150000, 'created_at' => '2026-04-18 14:20:00', 'updated_at' => '2026-04-18 14:20:00'],
            ['id' => 3, 'barang_id' => 5, 'user_id' => $owner->id, 'jumlah' => 3, 'total_harga' => 360000, 'created_at' => '2026-04-25 09:15:00', 'updated_at' => '2026-04-25 09:15:00'],
            ['id' => 4, 'barang_id' => 4, 'user_id' => $owner->id, 'jumlah' => 2, 'total_harga' => 160000, 'created_at' => '2026-05-08 11:30:00', 'updated_at' => '2026-05-08 11:30:00'],
            ['id' => 5, 'barang_id' => 6, 'user_id' => $owner->id, 'jumlah' => 1, 'total_harga' => 220000, 'created_at' => '2026-05-14 16:45:00', 'updated_at' => '2026-05-14 16:45:00'],
            ['id' => 6, 'barang_id' => 7, 'user_id' => $owner->id, 'jumlah' => 2, 'total_harga' => 290000, 'created_at' => '2026-05-22 13:10:00', 'updated_at' => '2026-05-22 13:10:00'],
            ['id' => 7, 'barang_id' => 10, 'user_id' => $owner->id, 'jumlah' => 1, 'total_harga' => 280000, 'created_at' => '2026-06-05 10:05:00', 'updated_at' => '2026-06-05 10:05:00'],
            ['id' => 8, 'barang_id' => 13, 'user_id' => $owner->id, 'jumlah' => 2, 'total_harga' => 190000, 'created_at' => '2026-06-14 15:00:00', 'updated_at' => '2026-06-14 15:00:00'],
            ['id' => 9, 'barang_id' => 16, 'user_id' => $owner->id, 'jumlah' => 2, 'total_harga' => 240000, 'created_at' => '2026-06-21 14:00:00', 'updated_at' => '2026-06-21 14:00:00'],
            ['id' => 10, 'barang_id' => 8, 'user_id' => $owner->id, 'jumlah' => 1, 'total_harga' => 210000, 'created_at' => '2026-07-04 09:30:00', 'updated_at' => '2026-07-04 09:30:00'],
            ['id' => 11, 'barang_id' => 11, 'user_id' => $owner->id, 'jumlah' => 3, 'total_harga' => 255000, 'created_at' => '2026-07-12 17:20:00', 'updated_at' => '2026-07-12 17:20:00'],
            ['id' => 12, 'barang_id' => 15, 'user_id' => $owner->id, 'jumlah' => 1, 'total_harga' => 310000, 'created_at' => '2026-07-19 11:45:00', 'updated_at' => '2026-07-19 11:45:00'],
            ['id' => 13, 'barang_id' => 19, 'user_id' => $owner->id, 'jumlah' => 4, 'total_harga' => 200000, 'created_at' => '2026-07-26 13:50:00', 'updated_at' => '2026-07-26 13:50:00'],
            ['id' => 14, 'barang_id' => 12, 'user_id' => $owner->id, 'jumlah' => 1, 'total_harga' => 350000, 'created_at' => '2026-08-02 08:30:00', 'updated_at' => '2026-08-02 08:30:00'],
            ['id' => 15, 'barang_id' => 9, 'user_id' => $owner->id, 'jumlah' => 2, 'total_harga' => 270000, 'created_at' => '2026-08-06 10:15:00', 'updated_at' => '2026-08-06 10:15:00'],
            ['id' => 16, 'barang_id' => 17, 'user_id' => $owner->id, 'jumlah' => 2, 'total_harga' => 130000, 'created_at' => '2026-08-10 16:10:00', 'updated_at' => '2026-08-10 16:10:00'],
            ['id' => 17, 'barang_id' => 21, 'user_id' => $owner->id, 'jumlah' => 3, 'total_harga' => 105000, 'created_at' => '2026-08-13 14:00:00', 'updated_at' => '2026-08-13 14:00:00'],
        ];

        foreach ($penjualans as $p) {
            Penjualan::create($p);
        }

        // 5. Buat Ringkasan Bulanan (Lengkap dengan Analisis AI)
        $ringkasans = [
            [
                'id' => 1,
                'user_id' => $owner->id,
                'bulan' => 4,
                'tahun' => 2026,
                'total_penjualan' => 3,
                'total_omzet' => 710000,
                'total_item_terjual' => 6,
                'analisis_ai' => "Total omzet periode April 2026 mencapai Rp 710.000 dengan total volume penjualan sebanyak 6 item.\n\nKaos Activewear mendominasi penjualan dengan kontribusi 50,00%, diikuti Sepatu Running sebesar 33,33%, dan Tumbler Stainless sebesar 16,67% dari total volume transaksi.\n\nRekomendasi:\n1. Tingkatkan stok Kaos Activewear dan Sepatu Running untuk mengantisipasi permintaan tinggi.\n2. Pantau pergerakan stok Tumbler Stainless dan item lainnya untuk menghindari penumpukan inventaris yang tidak produktif.",
                'created_at' => '2026-05-01 00:00:00',
                'updated_at' => '2026-05-01 00:00:00',
            ],
            [
                'id' => 2,
                'user_id' => $owner->id,
                'bulan' => 5,
                'tahun' => 2026,
                'total_penjualan' => 3,
                'total_omzet' => 670000,
                'total_item_terjual' => 5,
                'analisis_ai' => "Total omzet periode Mei 2026 mencapai Rp 670.000 dengan total volume penjualan sebanyak 5 item.\n\nTas Ransel mendominasi penjualan dengan kontribusi 40,00%, diikuti Celana Jogger Training sebesar 40,00%, dan Jaket Windbreaker sebesar 20,00% dari total volume transaksi.\n\nRekomendasi:\n1. Tingkatkan stok Tas Ransel dan Celana Jogger Training untuk mengantisipasi permintaan tinggi.\n2. Pantau pergerakan stok Jaket Windbreaker dan item lainnya untuk menghindari penumpukan inventaris yang tidak produktif.",
                'created_at' => '2026-06-01 00:00:00',
                'updated_at' => '2026-06-01 00:00:00',
            ],
            [
                'id' => 3,
                'user_id' => $owner->id,
                'bulan' => 6,
                'tahun' => 2026,
                'total_penjualan' => 3,
                'total_omzet' => 710000,
                'total_item_terjual' => 5,
                'analisis_ai' => "Total omzet periode Juni 2026 mencapai Rp 710.000 dengan total volume penjualan sebanyak 5 item.\n\nTas Waistbag mendominasi penjualan dengan kontribusi 40,00%, diikuti Matras Yoga Latex sebesar 40,00%, dan Sneaker Casual White sebesar 20,00% dari total volume transaksi.\n\nRekomendasi:\n1. Tingkatkan stok Tas Waistbag dan Matras Yoga Latex untuk mengantisipasi permintaan tinggi.\n2. Pantau pergerakan stok Sneaker Casual White dan item lainnya untuk menghindari penumpukan inventaris yang tidak produktif.",
                'created_at' => '2026-07-01 00:00:00',
                'updated_at' => '2026-07-01 00:00:00',
            ],
            [
                'id' => 4,
                'user_id' => $owner->id,
                'bulan' => 7,
                'tahun' => 2026,
                'total_penjualan' => 4,
                'total_omzet' => 975000,
                'total_item_terjual' => 9,
                'analisis_ai' => "Total omzet periode Juli 2026 mencapai Rp 975.000 dengan total volume penjualan sebanyak 9 item.\n\nKaos Kaki Performance mendominasi penjualan dengan kontribusi 44,44%, diikuti Sandal Slide sebesar 33,33%, serta Backpack Duffel dan Hoodie Sport sebesar 11,11% dari total volume transaksi.\n\nRekomendasi:\n1. Tingkatkan stok Kaos Kaki Performance dan Sandal Slide untuk mengantisipasi permintaan tinggi.\n2. Pantau pergerakan stok Backpack Duffel dan item lainnya untuk menghindari penumpukan inventaris yang tidak produktif.",
                'created_at' => '2026-08-01 00:00:00',
                'updated_at' => '2026-08-01 00:00:00',
            ],
            [
                'id' => 5,
                'user_id' => $owner->id,
                'bulan' => 8,
                'tahun' => 2026,
                'total_penjualan' => 4,
                'total_omzet' => 855000,
                'total_item_terjual' => 8,
                'analisis_ai' => "Total omzet periode Agustus 2026 mencapai Rp 855.000 dengan total volume penjualan sebanyak 8 item.\n\nHanduk Microfiber mendominasi penjualan dengan kontribusi 37,50%, diikuti Jersey Training sebesar 25,00%, Resistance Band Set sebesar 25,00%, dan Sepatu Trail Pro sebesar 12,50% dari total volume transaksi.\n\nRekomendasi:\n1. Tingkatkan stok Handuk Microfiber dan Jersey Training untuk mengantisipasi permintaan tinggi.\n2. Pantau pergerakan stok Sepatu Trail Pro dan item lainnya untuk menghindari penumpukan inventaris yang tidak produktif.",
                'created_at' => '2026-09-01 00:00:00',
                'updated_at' => '2026-09-01 00:00:00',
            ],
        ];

        foreach ($ringkasans as $r) {
            RingkasanBulanan::create($r);
        }
    }
}