# Context Project: Aplikasi POS (Point of Sales) Cafe dengan Fitur AI Insights

## 1. Ringkasan Proyek
Aplikasi ini adalah sistem manajemen penjualan (Kasir/POS) berbasis web yang dirancang khusus untuk pemilik (owner) usaha kafe. Aplikasi ini memiliki fitur manajemen operasional standar (CRUD) dan modul analitik pintar berbasis AI (Generative AI) yang mampu merangkum data penjualan bulanan menjadi insight bisnis taktis otomatis.

* **Teknologi Backend:** Laravel 12 (API-only mode)
* **Teknologi Frontend:** React dengan Tailwind CSS
* **Sistem Autentikasi:** Laravel Sanctum (Token-based Auth / Bearer Token)
* **Dokumentasi API:** Scramble (Akses otomatis via `/docs/api`)
* **AI Provider:** Google Gemini 2.5 Flash (via Google AI Studio API — free tier, tanpa kartu kredit)
* **Fitur Spesifik:** Multi-tenancy (Setiap owner hanya bisa melihat, memodifikasi, dan menganalisis data milik mereka sendiri menggunakan proteksi `Auth::id()`).

---

## 2. Arsitektur Database (Skema Tabel)

Semua tabel menggunakan `timestamps()` (kolom `created_at` & `updated_at`) kecuali disebutkan lain. Kolom `created_at` pada tabel `penjualans` digunakan sebagai dasar filter data per bulan dan tahun pada fitur ringkasan bulanan.

### a. Tabel: `users`
Menyimpan data akun Owner Cafe.
* `id` (Primary Key)
* `name` (string)
* `email` (string, unique)
* `password` (string)
* `timestamps()`

### b. Tabel: `kategoris`
Menyimpan kategori menu (makanan/minuman).
* `id` (Primary Key)
* `user_id` (Foreign Key -> `users.id`, cascade on delete)
* `nama_kategori` (string)
* `timestamps()`

### c. Tabel: `barangs`
Menyimpan detail item/menu kafe beserta stok aktifnya.
* `id` (Primary Key)
* `kategori_id` (Foreign Key -> `kategoris.id`, cascade on delete)
* `user_id` (Foreign Key -> `users.id`, cascade on delete)
* `nama_barang` (string)
* `harga_barang` (integer)
* `stok_barang` (integer)
* `deskripsi_barang` (text, nullable)
* `foto_barang` (string, nullable) — menyimpan path hasil upload ke Laravel Storage
* `timestamps()`

### d. Tabel: `penjualans`
Menyimpan riwayat transaksi kasir. Setiap kali transaksi dicatat, sistem otomatis memotong data `stok_barang` di tabel `barangs` menggunakan DB Transaction.
* `id` (Primary Key)
* `barang_id` (Foreign Key -> `barangs.id`, cascade on delete)
* `user_id` (Foreign Key -> `users.id`, cascade on delete)
* `jumlah` (integer)
* `total_harga` (integer)
* `timestamps()` — `created_at` digunakan sebagai acuan filter bulan & tahun

### e. Tabel: `ringkasan_bulanans`
Menyimpan hasil laporan akhir bulanan yang telah di-generate oleh AI untuk keperluan arsip pemilik kafe.
* `id` (Primary Key)
* `user_id` (Foreign Key -> `users.id`, cascade on delete)
* `bulan` (integer, 1-12)
* `tahun` (integer)
* `total_omzet` (integer)
* `analisis_ai` (text)
* `timestamps()`

---

## 3. Struktur Endpoint API & Routing (`routes/api.php`)

Semua endpoint operasional diproteksi oleh middleware `auth:sanctum`. Client wajib menyertakan header `Authorization: Bearer <token>` dan `Accept: application/json`.

| Method | Endpoint | Controller Action | Keterangan | Proteksi |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/register` | `AuthController@register` | Pendaftaran akun owner baru | 🔓 Publik |
| **POST** | `/api/login` | `AuthController@login` | Login & dapatkan Bearer Token | 🔓 Publik |
| **POST** | `/api/logout` | `AuthController@logout` | Revoke/hapus token aktif | 🔒 Auth |
| **GET** | `/api/kategori` | `KategoriController@index` | List semua kategori milik user (return semua, tanpa pagination) | 🔒 Auth |
| **POST** | `/api/kategori` | `KategoriController@store` | Buat kategori baru | 🔒 Auth |
| **PUT** | `/api/kategori/{id}` | `KategoriController@update` | Update data kategori | 🔒 Auth |
| **DELETE** | `/api/kategori/{id}` | `KategoriController@destroy` | Hapus kategori (+ cascade) | 🔒 Auth |
| **GET** | `/api/barang` | `BarangController@index` | List semua menu milik user (return semua, tanpa pagination) — include relasi `kategori` | 🔒 Auth |
| **POST** | `/api/barang` | `BarangController@store` | Tambah menu baru + upload foto ke Laravel Storage | 🔒 Auth |
| **GET** | `/api/penjualan` | `PenjualanController@index` | History transaksi kasir (paginated) — include relasi `barang` | 🔒 Auth |
| **POST** | `/api/penjualan` | `PenjualanController@store` | Catat transaksi + potong stok | 🔒 Auth |
| **POST** | `/api/ringkasan/hitung** | `RingkasanBulananController@hitungStatistik` | Hitung agregasi omzet & tren item bulanan, kembalikan `raw_data_ai` | 🔒 Auth |
| **GET** | `/api/ringkasan` | `RingkasanBulananController@index` | Tampilkan semua arsip AI (paginated) | 🔒 Auth |
| **POST** | `/api/ringkasan` | `RingkasanBulananController@store` | Simpan laporan final AI | 🔒 Auth |

---

## 4. Standar Format Response API

Semua response menggunakan struktur JSON yang konsisten:

```json
{
  "status": true,
  "message": "Deskripsi singkat hasil operasi",
  "data": { }
}
```

* `status`: `true` untuk sukses, `false` untuk gagal/error
* `message`: string deskriptif (contoh: `"Data kategori berhasil disimpan"`, `"Stok tidak mencukupi"`)
* `data`: objek/array hasil operasi. Untuk list dengan pagination, `data` berisi objek paginator Laravel. Untuk list tanpa pagination, `data` berisi array langsung. Untuk operasi delete, `data` boleh `null`.

### Contoh Response Sukses (single item)
```json
{
  "status": true,
  "message": "Kategori berhasil ditambahkan",
  "data": {
    "id": 1,
    "nama_kategori": "Minuman",
    "user_id": 3,
    "created_at": "2025-01-10T08:00:00.000000Z"
  }
}
```

### Contoh Response Sukses (paginated)
```json
{
  "status": true,
  "message": "Data penjualan berhasil diambil",
  "data": {
    "current_page": 1,
    "data": [ ],
    "per_page": 15,
    "total": 100
  }
}
```

### Contoh Response Gagal
```json
{
  "status": false,
  "message": "Stok barang tidak mencukupi",
  "data": null
}
```

---

## 5. Aturan Validasi & Business Logic

### Validasi Request per Endpoint

| Endpoint | Field | Aturan |
| :--- | :--- | :--- |
| `POST /api/register` | `name` | required, string, max:255 |
| | `email` | required, email, unique:users |
| | `password` | required, string, min:8, confirmed |
| `POST /api/login` | `email` | required, email |
| | `password` | required |
| `POST /api/kategori` | `nama_kategori` | required, string, max:255 |
| `PUT /api/kategori/{id}` | `nama_kategori` | required, string, max:255 |
| `POST /api/barang` | `kategori_id` | required, exists:kategoris,id |
| | `nama_barang` | required, string, max:255 |
| | `harga_barang` | required, integer, min:0 |
| | `stok_barang` | required, integer, min:0 |
| | `deskripsi_barang` | nullable, string |
| | `foto_barang` | nullable, image, mimes:jpg,jpeg,png, max:2048 |
| `POST /api/penjualan` | `barang_id` | required, exists:barangs,id |
| | `jumlah` | required, integer, min:1 |
| `POST /api/ringkasan/hitung` | `bulan` | required, integer, min:1, max:12 |
| | `tahun` | required, integer, min:2000 |
| `POST /api/ringkasan` | `bulan` | required, integer, min:1, max:12 |
| | `tahun` | required, integer, min:2000 |
| | `total_omzet` | required, integer, min:0 |
| | `analisis_ai` | required, string |

### Business Logic Rules
1. **Pengurangan Stok Otomatis:** Di `PenjualanController@store`, sistem melakukan pengecekan ketersediaan stok sebelum transaksi disimpan. Jika memadai, `stok_barang` didecrement di dalam blok `DB::transaction`. Jika stok tidak mencukupi, return response `status: false` dengan message yang sesuai.
2. **Rollback Stok Saat Hapus/Edit:** Jika transaksi penjualan dihapus (`destroy`) atau diubah (`update`), jumlah barang lama dikembalikan terlebih dahulu ke stok awal (`increment`) sebelum kalkulasi baru diterapkan agar data tidak korup atau bernilai minus.
3. **Upload Foto Barang:** Foto diupload ke Laravel Storage (`storage/app/public/barangs/`). Path yang disimpan ke database adalah path relatif (contoh: `barangs/namafile.jpg`). Gunakan `Storage::url()` saat mengembalikan URL di response.
4. **Eager Loading Relasi:**
   - `GET /api/barang` → include relasi `kategori`
   - `GET /api/penjualan` → include relasi `barang`

---

## 6. Detail Logic `hitungStatistik`

Endpoint `POST /api/ringkasan/hitung` menerima `bulan` dan `tahun` via **request body (JSON)**, lalu:

1. Filter `penjualans` berdasarkan `user_id`, `bulan`, dan `tahun` menggunakan `whereMonth('created_at', $bulan)` dan `whereYear('created_at', $tahun)`
2. Hitung `total_omzet` = sum dari `total_harga`
3. Hitung `total_item_terjual` = sum dari `jumlah`
4. Ambil Top 3 barang terlaris berdasarkan total `jumlah` terjual, include nama barang
5. Jika tidak ada transaksi pada bulan/tahun tersebut, return `status: false` dengan message `"Tidak ada data penjualan pada periode ini"`

### Format Output `raw_data_ai`
String teks yang dikembalikan dalam response untuk dikirim ke Gemini API:
```
Laporan Penjualan Kafe - [Nama Bulan] [Tahun]
Total Omzet: Rp [nominal]
Total Item Terjual: [jumlah] item

Top 3 Menu Terlaris:
1. [Nama Barang] - [jumlah] terjual
2. [Nama Barang] - [jumlah] terjual
3. [Nama Barang] - [jumlah] terjual
```

### Contoh Response `hitungStatistik`
```json
{
  "status": true,
  "message": "Statistik berhasil dihitung",
  "data": {
    "bulan": 1,
    "tahun": 2025,
    "total_omzet": 15000000,
    "total_item_terjual": 320,
    "top_3_terlaris": [
      { "nama_barang": "Es Kopi Susu", "total_terjual": 85 },
      { "nama_barang": "Croissant", "total_terjual": 60 },
      { "nama_barang": "Matcha Latte", "total_terjual": 55 }
    ],
    "raw_data_ai": "Laporan Penjualan Kafe - Januari 2025\nTotal Omzet: Rp 15.000.000\nTotal Item Terjual: 320 item\n\nTop 3 Menu Terlaris:\n1. Es Kopi Susu - 85 terjual\n2. Croissant - 60 terjual\n3. Matcha Latte - 55 terjual"
  }
}
```

---

## 7. Integrasi AI — Google Gemini 2.5 Flash

### Konfigurasi
* **Provider:** Google AI Studio
* **Model:** `gemini-2.5-flash`
* **Endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`
* **API Key:** Diperoleh gratis dari [aistudio.google.com](https://aistudio.google.com) — simpan di `.env` frontend sebagai `VITE_GEMINI_API_KEY`
* **Free Tier:** 1.500 request/hari, 15 RPM, 1 juta TPM — tanpa kartu kredit, tidak expired

### System Prompt yang Direkomendasikan
```
Kamu adalah konsultan bisnis kafe profesional.
Berdasarkan data penjualan berikut, buat ringkasan insight
yang singkat, tajam, dan actionable untuk pemilik kafe.
Sertakan: tren penjualan, peluang, dan 2-3 rekomendasi konkret.
Gunakan bahasa Indonesia yang profesional tapi mudah dipahami.
```

### Contoh Pemanggilan dari Frontend React
```javascript
const generateInsight = async (raw_data_ai) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{
            text: "Kamu adalah konsultan bisnis kafe profesional. Buat ringkasan insight yang singkat, tajam, dan actionable. Gunakan bahasa Indonesia yang profesional tapi mudah dipahami."
          }]
        },
        contents: [{
          parts: [{ text: raw_data_ai }]
        }]
      })
    }
  );
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
};
```

---

## 8. Panduan Instruksi untuk AI Lain
Saat mengembangkan proyek ini lebih lanjut (baik frontend React maupun integrasi API AI):
* Pastikan untuk selalu menyertakan pengkondisian `where('user_id', Auth::id())` pada setiap query data baru demi menjaga keamanan multi-tenancy.
* Jika membuat komponen frontend React, integrasikan fungsionalitas penyimpanan token di `localStorage` atau `secure cookies` untuk dilempar ke axios interceptor sebagai Bearer Token.
* Backend menggunakan **Laravel 12** — perhatikan perubahan struktur routing dan konfigurasi yang berbeda dari versi sebelumnya jika ada.
* API Key Gemini **jangan pernah** di-hardcode di source code. Selalu gunakan environment variable (`VITE_GEMINI_API_KEY` untuk Vite/React).
* Pemanggilan Gemini API dilakukan **dari sisi frontend** — backend hanya menyediakan `raw_data_ai` melalui endpoint `/api/ringkasan/hitung`.
* Semua response API wajib mengikuti format `{ status, message, data }` tanpa terkecuali.
* Endpoint `/api/barang` dan `/api/kategori` menggunakan `->get()` (tanpa pagination). Endpoint `/api/penjualan` dan `/api/ringkasan` menggunakan `->paginate()`.
* Foto barang disimpan di `storage/app/public/barangs/` dan diakses via `Storage::url()`.
