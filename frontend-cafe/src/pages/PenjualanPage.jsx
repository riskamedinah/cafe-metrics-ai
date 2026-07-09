import { useState, useEffect } from "react";
import { Plus, SquarePen, Trash2 } from "lucide-react";
import BaseSearch from "../components/ui/BaseSearch";
import BaseTable from "../components/ui/BaseTable";
import TambahPenjualanModal from "../components/modals/TambahPenjualanModal";
import EditPenjualanModal from "../components/modals/EditPenjualanModal";
import HapusPenjualanModal from "../components/modals/HapusPenjualanModal";
import api from "../lib/axios";
import { useData } from "../context/DataContext";
import LoadingState from "../components/ui/LoadingState";

const bulanIni = () => {
  const d = new Date();
  return d.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
};

export default function ManagementPenjualan() {
  const { penjualan, fetchPenjualan, refreshPenjualan, loadingPenjualan } = useData();
  const [search, setSearch] = useState("");
  const [modalTambah, setModalTambah] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [hapusItem, setHapusItem] = useState(null);

  useEffect(() => {
    fetchPenjualan();
  }, []);

  const data = penjualan || [];

  const filteredData = data.filter((item) =>
    item.namaProduk.toLowerCase().includes(search.toLowerCase())
  );

  // Handle tambah
  const handleTambah = async (form) => {
    try {
      const res = await api.post("/penjualan", form);
      if (res.data.status) {
        refreshPenjualan();
        setModalTambah(false);
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menyimpan");
    }
  };

  // Handle edit
  const handleEdit = async (updated) => {
    try {
      const res = await api.put(`/penjualan/${updated.id}`, {
        jumlah: updated.jumlah,
      });
      if (res.data.status) {
        refreshPenjualan();
        setEditItem(null);
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Gagal mengupdate");
    }
  };

  // Handle hapus
  const handleHapus = async (id) => {
    try {
      const res = await api.delete(`/penjualan/${id}`);
      if (res.data.status) {
        refreshPenjualan();
        setHapusItem(null);
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus");
    }
  };

  const columns = [
    { header: "Nama Barang", key: "namaProduk" },
    {
      header: "Harga",
      key: "harga",
      render: (item) => `Rp ${(item.harga || 0).toLocaleString("id-ID")}`,
    },
    { header: "Jumlah", key: "jumlah" },
    {
      header: "Total Harga",
      key: "total",
      render: (item) => `Rp ${(item.harga * item.jumlah || 0).toLocaleString("id-ID")}`,
    },
  ];

  const actionRow = (item) => (
    <div className="flex items-center gap-3">
      <button
        onClick={() => setEditItem(item)}
        className="text-amber-500 hover:text-amber-600"
      >
        <SquarePen size={16} />
      </button>
      <button
        onClick={() => setHapusItem(item)}
        className="text-rose-500 hover:text-rose-600"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1400, margin: "0 auto", background: "#F4F5F7", minHeight: "100vh" }}>
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 w-full mb-4">
        <BaseSearch
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari Penjualan"
        />
        <button
          onClick={() => setModalTambah(true)}
          className="flex items-center gap-2 rounded-lg bg-[#3B5BDB] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#3451C7]"
        >
          <Plus size={18} strokeWidth={2} />
          Tambah Penjualan
        </button>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-base font-semibold text-neutral-900">Riwayat Penjualan</h2>
        <p className="mb-5 text-sm text-neutral-400">{bulanIni()}</p>

       {loadingPenjualan && data.length === 0 ? (
         <LoadingState text="Memuat data penjualan..." />
       ) : (
          <BaseTable
            columns={columns}
            data={filteredData}
            actionRow={actionRow}
            emptyMessage="Belum ada transaksi penjualan."
          />
        )}
      </div>

      <TambahPenjualanModal
        isOpen={modalTambah}
        onClose={() => setModalTambah(false)}
        onSave={handleTambah}
      />

      {editItem && (
        <EditPenjualanModal
          isOpen={!!editItem}
          item={editItem}
          onClose={() => setEditItem(null)}
          onSave={handleEdit}
        />
      )}

      {hapusItem && (
        <HapusPenjualanModal
          isOpen={!!hapusItem}
          item={hapusItem}
          onClose={() => setHapusItem(null)}
          onConfirm={(id) => handleHapus(id)}
        />
      )}
    </div>
  );
}