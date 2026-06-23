import { useState } from "react";
import TabelPenjualan from "../components/ui/TabelPenjualan";
import BaseSearch from "../components/ui/BaseSearch";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const initialData = [
  { id: 1, namaProduk: "Sepatu Running", harga: 100000, jumlah: 2 },
  { id: 2, namaProduk: "Baju Sporty", harga: 150000, jumlah: 1 },
];

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
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 w-full mb-4">
        <BaseSearch
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari Kategori"
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
        <TabelPenjualan 
          data={filteredData} 
          onDataChange={setPenjualan} 
        />
      </div>
    </div>
  );
}