import { useState, useEffect } from "react";
import BarangCard from "../components/ui/BarangCard";
import BeliBarangModal from "../components/modals/BeliBarangModal"; // tambah ini
import { useToast } from "../components/ui/Notification";
import { useData } from "../context/DataContext";
import EmptyState from "../components/ui/EmptyState";
import LoadingState from "../components/ui/LoadingState";

export default function BarangPage() {
  const { barang, fetchBarang, loadingBarang } = useData();
  const [modalBeli, setModalBeli] = useState(null); // tambah ini — nyimpen item yang mau dibeli

  useEffect(() => {
    fetchBarang();
  }, []);

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
    setModalBeli(item); // ganti alert() jadi buka modal
  };

  if (loadingBarang && dataBarang.length === 0) {
    return (
      <div style={{ padding: 32, background: "#F4F5F7", minHeight: "100vh" }}>
        <LoadingState text="Memuat data barang..." />
      </div>
    );
  }

  return (
    <div style={{ padding: "32px", background: "#F4F5F7", minHeight: "100vh", fontFamily: "'Geist Variable', 'Inter', sans-serif" }}>
      {dataBarang.length === 0 ? (
        <EmptyState
          title="Belum ada produk"
          description="Tidak ada barang yang tersedia untuk dibeli saat ini."
        />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
          {dataBarang.map((item) => (
            <BarangCard key={item.id} item={item} onBeli={handleBeli} />
          ))}
        </div>
      )}

      <BeliBarangModal
        isOpen={!!modalBeli}
        item={modalBeli}
        onClose={() => setModalBeli(null)}
        onSuccess={() => fetchBarang()} // atau refreshPenjualan() kalau ada di context
      />
    </div>
  );
}