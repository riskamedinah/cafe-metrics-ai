import { useState, useEffect } from "react";
import { SquarePen, Trash2 } from "lucide-react";
import BaseSearch from "../components/ui/BaseSearch";
import BaseTable from "../components/ui/BaseTable";
import TambahKategoriModal from "../components/modals/TambahKategoriModal";
import EditKategoriModal from "../components/modals/EditKategoriModal";
import HapusKategoriModal from "../components/modals/HapusKategoriModal";
import CreateButton from "../components/ui/CreateButton";
// UBAH: import useData
import { useData } from "../context/DataContext";
import api from "../lib/axios";

const bulanIni = () => {
  const d = new Date();
  return d.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
};

const KategoriPage = () => {
  // UBAH: gunakan context
  const { kategori, fetchKategori, refreshKategori, loadingKategori } = useData();
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
        // UBAH: refresh data global
        refreshKategori();
        setModalTambah(false);
      } else {
        alert(res.data.message || "Gagal menambah kategori");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menyimpan ke server");
    }
  };

  const handleEdit = async (updated) => {
    try {
      const res = await api.put(`/kategori/${updated.id}`, {
        nama_kategori: updated.nama,
      });
      if (res.data.status) {
        // UBAH: refresh global
        refreshKategori();
        setEditItem(null);
      } else {
        alert(res.data.message || "Gagal mengupdate kategori");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menyimpan perubahan");
    }
  };

  const handleHapus = async (id) => {
    try {
      const res = await api.delete(`/kategori/${id}`);
      if (res.data.status) {
        // UBAH: refresh global
        refreshKategori();
        setHapusItem(null);
      } else {
        alert(res.data.message || "Gagal menghapus kategori");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus kategori");
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
          <p className="text-gray-500 text-sm">Memuat data...</p>
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