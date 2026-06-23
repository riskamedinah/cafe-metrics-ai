import React, { useState } from "react";
import { Plus, SquarePen, Trash2 } from "lucide-react";
import BaseSearch from "../components/ui/BaseSearch";
import BaseTable from "../components/ui/BaseTable";
import TambahBarangModal from "../components/modals/TambahBarangModal";
import EditBarangModal from "../components/modals/EditBarangModal";
import HapusBarangModal from "../components/modals/HapusBarangModal";

// ─── IMPORT DATA MOCK DARI LUAR ─────────────────────────────────────────────
import { mockBarang } from "../data/barangMock";

const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const ManagementBarang = () => {
  // Gunakan data dari file mock sebagai state awal
  const [data, setData] = useState(mockBarang);
  const [searchQuery, setSearchQuery] = useState("");

  const [modalTambah, setModalTambah] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalHapus, setModalHapus] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);

  const now = new Date();
  const periode = `${BULAN[now.getMonth()]} ${now.getFullYear()}`;

  const filteredData = data.filter((item) =>
    item.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTambah = (newItem) => {
    setData((prev) => [
      ...prev,
      { ...newItem, id: Date.now(), gambar: newItem.gambar || "" },
    ]);
    setModalTambah(false);
  };

  const handleEdit = (updatedItem) => {
    setData((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    setModalEdit(false);
    setSelectedItem(null);
  };

  const handleHapus = () => {
    if (selectedItem) {
      setData((prev) => prev.filter((item) => item.id !== selectedItem.id));
      setModalHapus(false);
      setSelectedItem(null);
    }
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setModalEdit(true);
  };

  const openHapusModal = (item) => {
    setSelectedItem(item);
    setModalHapus(true);
  };

  const columns = [
    {
      header: "Gambar",
      key: "gambar",
      render: (item) => (
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md bg-neutral-100">
          <img
            src={item.gambar || "https://picsum.photos/seed/placeholder/40/40"} 
            alt={item.nama}
            className="h-full w-full object-cover"
          />
        </div>
      ),
    },
    { header: "Nama Produk", key: "nama" },
    {
      header: "Harga",
      key: "harga",
      render: (item) => `Rp ${item.harga.toLocaleString("id-ID")}`,
    },
    { header: "Kategori", key: "kategori" },
    { header: "Deskripsi", key: "deskripsi" },
  ];

  const actionRow = (item) => (
    <div className="flex items-center gap-3">
      <button
        onClick={() => openEditModal(item)}
        className="text-amber-500 transition-colors hover:text-amber-600"
      >
        <SquarePen size={16} />
      </button>
      <button
        onClick={() => openHapusModal(item)}
        className="text-rose-500 transition-colors hover:text-rose-600"
      >
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

      {/* Card Tabel */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-neutral-900">
          Tabel Data Barang
        </h2>
        <p className="mb-5 text-sm text-neutral-400">{periode}</p>

        <BaseTable
          columns={columns}
          data={filteredData}
          actionRow={actionRow}
          emptyMessage="Tidak ada barang ditemukan."
        />
      </div>

      {/* Modals Section */}
      <TambahBarangModal
        isOpen={modalTambah}
        onClose={() => setModalTambah(false)}
        onSave={handleTambah}
      />

      {selectedItem && (
        <EditBarangModal
          isOpen={modalEdit}
          onClose={() => {
            setModalEdit(false);
            setSelectedItem(null);
          }}
          onSave={handleEdit}
          data={selectedItem}
        />
      )}

      {selectedItem && (
        <HapusBarangModal
          isOpen={modalHapus}
          onClose={() => {
            setModalHapus(false);
            setSelectedItem(null);
          }}
          onConfirm={handleHapus}
          namaBarang={selectedItem.nama}
        />
      )}
    </div>
  );
};

export default ManagementBarang;