import React, { useState, useEffect } from "react";
import { Plus, SquarePen, Trash2 } from "lucide-react";
import BaseSearch from "../components/ui/BaseSearch";
import BaseTable from "../components/ui/BaseTable";
import TambahBarangModal from "../components/modals/TambahBarangModal";
import EditBarangModal from "../components/modals/EditBarangModal";
import HapusBarangModal from "../components/modals/HapusBarangModal";
import api from "../lib/axios";
import { useData } from "../context/DataContext";

const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const ManagementBarang = () => {
  const {
    barang,
    kategori,
    fetchBarang,
    fetchKategori,
    refreshBarang,
    loadingBarang,
  } = useData();

  const [searchQuery, setSearchQuery] = useState("");
  const [modalTambah, setModalTambah] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalHapus, setModalHapus] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const now = new Date();
  const periode = `${BULAN[now.getMonth()]} ${now.getFullYear()}`;

  useEffect(() => {
    fetchBarang();
    fetchKategori();
  }, []);

  const data = barang || [];
  const kategoriList = kategori || []; // UBAH: untuk dioper ke modal

  // Filter data berdasarkan pencarian
  const filteredData = data.filter((item) =>
    item.nama_barang?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ❌ HAPUS fungsi getKategoriId, tidak diperlukan lagi

  // Tambah barang (UBAH: pakai kategori_id langsung)
  const handleTambah = async (newItem) => {
    const payload = {
      nama_barang: newItem.nama,
      harga_barang: parseInt(newItem.harga, 10),
      kategori_id: newItem.kategori_id, // UBAH: langsung pakai id dari modal
      stok_barang: newItem.stok,
      deskripsi_barang: newItem.deskripsi || "",
    };

    try {
      const res = await api.post("/barang", payload);
      if (res.data.status) {
        refreshBarang();
        setModalTambah(false);
      } else {
        alert(res.data.message || "Gagal menambah barang");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menyimpan ke server");
    }
  };

  // Edit barang (UBAH: pakai kategori_id langsung)
  const handleEdit = async (updatedItem) => {
    const payload = {
      nama_barang: updatedItem.nama,
      harga_barang: parseInt(updatedItem.harga, 10),
      kategori_id: updatedItem.kategori_id, // UBAH
      stok_barang: updatedItem.stok,
      deskripsi_barang: updatedItem.deskripsi || "",
    };

    try {
      const res = await api.put(`/barang/${updatedItem.id}`, payload);
      if (res.data.status) {
        refreshBarang();
        setModalEdit(false);
        setSelectedItem(null);
      } else {
        alert(res.data.message || "Gagal mengupdate barang");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menyimpan perubahan");
    }
  };

  // Hapus barang
  const handleHapus = async () => {
    if (!selectedItem) return;
    try {
      const res = await api.delete(`/barang/${selectedItem.id}`);
      if (res.data.status) {
        refreshBarang();
        setModalHapus(false);
        setSelectedItem(null);
      } else {
        alert(res.data.message || "Gagal menghapus barang");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus barang");
    }
  };

  // Buka modal edit (UBAH: kirim kategori_id agar dropdown terisi)
  const openEditModal = (item) => {
    const itemForModal = {
      id: item.id,
      nama: item.nama_barang,
      harga: item.harga_barang,
      kategori_id: item.kategori_id,      // UBAH: ID
      kategori_nama: item.kategori?.nama_kategori || "", // UBAH: untuk tampilan fallback (tidak dipakai sekarang)
      stok: item.stok_barang,
      deskripsi: item.deskripsi_barang,
      gambar: item.foto_barang,
    };
    setSelectedItem(itemForModal);
    setModalEdit(true);
  };

  const openHapusModal = (item) => {
    setSelectedItem(item);
    setModalHapus(true);
  };

  const columns = [
    {
      header: "Gambar",
      key: "foto_barang",
      render: (item) => (
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md bg-neutral-100">
          <img
            src={item.foto_barang || "https://picsum.photos/seed/placeholder/40/40"}
            alt={item.nama_barang}
            className="h-full w-full object-cover"
          />
        </div>
      ),
    },
    { header: "Nama Produk", key: "nama_barang" },
    {
      header: "Harga",
      key: "harga_barang",
      render: (item) => `Rp ${item.harga_barang?.toLocaleString("id-ID")}`,
    },
    {
      header: "Kategori",
      key: "kategori",
      render: (item) => item.kategori?.nama_kategori || "-",
    },
    { header: "Deskripsi", key: "deskripsi_barang" },
  ];

  const actionRow = (item) => (
    <div className="flex items-center gap-3">
      <button onClick={() => openEditModal(item)} className="text-amber-500 transition-colors hover:text-amber-600">
        <SquarePen size={16} />
      </button>
      <button onClick={() => openHapusModal(item)} className="text-rose-500 transition-colors hover:text-rose-600">
        <Trash2 size={16} />
      </button>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-10 py-8">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 w-full mb-4">
        <BaseSearch
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari Barang"
        />
        <button
          onClick={() => setModalTambah(true)}
          className="flex items-center gap-2 rounded-lg bg-[#3B5BDB] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3451C7] whitespace-nowrap"
        >
          <Plus size={18} strokeWidth={2} />
          Tambah Barang
        </button>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-neutral-900">Tabel Data Barang</h2>
        <p className="mb-5 text-sm text-neutral-400">{periode}</p>

        {loadingBarang && data.length === 0 ? (
          <p className="text-gray-500 text-sm">Memuat data...</p>
        ) : (
          <BaseTable
            columns={columns}
            data={filteredData}
            actionRow={actionRow}
            emptyMessage="Tidak ada barang ditemukan."
          />
        )}
      </div>

      {/* UBAH: Tambahkan prop kategoriList ke kedua modal */}
      <TambahBarangModal
        isOpen={modalTambah}
        onClose={() => setModalTambah(false)}
        onSave={handleTambah}
        kategoriList={kategoriList}     // <-- TAMBAHKAN
      />

      {selectedItem && (
        <EditBarangModal
          isOpen={modalEdit}
          onClose={() => { setModalEdit(false); setSelectedItem(null); }}
          onSave={handleEdit}
          data={selectedItem}
          kategoriList={kategoriList}   // <-- TAMBAHKAN
        />
      )}

      {selectedItem && (
        <HapusBarangModal
          isOpen={modalHapus}
          onClose={() => { setModalHapus(false); setSelectedItem(null); }}
          onConfirm={handleHapus}
          namaBarang={selectedItem.nama || selectedItem.nama_barang}
        />
      )}
    </div>
  );
};

export default ManagementBarang;