import { useState } from "react";
import BarangCard from "../components/ui/BarangCard";

// ─── Mock Data ───────────────────────────────────────────────────────────────
// Ganti bagian ini dengan API call kamu nanti
const mockBarang = [
  {
    id: 1,
    nama: "Sepatu Running",
    deskripsi: "Trail Grip Sole",
    gambar: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
  },
  {
    id: 2,
    nama: "Tumbler Stainless",
    deskripsi: "Vacuum Insulated 600ml",
    gambar: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80",
  },
  {
    id: 3,
    nama: "Tas Ransel",
    deskripsi: "Water Resistant Compartment",
    gambar: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
  },
  {
    id: 4,
    nama: "Kaos Activewear",
    deskripsi: "Black Cotton Breathable Fit",
    gambar: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80",
  },
  {
    id: 5,
    nama: "Celana Jogger",
    deskripsi: "Slim Fit Stretch Fabric",
    gambar: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&q=80",
  },
  {
    id: 6,
    nama: "Topi Baseball",
    deskripsi: "Adjustable Unisex Cap",
    gambar: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&q=80",
  },
];

// ─── Main Page Component ──────────────────────────────────────────────────────
export default function BarangPage() {
  const [barang] = useState(mockBarang);

  const handleBeli = (item) => {
    // Nanti bisa diganti dengan modal atau navigasi ke halaman checkout
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