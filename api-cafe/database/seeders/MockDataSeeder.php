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
        // 1. Buat user demo (owner kafe)
        $user = User::create([
            'name' => 'Owner Demo',
            'email' => 'owner@cafe.com',
            'password' => Hash::make('password'),
        ]);

        // 2. Kategori (diambil dari mockBarang, unik)
        $kategoriNama = ['Fashion', 'Merchandise'];
        $kategoriMap = [];
        foreach ($kategoriNama as $nama) {
            $kategoriMap[$nama] = Kategori::create([
                'user_id' => $user->id,
                'nama_kategori' => $nama,
            ]);
        }

        // 3. Barang (dari mockBarang)
        $mockBarang = [
            [
                'nama' => 'Sepatu Running',
                'harga' => 100000,
                'kategori' => 'Fashion',
                'deskripsi' => 'Asics Gel Trabuco 12 Trail Runners dengan Trail Grip Sole.',
                'gambar' => '/sepatu.svg',
            ],
            [
                'nama' => 'Tumbler Stainless',
                'harga' => 150000,
                'kategori' => 'Merchandise',
                'deskripsi' => 'Vacuum Insulated 600ml untuk menjaga suhu air tetap dingin/panas.',
                'gambar' => '/tumblr.svg',
            ],
            [
                'nama' => 'Tas Ransel',
                'harga' => 80000,
                'kategori' => 'Fashion',
                'deskripsi' => 'Water Resistant Compartment, muat laptop hingga 15 inch.',
                'gambar' => '/tas.svg',
            ],
            [
                'nama' => 'Kaos Activewear',
                'harga' => 120000,
                'kategori' => 'Fashion',
                'deskripsi' => 'Black Cotton Breathable Fit, nyaman untuk olahraga harian.',
                'gambar' => '/kaos.svg',
            ],
        ];

        $barangMap = [];
        foreach ($mockBarang as $b) {
            $barang = Barang::create([
                'kategori_id' => $kategoriMap[$b['kategori']]->id,
                'user_id' => $user->id,
                'nama_barang' => $b['nama'],
                'harga_barang' => $b['harga'],
                'stok_barang' => 50, // stok awal, bebas
                'deskripsi_barang' => $b['deskripsi'],
                'foto_barang' => $b['gambar'], // bisa pakai path langsung
            ]);
            $barangMap[$b['nama']] = $barang;
        }

        // 4. Penjualan (dari mockDataPenjualan)
        $mockPenjualan = [
            ['namaProduk' => 'Sepatu Running', 'harga' => 100000, 'jumlah' => 2],
            ['namaProduk' => 'Baju Sporty', 'harga' => 150000, 'jumlah' => 1], // catatan: Baju Sporty tidak ada di barang, kita bisa buat barang baru atau skip
        ];

        // Karena "Baju Sporty" tidak ada di daftar barang, kita bisa skip atau buat barang baru.
        // Saya pilih buat barang baru dengan kategori Fashion.
        $baju = Barang::create([
            'kategori_id' => $kategoriMap['Fashion']->id,
            'user_id' => $user->id,
            'nama_barang' => 'Baju Sporty',
            'harga_barang' => 150000,
            'stok_barang' => 30,
            'deskripsi_barang' => 'Baju sporty nyaman untuk lari',
            'foto_barang' => null,
        ]);
        $barangMap['Baju Sporty'] = $baju;

        // Catat transaksi penjualan
        foreach ($mockPenjualan as $p) {
            $barang = $barangMap[$p['namaProduk']];
            Penjualan::create([
                'barang_id' => $barang->id,
                'user_id' => $user->id,
                'jumlah' => $p['jumlah'],
                'total_harga' => $p['harga'] * $p['jumlah'],
                'created_at' => now()->subDays(rand(1, 60)), // acak tanggal
            ]);
        }

        // Tambah beberapa penjualan dummy untuk barang lain agar ada data buat ringkasan
        foreach ($barangMap as $nama => $barang) {
            Penjualan::create([
                'barang_id' => $barang->id,
                'user_id' => $user->id,
                'jumlah' => rand(1, 5),
                'total_harga' => $barang->harga_barang * rand(1, 5),
                'created_at' => now()->subDays(rand(1, 60)),
            ]);
        }

        // 5. Ringkasan Bulanan (dari mockRingkasanBulanan)
        $mockRingkasan = [
            [
                'bulan' => 'Desember',
                'tahun' => 2025,
                'totalPendapatan' => 25000000,
                'ringkasanAI' => 'Lorem ipsum dolor sit amet...',
            ],
            [
                'bulan' => 'Januari',
                'tahun' => 2026,
                'totalPendapatan' => 10000000,
                'ringkasanAI' => 'Lorem ipsum dolor sit amet...',
            ],
        ];

        $bulanMap = [
            'Januari' => 1,
            'Februari' => 2,
            'Maret' => 3,
            'April' => 4,
            'Mei' => 5,
            'Juni' => 6,
            'Juli' => 7,
            'Agustus' => 8,
            'September' => 9,
            'Oktober' => 10,
            'November' => 11,
            'Desember' => 12,
        ];

        foreach ($mockRingkasan as $r) {
            RingkasanBulanan::create([
                'user_id' => $user->id,
                'bulan' => $bulanMap[$r['bulan']],
                'tahun' => $r['tahun'],
                'total_omzet' => $r['totalPendapatan'],
                'analisis_ai' => $r['ringkasanAI'],
            ]);
        }
    }
}