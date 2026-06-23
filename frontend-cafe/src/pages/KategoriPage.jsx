import { useState } from "react";
import { SquarePen, Trash2, Plus } from "lucide-react";
import BaseSearch from "../components/ui/BaseSearch";
import BaseTable from "../components/ui/BaseTable";
import TambahKategoriModal from "../components/modals/TambahKategoriModal";
import EditKategoriModal from "../components/modals/EditKategoriModal";
import HapusKategoriModal from "../components/modals/HapusKategoriModal";
import CreateButton from "../components/ui/CreateButton";
import { mockBarang } from "../data/barangMock";

const bulanIni = () => {
  const d = new Date();
  return d.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
};

const kategoriUnik = [...new Set(mockBarang.map((item) => item.kategori))];
const initialKategoriData = kategoriUnik.map((nama, index) => ({
  id: index + 1,
  nama: nama,
}));

const KategoriPage = () => {
  const [data, setData] = useState(initialKategoriData);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalTambah, setModalTambah] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [hapusItem, setHapusItem] = useState(null);

  const filteredData = data.filter((item) =>
    item.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTambah = (newKategori) => {
    setData([...data, { id: Date.now(), nama: newKategori }]);
    setModalTambah(false);
  };

  const handleEdit = (updated) => {
    setData(data.map((item) => (item.id === updated.id ? updated : item)));
    setEditItem(null);
  };

  const handleHapus = (id) => {
    setData(data.filter((item) => item.id !== id));
    setHapusItem(null);
  };

  const columns = [{ header: "Kategori", key: "nama" }];

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1400, margin: "0 auto" }}>
      {/* Toolbar: Search + Tambah */}
     <div className="flex flex-col sm:flex-row items-start justify-between gap-4 w-full mb-4">
        <BaseSearch
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Cari Kategori"
    />
     
          <CreateButton
    onClick={() => setModalTambah(true)}
    label="Tambah Kategori"
  />
      </div>

      {/* Card: Tabel Data Kategori */}
      <div style={{ background: "#fff", borderRadius: 12, padding: "24px" }}>
        <h2 className="text-base font-semibold text-neutral-900">
          Tabel Data Kategori
        </h2>
        <p className="mb-5 text-sm text-neutral-400">{bulanIni()}</p>

        <BaseTable
          columns={columns}
          data={filteredData}
          emptyMessage="Tidak ada kategori ditemukan."
          actionRow={(item) => (
            <>
              <button
                onClick={() => setEditItem(item)}
                title="Edit"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#F59E0B",
                  display: "flex",
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#D97706")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#F59E0B")}
              >
                <SquarePen size={16} strokeWidth={1.8} />
              </button>
              <button
                onClick={() => setHapusItem(item)}
                title="Hapus"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#F43F5E",
                  display: "flex",
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#E11D48")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#F43F5E")}
              >
                <Trash2 size={16} strokeWidth={1.8} />
              </button>
            </>
          )}
        />
      </div>

      <TambahKategoriModal
        isOpen={modalTambah}
        onClose={() => setModalTambah(false)}
        onSave={handleTambah}
      />
      <EditKategoriModal
        isOpen={!!editItem}
        item={editItem}
        onClose={() => setEditItem(null)}
        onSave={handleEdit}
      />
      <HapusKategoriModal
        isOpen={!!hapusItem}
        item={hapusItem}
        onClose={() => setHapusItem(null)}
        onConfirm={handleHapus}
      />
    </div>
  );
};

export default KategoriPage;