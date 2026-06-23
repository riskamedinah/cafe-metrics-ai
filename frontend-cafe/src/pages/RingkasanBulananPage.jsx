import { useState } from "react";
import { Eye } from "lucide-react";
import BaseSearch from "../components/ui/BaseSearch";
import BaseTable from "../components/ui/BaseTable";
import RingkasanBulananModal from "../components/modals/RingkasanBulananModal";
import { mockRingkasanBulanan } from "../data/ringkasanMock";

const bulanIni = () => {
  const d = new Date();
  return d.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
};

export default function RingkasanBulananPage() {
  const [data] = useState(mockRingkasanBulanan);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

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
        return text.length > 50 ? text.slice(0, 50) + "..." : text;
      },
    },
  ];

  const actionRow = (item) => (
    <button
      onClick={() => handleOpenDetail(item)}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      title="Lihat Detail"
    >
      <Eye size={18} color="#0891B2" strokeWidth={1.8} />
    </button>
  );

  return (
    <div className="p-8 bg-[#F4F5F7] min-h-screen font-sans">
      {/* Search */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
        <BaseSearch
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari Ringkasan Bulanan"
        />
      </div>

      {/* Card Tabel */}
      <div className="bg-white rounded-xl border border-[#E8E9EE] p-6">
        <h2 className="text-base font-semibold text-neutral-900">
          Tabel Data Ringkasan Bulanan
        </h2>
        <p className="mb-5 text-sm text-neutral-400">{bulanIni()}</p>

        <BaseTable
          columns={columns}
          data={filteredData}
          actionRow={actionRow}
          emptyMessage="Tidak ada data ringkasan."
        />
      </div>

      {/* Modal Detail */}
      <RingkasanBulananModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedItem(null);
        }}
        data={selectedItem}
      />
    </div>
  );
}