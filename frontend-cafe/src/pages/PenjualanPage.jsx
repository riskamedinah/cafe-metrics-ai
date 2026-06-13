import { useState } from "react";
import { Search } from "lucide-react";
import TabelPenjualan from "../components/ui/TabelPenjualan";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const initialData = [
  { id: 1, namaProduk: "Sepatu Running", harga: 100000, jumlah: 2 },
  { id: 2, namaProduk: "Baju Sporty", harga: 150000, jumlah: 1 },
];

const bulanIni = () => {
  const d = new Date();
  return d.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
};

export default function ManagementPenjualan() {
  const [penjualan, setPenjualan] = useState(initialData);
  const [search, setSearch] = useState("");

  const filteredData = penjualan.filter((item) =>
    item.namaProduk.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        padding: "32px",
        background: "#F4F5F7",
        minHeight: "100vh",
        fontFamily: "'Geist Variable', 'Inter', sans-serif",
      }}
    >
      {/* Search Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "#fff",
          border: "1px solid #DDE1E7",
          borderRadius: "8px",
          padding: "10px 14px",
          maxWidth: 340,
          marginBottom: 24,
        }}
      >
        <Search size={16} color="#9DA3AE" strokeWidth={2} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari Penjualan"
          style={{
            border: "none",
            outline: "none",
            fontSize: "13px",
            color: "#374151",
            background: "transparent",
            width: "100%",
            fontFamily: "inherit",
          }}
        />
      </div>

      {/* Panel/Card seperti di Dashboard */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "14px",
          border: "1px solid #E8E9EE",
          padding: "24px",
        }}
      >
    

        {/* Tabel Penjualan */}
        <TabelPenjualan 
          data={filteredData} 
          onDataChange={setPenjualan} 
        />
      </div>
    </div>
  );
}