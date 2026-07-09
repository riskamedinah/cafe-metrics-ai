import { useState, useEffect } from "react";
import BarangCard from "../components/ui/BarangCard";
import { useData } from "../context/DataContext";
import LoadingState from "../components/ui/LoadingState";

export default function BarangPage() {
  // UBAH: ambil data dari context
  const { barang, fetchBarang, loadingBarang } = useData();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBarang();
  }, []);

  // UBAH: tidak perlu mapping lagi, tapi jika format BarangCard butuh properti spesifik, mapping disini
  const dataBarang = barang
    ? barang.map((item) => ({
        id: item.id,
        nama: item.nama_barang,
        harga: item.harga_barang,
        gambar: item.foto_barang || "/placeholder.svg",
        kategori: item.kategori?.nama_kategori || "Tidak diketahui",
        deskripsi: item.deskripsi_barang,
      }))
    : [];

  const handleBeli = (item) => {
    alert(`Beli: ${item.nama}`);
  };

if (loadingBarang && dataBarang.length === 0) {
  return (
    <div style={{ padding: 32, background: "#F4F5F7", minHeight: "100vh" }}>
      <LoadingState text="Memuat data barang..." />
    </div>
  );
}

  return (
    <div
      style={{
        padding: "32px",
        background: "#F4F5F7",
        minHeight: "100vh",
        fontFamily: "'Geist Variable', 'Inter', sans-serif",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        {dataBarang.map((item) => (
          <BarangCard key={item.id} item={item} onBeli={handleBeli} />
        ))}
      </div>
    </div>
  );
}