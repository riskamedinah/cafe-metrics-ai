import { useState } from "react";
import { SquarePen, Trash2 } from "lucide-react";
import EditPenjualanModal from "../modals/EditPenjualanModal";
import HapusPenjualanModal from "../modals/HapusPenjualanModal";
import BaseTable from "./BaseTable";

const formatRupiah = (n) => "Rp " + n.toLocaleString("id-ID").replace(/\./g, ".");
const formatTotal = (n) => "Rp. " + n.toLocaleString("id-ID").replace(/\./g, ".");

const bulanIni = () => {
  const d = new Date();
  return d.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
};

const TabelPenjualan = ({ data, onDataChange }) => {
  const [editItem, setEditItem] = useState(null);
  const [hapusItem, setHapusItem] = useState(null);

  const kolomPenjualan = [
    { header: "Nama Produk", key: "namaProduk" },
    { header: "Harga", key: "harga", render: (item) => formatRupiah(item.harga) },
    { header: "Jumlah", key: "jumlah" },
    { header: "Total", key: "total", render: (item) => formatTotal(item.harga * item.jumlah) },
  ];

  const handleSaveEdit = (updated) => {
    const updatedData = data.map((item) =>
      item.id === updated.id ? { ...updated, total: updated.harga * updated.jumlah } : item
    );
    onDataChange(updatedData);
    setEditItem(null);
  };

  const handleHapus = (id) => {
    const updatedData = data.filter((item) => item.id !== id);
    onDataChange(updatedData);
    setHapusItem(null);
  };

  return (
    <div style={{ fontFamily: "'Geist Variable', 'Inter', sans-serif" }}>
      
       <h2 className="text-base font-semibold text-neutral-900">
  Tabel Data Penjualan
</h2>
<p className="mb-5 text-sm text-neutral-400">{bulanIni()}</p>

      {/* KOTAK UTAMA TABEL */}
      <BaseTable
        columns={kolomPenjualan}
        data={data}
        actionRow={(item) => (
          <>
            <button
              onClick={() => setEditItem(item)}
              title="Edit"
              style={{ background: "none", border: "none", cursor: "pointer", color: "#D97706", display: "flex" }}
            >
              <SquarePen size={17} strokeWidth={1.8} />
            </button>
            <button
              onClick={() => setHapusItem(item)}
              title="Hapus"
              style={{ background: "none", border: "none", cursor: "pointer", color: "#E02424", display: "flex" }}
            >
              <Trash2 size={17} strokeWidth={1.8} />
            </button>
          </>
        )}
      />

      {/* Modals Section */}
      <EditPenjualanModal isOpen={!!editItem} item={editItem} onClose={() => setEditItem(null)} onSave={handleSaveEdit} />
      <HapusPenjualanModal isOpen={!!hapusItem} item={hapusItem} onClose={() => setHapusItem(null)} onConfirm={handleHapus} />
    </div>
  );
};

export default TabelPenjualan;