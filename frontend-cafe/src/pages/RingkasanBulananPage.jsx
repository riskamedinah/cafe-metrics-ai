import { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import BaseSearch from "../components/ui/BaseSearch";
import BaseTable from "../components/ui/BaseTable";
import RingkasanBulananModal from "../components/modals/RingkasanBulananModal";
import { useData } from "../context/DataContext";
import LoadingState from "../components/ui/LoadingState";

const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const bulanIni = () => {
  const d = new Date();
  return d.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
};

export default function RingkasanBulananPage() {
  const { ringkasan, fetchRingkasan, loadingRingkasan } = useData();
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchRingkasan();
  }, []);

  const data = ringkasan || [];

  const filteredData = data.filter(
    (item) =>
      item.bulan.toLowerCase().includes(search.toLowerCase()) ||
      item.tahun.toString().includes(search)
  );

  const handleOpenDetail = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const columns = [
    { header: "Bulan", key: "bulan" },
    { header: "Tahun", key: "tahun" },
    { header: "Total Penjualan", key: "totalPenjualan" },
    {
      header: "Total Pendapatan",
      key: "totalPendapatan",
      render: (item) => `Rp ${item.totalPendapatan.toLocaleString("id-ID")}`,
    },
    {
      header: "Ringkasan AI",
      key: "ringkasanAI",
      render: (item) => {
        const text = item.ringkasanAI;
        return text && text.length > 50 ? text.slice(0, 50) + "..." : text;
      },
    },
  ];

  const actionRow = (item) => (
    <button onClick={() => handleOpenDetail(item)} style={{ background: "none", border: "none", cursor: "pointer" }}>
      <Eye size={18} color="#0891B2" />
    </button>
  );

  return (
    <div className="p-8 bg-[#F4F5F7] min-h-screen font-sans">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
        <BaseSearch value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari Ringkasan Bulanan" />
      </div>
      <div className="bg-white rounded-xl border border-[#E8E9EE] p-6">
        <h2 className="text-base font-semibold text-neutral-900">Tabel Data Ringkasan Bulanan</h2>
        <p className="mb-5 text-sm text-neutral-400">{bulanIni()}</p>

        {loadingRingkasan && data.length === 0 ? (
          <LoadingState text="Memuat data ringkasan bulanan..." />
        ) : (
          <BaseTable columns={columns} data={filteredData} actionRow={actionRow} emptyMessage="Tidak ada data ringkasan." />
        )}
      </div>
      <RingkasanBulananModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setSelectedItem(null); }} data={selectedItem} />
    </div>
  );
}