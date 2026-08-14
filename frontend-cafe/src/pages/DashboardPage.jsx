import { useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Package, TrendingDown, ShoppingCart, Wallet, SquarePen, Trash2 } from "lucide-react";
import BaseTable from "../components/ui/BaseTable";
import { useData } from "../context/DataContext";
import { useNavigate } from 'react-router-dom';
import LoadingState from "../components/ui/LoadingState";

const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  })
    .format(value || 0)
    .replace("IDR", "Rp")
    .trim();

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-xl bg-neutral-900 p-2.5 px-3.5 text-xs text-white shadow-xl">
      <p className="mb-1 text-xs text-neutral-300">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="my-0.5 font-medium" style={{ color: entry.color }}>
          {entry.dataKey === "totalHarga"
            ? formatRupiah(entry.value)
            : `${entry.value} penjualan`}
        </p>
      ))}
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon }) => (
  <div className="flex flex-col gap-1.5 rounded-xl border border-neutral-100 bg-white p-5 transition-shadow duration-150 hover:shadow-md">
    <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
      <Icon size={18} strokeWidth={1.5} className="text-primary" />
    </div>
    <p className="m-0 text-xs text-neutral-400">{label}</p>
    <p className="m-0 text-xl font-semibold text-neutral-900 sm:text-2xl">{value}</p>
  </div>
);

const DashboardPage = () => {
  const navigate = useNavigate();
  const { dashboard, fetchDashboard, loadingDashboard } = useData();

  useEffect(() => {
    if (!dashboard) {
      fetchDashboard();
    }
  }, [dashboard, fetchDashboard]);

  if (loadingDashboard && !dashboard) {
    return (
      <div className="min-h-screen bg-neutral-50 p-7">
        <LoadingState text="Memuat dashboard..." />
      </div>
    );
  }

  if (!dashboard) return null;

  const { stats, chart, table } = dashboard;

  const statCards = [
    { id: 1, label: "Total Produk", value: (stats?.totalProduk ?? 0).toString(), icon: Package },
    { id: 2, label: "Kategori", value: (stats?.totalKategori ?? 0).toString(), icon: TrendingDown },
    { id: 3, label: "Total Penjualan", value: (stats?.totalPenjualan ?? 0).toString(), icon: ShoppingCart },
    { id: 4, label: "Pendapatan", value: formatRupiah(stats?.totalPendapatan), icon: Wallet },
  ];

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-neutral-50 p-4 font-sans text-neutral-900 sm:p-7">
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-4">
        {statCards.map((card) => (
          <StatCard key={card.id} {...card} />
        ))}
      </div>

      {/* Panel Grafik */}
      <div className="rounded-xl border border-neutral-100 bg-white p-6">
        <p className="m-0 text-base font-semibold text-neutral-900">Grafik Penjualan Dan Total Harga</p>
        <p className="mb-5 text-xs text-neutral-300">
          {new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
        </p>

        <div className="mb-4 flex gap-5">
          <span className="flex items-center gap-1.5 text-xs text-neutral-400">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Total Penjualan
          </span>
          <span className="flex items-center gap-1.5 text-xs text-neutral-400">
            <span className="h-2 w-2 rounded-full bg-neutral-300" />
            Total Harga
          </span>
        </div>

        {/* Chart Container dengan h-60 (240px) */}
        <div className="flex h-60 w-full items-center gap-2">
          <div className="shrink-0 rotate-180 text-xs text-neutral-300 [writing-mode:vertical-rl]">
            Total Penjualan
          </div>
          <div className="h-full min-w-0 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart} margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E3E4EA" vertical={false} />
                <XAxis dataKey="minggu" tick={{ fontSize: 12, fill: "#A6AABA" }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 12, fill: "#A6AABA" }} axisLine={false} tickLine={false} width={28} domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: "#A6AABA" }} axisLine={false} tickLine={false} width={48} domain={[0, 400000]} ticks={[0, 100000, 200000, 300000, 400000]} tickFormatter={(v) => {
                  if (v >= 1000000) return `${(v / 1000000).toFixed(0)}jt`;
                  if (v >= 1000) return `${(v / 1000).toFixed(0)}rb`;
                  return v.toString();
                }} />
                <Tooltip content={<CustomTooltip />} />
                <Line yAxisId="left" type="linear" dataKey="totalPenjualan" stroke="#3A72D2" strokeWidth={2} dot={{ r: 4, fill: "white", stroke: "#3A72D2", strokeWidth: 2 }} activeDot={{ r: 6, fill: "white", stroke: "#3569C1", strokeWidth: 2.5 }} isAnimationActive={false} />
                <Line yAxisId="right" type="linear" dataKey="totalHarga" stroke="#A6AABA" strokeWidth={2} strokeDasharray="6 4" dot={{ r: 4, fill: "white", stroke: "#A6AABA", strokeWidth: 2 }} activeDot={{ r: 6, fill: "white", stroke: "#7A7F96", strokeWidth: 2.5 }} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="shrink-0 text-xs text-neutral-300 [writing-mode:vertical-rl]">
            Total Harga
          </div>
        </div>
      </div>

      {/* Panel Tabel */}
      <div className="rounded-xl border border-neutral-100 bg-white p-6">
        <h2 className="text-base font-semibold text-neutral-900">Tabel Data Penjualan</h2>
        <p className="mb-5 text-sm text-neutral-300">
          {new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
        </p>

        <BaseTable
          columns={[
            { header: "Nama Produk", key: "namaProduk" },
            {
              header: "Harga",
              key: "harga",
              render: (item) => `Rp ${(item.harga || 0).toLocaleString("id-ID")}`,
            },
            { header: "Jumlah", key: "jumlah" },
            {
              header: "Total",
              key: "total",
              render: (item) => `Rp ${(item.harga * item.jumlah || 0).toLocaleString("id-ID")}`,
            },
          ]}
          data={table}
          actionRow={(item) => (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/barang-management', {
                  state: { openEditModal: true, barangId: item.barangId }
                })}
                title="Edit Barang"
                className="cursor-pointer text-warning hover:opacity-80"
              >
                <SquarePen size={17} strokeWidth={1.8} />
              </button>
              <button
                onClick={() => navigate('/barang-management', {
                  state: { openHapusModal: true, barangId: item.barangId }
                })}
                title="Hapus Barang"
                className="cursor-pointer text-danger hover:opacity-80"
              >
                <Trash2 size={17} strokeWidth={1.8} />
              </button>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default DashboardPage;