import React, { useState, useEffect } from "react";
import { Plus, SquarePen, Trash2 } from "lucide-react";
import BaseSearch from "../components/ui/BaseSearch";
import BaseTable from "../components/ui/BaseTable";
import TambahBarangModal from "../components/modals/TambahBarangModal";
import EditBarangModal from "../components/modals/EditBarangModal";
import HapusBarangModal from "../components/modals/HapusBarangModal";
import api from "../lib/axios";
import { useToast } from "../components/ui/Notification";
import { useData } from "../context/DataContext";
import { useLocation } from 'react-router-dom';
import LoadingState from "../components/ui/LoadingState";

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

   const location = useLocation();

   const toast = useToast();
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

   useEffect(() => {
    if (location.state?.openEditModal || location.state?.openHapusModal) {
      const { openEditModal, openHapusModal, barangId } = location.state;
      const target = (barang || []).find(b => b.id === barangId);
      if (target) {
        const itemForModal = {
          id: target.id,
          nama: target.nama_barang,
          harga: target.harga_barang,
          kategori_id: target.kategori_id,
          stok: target.stok_barang,
          deskripsi: target.deskripsi_barang,
          gambar: target.foto_barang,
        };
        setSelectedItem(itemForModal);
        if (openEditModal) setModalEdit(true);
        if (openHapusModal) setModalHapus(true);
      }
      // Bersihkan state agar tidak berulang
      window.history.replaceState({}, document.title);
    }
     }, [location, barang]);

  const data = barang || [];
  const kategoriList = kategori || []; // UBAH: untuk dioper ke modal

  // Filter data berdasarkan pencarian
  const filteredData = data.filter((item) =>
    item.nama_barang?.toLowerCase().includes(searchQuery.toLowerCase())
  );

 const handleTambah = async (formData) => {
  try {
    const res = await api.post("/barang", formData);
    if (res.data.status) {
      refreshBarang();
      setModalTambah(false);
      toast.success("Barang ditambahkan", "Data berhasil disimpan");
    } else {
      toast.error("Gagal menambah barang", res.data.message);
    }
  } catch (err) {
    toast.error("Gagal menyimpan ke server", err.response?.data?.message);
  }
};

const handleEdit = async ({ id, formData }) => {
  try {
    const res = await api.post(`/barang/${id}`, formData);
    if (res.data.status) {
      refreshBarang();
      setModalEdit(false);
      setSelectedItem(null);
      toast.success("Barang diperbarui", "Perubahan berhasil disimpan");
    } else {
      toast.error("Gagal mengupdate barang", res.data.message);
    }
  } catch (err) {
    console.log('Edit error:', err.response?.data);
    toast.error("Gagal menyimpan perubahan", err.response?.data?.message);
  }
};

const handleHapus = async () => {
  if (!selectedItem) return;
  try {
    const res = await api.delete(`/barang/${selectedItem.id}`);
    if (res.data.status) {
      refreshBarang();
      setModalHapus(false);
      setSelectedItem(null);
      toast.success("Barang dihapus", "Data berhasil dihapus");
    } else {
      toast.error("Gagal menghapus barang", res.data.message);
    }
  } catch (err) {
    toast.error("Gagal menghapus barang", err.response?.data?.message);
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
  <LoadingState text="Memuat data barang..." />
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