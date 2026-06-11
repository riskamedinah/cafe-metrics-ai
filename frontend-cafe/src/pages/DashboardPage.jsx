import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Package, TrendingDown, ShoppingCart, Wallet, Pencil, Trash2 } from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const STAT_CARDS = [
  {
    id: "penjualan-hari",
    label: "Penjualan Hari Ini",
    value: "4",
    unit: null,
    icon: Package,
    colorClass: "stat-blue",
  },
  {
    id: "pendapatan-hari",
    label: "Pendapatan Hari Ini",
    value: "Rp 1.000.000",
    unit: null,
    icon: TrendingDown,
    colorClass: "stat-indigo",
  },
  {
    id: "penjualan-bulan",
    label: "Penjualan Bulan Ini",
    value: "5",
    unit: null,
    icon: ShoppingCart,
    colorClass: "stat-blue",
  },
  {
    id: "pendapatan-bulan",
    label: "Pendapatan Bulan Ini",
    value: "Rp 1.250.000",
    unit: null,
    icon: Wallet,
    colorClass: "stat-indigo",
  },
];

const CHART_DATA = [
  { minggu: "Minggu 1", totalPenjualan: 2, totalHarga: 250000 },
  { minggu: "Minggu 2", totalPenjualan: 3, totalHarga: 1000000 },
  { minggu: "Minggu 3", totalPenjualan: 2, totalHarga: 200000 },
  { minggu: "Minggu 4", totalPenjualan: 3.5, totalHarga: 350000 },
  { minggu: "Minggu 5", totalPenjualan: 2.7, totalHarga: 280000 },
];

const TABLE_DATA = [
  {
    id: 1,
    nama_produk: "Sepatu Running",
    harga: 100000,
    jumlah: 2,
    total: 200000,
  },
  {
    id: 2,
    nama_produk: "Baju Sporty",
    harga: 150000,
    jumlah: 1,
    total: 400000,
  },
  {
    id: 3,
    nama_produk: "Celana Training",
    harga: 120000,
    jumlah: 3,
    total: 360000,
  },
  {
    id: 4,
    nama_produk: "Topi Kasual",
    harga: 75000,
    jumlah: 2,
    total: 150000,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace("IDR", "Rp")
    .trim();

const formatShortRupiah = (value) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}jt`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}rb`;
  return value.toString();
};

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="tooltip-box">
      <p className="tooltip-label">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="tooltip-value" style={{ color: entry.color }}>
          {entry.dataKey === "totalHarga"
            ? formatRupiah(entry.value)
            : `${entry.value} penjualan`}
        </p>
      ))}
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard = ({ label, value, icon: Icon }) => (
  <div className="stat-card">
    <div className="stat-icon-wrap">
      <Icon size={18} strokeWidth={1.5} className="stat-icon" />
    </div>
    <p className="stat-label">{label}</p>
    <p className="stat-value">{value}</p>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const DashboardPage = () => {
  const [deletingId, setDeletingId] = useState(null);
  const [tableData, setTableData] = useState(TABLE_DATA);

  const handleDelete = (id) => {
    setDeletingId(id);
    setTimeout(() => {
      setTableData((prev) => prev.filter((item) => item.id !== id));
      setDeletingId(null);
    }, 400);
  };

  return (
    <>
      <style>{`
        /* ── Layout ── */
        .dashboard-root {
          display: flex;
          flex-direction: column;
          gap: 24px;
          padding: 28px 32px;
          min-height: 100vh;
          background: #F4F5F7;
          font-family: 'Geist Variable', 'Geist', ui-sans-serif, system-ui, sans-serif;
          color: #373742;
        }

        /* ── Stat Cards ── */
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .stat-card {
          background: #ffffff;
          border-radius: 14px;
          padding: 20px;
          border: 1px solid #E8E9EE;
          display: flex;
          flex-direction: column;
          gap: 6px;
          transition: box-shadow 0.15s ease;
        }

        .stat-card:hover {
          box-shadow: 0 4px 16px rgba(59, 91, 219, 0.08);
        }

        .stat-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #EEF2FF;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
        }

        .stat-icon {
          color: #3B5BDB;
        }

        .stat-label {
          font-size: 13px;
          color: #7B7C8D;
          font-weight: 400;
          margin: 0;
          letter-spacing: 0.01em;
        }

        .stat-value {
          font-size: 22px;
          font-weight: 600;
          color: #373742;
          margin: 0;
          letter-spacing: -0.02em;
        }

        /* ── Panel (Chart + Table wrapper) ── */
        .panel {
          background: #ffffff;
          border-radius: 14px;
          border: 1px solid #E8E9EE;
          padding: 24px;
        }

        .panel-title {
          font-size: 16px;
          font-weight: 600;
          color: #373742;
          margin: 0 0 2px;
        }

        .panel-subtitle {
          font-size: 13px;
          color: #9A9BAA;
          margin: 0 0 20px;
          font-weight: 400;
        }

        /* ── Chart ── */
        .chart-wrap {
          height: 240px;
        }

        /* ── Table ── */
        .sales-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        .sales-table thead tr {
          background: #F4F5F7;
        }

        .sales-table th {
          text-align: left;
          padding: 10px 14px;
          font-size: 13px;
          font-weight: 500;
          color: #7B7C8D;
          border-bottom: 1px solid #E8E9EE;
        }

        .sales-table td {
          padding: 12px 14px;
          border-bottom: 1px solid #F4F5F7;
          color: #373742;
          font-size: 14px;
        }

        .sales-table tbody tr:last-child td {
          border-bottom: none;
        }

        .sales-table tbody tr {
          transition: background 0.12s ease;
        }

        .sales-table tbody tr:hover {
          background: #F9FAFB;
        }

        .sales-table tbody tr.deleting {
          opacity: 0;
          transform: translateX(8px);
          transition: opacity 0.35s ease, transform 0.35s ease;
        }

        /* ── Action Buttons ── */
        .action-wrap {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .btn-icon {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.12s ease, transform 0.1s ease;
        }

        .btn-edit {
          background: #FFF7E6;
          color: #D97706;
        }

        .btn-edit:hover {
          background: #FEF3C7;
        }

        .btn-delete {
          background: #FEF2F2;
          color: #EF4444;
        }

        .btn-delete:hover {
          background: #FEE2E2;
        }

        .btn-icon:active {
          transform: scale(0.93);
        }

        /* ── Tooltip ── */
        .tooltip-box {
          background: #373742;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 13px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }

        .tooltip-label {
          color: #9A9BAA;
          font-size: 12px;
          margin: 0 0 4px;
        }

        .tooltip-value {
          margin: 2px 0;
          font-weight: 500;
        }

        /* ── Legend ── */
        .chart-legend {
          display: flex;
          gap: 20px;
          margin-bottom: 16px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #7B7C8D;
        }

        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .stat-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 560px) {
          .dashboard-root {
            padding: 16px;
          }
          .stat-grid {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }
          .stat-value {
            font-size: 18px;
          }
        }
      `}</style>

      <div className="dashboard-root">
        {/* ── Stat Cards ── */}
        <div className="stat-grid">
          {STAT_CARDS.map((card) => (
            <StatCard key={card.id} {...card} />
          ))}
        </div>

        {/* ── Chart Panel ── */}
        <div className="panel">
          <p className="panel-title">Grafik Penjualan Dan Total Harga</p>
          <p className="panel-subtitle">Januari 2026</p>

          <div className="chart-legend">
            <span className="legend-item">
              <span className="legend-dot" style={{ background: "#3B5BDB" }} />
              Total Penjualan
            </span>
            <span className="legend-item">
              <span className="legend-dot" style={{ background: "#94A3B8" }} />
              Total Harga
            </span>
          </div>

          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={CHART_DATA}
                margin={{ top: 8, right: 20, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F2F6" vertical={false} />
                <XAxis
                  dataKey="minggu"
                  tick={{ fontSize: 12, fill: "#9A9BAA" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 12, fill: "#9A9BAA" }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                  domain={[0, 5]}
                  ticks={[0, 1, 2, 3, 4, 5]}
                  label={{
                    value: "Total Penjualan",
                    angle: -90,
                    position: "insideLeft",
                    offset: 12,
                    style: { fontSize: 11, fill: "#9A9BAA" },
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12, fill: "#9A9BAA" }}
                  axisLine={false}
                  tickLine={false}
                  width={56}
                  tickFormatter={formatShortRupiah}
                  label={{
                    value: "Total Harga",
                    angle: 90,
                    position: "insideRight",
                    offset: -4,
                    style: { fontSize: 11, fill: "#9A9BAA" },
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="totalPenjualan"
                  stroke="#3B5BDB"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#3B5BDB", strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "#3451C7" }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="totalHarga"
                  stroke="#94A3B8"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#94A3B8", strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "#64748B" }}
                  strokeDasharray="5 3"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Table Panel ── */}
        <div className="panel">
          <p className="panel-title">Tabel Data Penjualan</p>
          <p className="panel-subtitle">Januari 2026</p>

          <table className="sales-table">
            <thead>
              <tr>
                <th>Nama Produk</th>
                <th>Harga</th>
                <th>Jumlah</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr
                  key={row.id}
                  className={deletingId === row.id ? "deleting" : ""}
                >
                  <td>{row.nama_produk}</td>
                  <td>{formatRupiah(row.harga)}</td>
                  <td>{row.jumlah}</td>
                  <td style={{ fontWeight: 500 }}>{formatRupiah(row.total)}</td>
                  <td>
                    <div className="action-wrap">
                      <button
                        className="btn-icon btn-edit"
                        title="Edit"
                        aria-label={`Edit ${row.nama_produk}`}
                      >
                        <Pencil size={14} strokeWidth={2} />
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        title="Hapus"
                        aria-label={`Hapus ${row.nama_produk}`}
                        onClick={() => handleDelete(row.id)}
                      >
                        <Trash2 size={14} strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {tableData.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      textAlign: "center",
                      padding: "32px",
                      color: "#9A9BAA",
                      fontSize: "13px",
                    }}
                  >
                    Belum ada data penjualan bulan ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;