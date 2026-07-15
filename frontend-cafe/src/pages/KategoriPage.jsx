import { useState, useEffect } from "react";
import { SquarePen, Trash2 } from "lucide-react";
import BaseSearch from "../components/ui/BaseSearch";
import BaseTable from "../components/ui/BaseTable";
import TambahKategoriModal from "../components/modals/TambahKategoriModal";
import EditKategoriModal from "../components/modals/EditKategoriModal";
import HapusKategoriModal from "../components/modals/HapusKategoriModal";
import CreateButton from "../components/ui/CreateButton";
import { useData } from "../context/DataContext";
import { useToast } from "../components/ui/Notification";
import api from "../lib/axios";
import LoadingState from "../components/ui/LoadingState";

const bulanIni = () => {
  const d = new Date();
  return d.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
};

const KategoriPage = () => {
  // UBAH: gunakan context
  const { kategori, fetchKategori, refreshKategori, loadingKategori } = useData();
  const toast = useToast()
  const [searchQuery, setSearchQuery] = useState("");
  const [modalTambah, setModalTambah] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [hapusItem, setHapusItem] = useState(null);

  useEffect(() => {
    fetchKategori();
  }, []);

  const data = kategori || [];

  const filteredData = data.filter((item) =>
    item.nama_kategori?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTambah = async (newKategori) => {
    const nama = typeof newKategori === "string" ? newKategori : newKategori.nama;
    try {
      const res = await api.post("/kategori", { nama_kategori: nama });
      if (res.data.status) {
        refreshKategori();
        setModalTambah(false);
      toast.success("Kategori ditambahkan", `"${nama}" berhasil disimpan`);
    } else {
      toast.error("Gagal menambah kategori", res.data.message);
    }
  } catch (err) {
    toast.error("Gagal menyimpan", err.response?.data?.message || "Terjadi kesalahan pada server");
  }
  };

  const handleEdit = async (updated) => {
    try {
      const res = await api.put(`/kategori/${updated.id}`, {
        nama_kategori: updated.nama,
      });
      if (res.data.status) {
        refreshKategori();
        setEditItem(null);
      toast.success("Kategori diperbarui", `"${updated.nama}" berhasil diubah`);
    } else {
      toast.error("Gagal mengupdate kategori", res.data.message);
    }
  } catch (err) {
    toast.error("Gagal menyimpan perubahan", err.response?.data?.message);
  }
  };

  const handleHapus = async (id) => {
    try {
      const res = await api.delete(`/kategori/${id}`);
      if (res.data.status) {
        refreshKategori();
        setHapusItem(null);
    toast.success("Kategori dihapus", "Data berhasil dihapus");
    } else {
      toast.error("Gagal menghapus kategori", res.data.message);
    }
  } catch (err) {
    toast.error("Gagal menghapus kategori", err.response?.data?.message);
  }
  };

  const columns = [{ header: "Kategori", key: "nama_kategori" }];

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1400, margin: "0 auto" }}>
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 w-full mb-4">
        <BaseSearch
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari Kategori"
        />
        <CreateButton onClick={() => setModalTambah(true)} label="Tambah Kategori" />
      </div>

      <div style={{ background: "#fff", borderRadius: 12, padding: "24px" }}>
        <h2 className="text-base font-semibold text-neutral-900">Tabel Data Kategori</h2>
        <p className="mb-5 text-sm text-neutral-400">{bulanIni()}</p>

       {loadingKategori && data.length === 0 ? (
         <LoadingState text="Memuat data kategori..." />
       ) : (
          <BaseTable
            columns={columns}
            data={filteredData}
            emptyMessage="Tidak ada kategori ditemukan."
            actionRow={(item) => (
              <>
                <button onClick={() => setEditItem({ id: item.id, nama: item.nama_kategori })}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#F59E0B" }}>
                  <SquarePen size={16} />
                </button>
                <button onClick={() => setHapusItem(item)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#F43F5E" }}>
                  <Trash2 size={16} />
                </button>
              </>
            )}
          />
        )}
      </div>

      <TambahKategoriModal isOpen={modalTambah} onClose={() => setModalTambah(false)} onSave={handleTambah} />
      <EditKategoriModal isOpen={!!editItem} item={editItem} onClose={() => setEditItem(null)} onSave={handleEdit} />
      <HapusKategoriModal isOpen={!!hapusItem} item={hapusItem} onClose={() => setHapusItem(null)} onConfirm={() => handleHapus(hapusItem.id)} />
    </div>
  );
};

export default KategoriPage;