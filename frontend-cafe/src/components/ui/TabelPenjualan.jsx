import { SquarePen, Trash2 } from "lucide-react";
import BaseTable from "./BaseTable";

const formatRupiah = (n) => "Rp " + n.toLocaleString("id-ID").replace(/\./g, ".");
const formatTotal = (n) => "Rp. " + n.toLocaleString("id-ID").replace(/\./g, ".");

const bulanIni = () => {
  const d = new Date();
  return d.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
};

const TabelPenjualan = ({ data, onEditBarang, onHapusBarang }) => {
  const kolomPenjualan = [
    { header: "Nama Produk", key: "namaProduk" },
    { header: "Harga", key: "harga", render: (item) => formatRupiah(item.harga) },
    { header: "Jumlah", key: "jumlah" },
    { header: "Total", key: "total", render: (item) => formatTotal(item.harga * item.jumlah) },
  ];

  return (
    <div style={{ fontFamily: "'Geist Variable', 'Inter', sans-serif" }}>
      <h2 className="text-base font-semibold text-neutral-900">Tabel Data Penjualan</h2>
      <p className="mb-5 text-sm text-neutral-400">{bulanIni()}</p>

      <BaseTable
        columns={kolomPenjualan}
        data={data}
        actionRow={(item) => (
          <>
            <button
              onClick={() => onEditBarang(item)}
              title="Edit Barang"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#D97706",
                display: "flex",
              }}
            >
              <SquarePen size={17} strokeWidth={1.8} />
            </button>
            <button
              onClick={() => onHapusBarang(item)}
              title="Hapus Barang"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#E02424",
                display: "flex",
              }}
            >
              <Trash2 size={17} strokeWidth={1.8} />
            </button>
          </>
        )}
      />
    </div>
  );
};

export default TabelPenjualan;