import { useState } from "react";
import BarangCard from "../components/ui/BarangCard";
import { mockBarang } from "../data/barangMock";

export default function BarangPage() {
  const [barang] = useState(mockBarang);

  const handleBeli = (item) => {
    alert(`Beli: ${item.nama}`);
  };

  return (
    <div
      style={{
        padding: "32px",
        background: "#F4F5F7",
        minHeight: "100vh",
        fontFamily: "'Geist Variable', 'Inter', sans-serif",
      }}
    >

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        {barang.map((item) => (
          <BarangCard key={item.id} item={item} onBeli={handleBeli} />
        ))}
      </div>
    </div>
  );
}