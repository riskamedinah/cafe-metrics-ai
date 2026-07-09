import { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Package, TrendingDown, ShoppingCart, Wallet } from "lucide-react";
import TabelPenjualan from "../components/ui/TabelPenjualan";
// UBAH: tidak perlu import api, pakai useData
import { useData } from "../context/DataContext";
import { useNavigate } from 'react-router-dom';
import LoadingState from "../components/ui/LoadingState";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  })
    .format(value)
    .replace("IDR", "Rp")
    .trim();

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
   const navigate = useNavigate();
  const { dashboard, fetchDashboard, loadingDashboard } = useData();

  useEffect(() => {
    fetchDashboard();
  }, []);

if (loadingDashboard || !dashboard) {
  return (
    <div className="dashboard-root" style={{ padding: "28px 32px", background: "#F4F5F7", minHeight: "100vh" }}>
      <LoadingState text="Memuat dashboard..." />
    </div>
  );
}

  const { stats, chart, table } = dashboard;

  const statCards = [
    { id: 1, label: "Total Produk", value: stats.totalProduk.toString(), icon: Package },
    { id: 2, label: "Kategori", value: stats.totalKategori.toString(), icon: TrendingDown },
    { id: 3, label: "Total Penjualan", value: stats.totalPenjualan.toString(), icon: ShoppingCart },
    { id: 4, label: "Pendapatan", value: formatRupiah(stats.totalPendapatan), icon: Wallet },
  ];

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
        }

        .stat-value {
          font-size: 22px;
          font-weight: 600;
          color: #373742;
          margin: 0;
        }

        /* ── Panel ── */
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
        }

        /* ── Chart ── */
        .chart-wrap {
          height: 240px;
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
        <div className="stat-grid">
          {statCards.map((card) => (
            <StatCard key={card.id} {...card} />
          ))}
        </div>

        <div className="panel">
          <p className="panel-title">Grafik Penjualan Dan Total Harga</p>
          <p className="panel-subtitle">
            {new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
          </p>
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
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontSize: 11, color: "#9A9BAA", whiteSpace: "nowrap", flexShrink: 0 }}>
              Total Penjualan
            </div>
            <div className="chart-wrap" style={{ flex: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chart} margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F2F6" vertical={false} />
                  <XAxis dataKey="minggu" tick={{ fontSize: 12, fill: "#9A9BAA" }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12, fill: "#9A9BAA" }} axisLine={false} tickLine={false} width={28} domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: "#9A9BAA" }} axisLine={false} tickLine={false} width={48} domain={[0, 400000]} ticks={[0, 100000, 200000, 300000, 400000]} tickFormatter={(v) => {
                    if (v >= 1000000) return `${(v / 1000000).toFixed(0)}jt`;
                    if (v >= 1000) return `${(v / 1000).toFixed(0)}rb`;
                    return v.toString();
                  }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line yAxisId="left" type="linear" dataKey="totalPenjualan" stroke="#3B5BDB" strokeWidth={2} dot={{ r: 4, fill: "white", stroke: "#3B5BDB", strokeWidth: 2 }} activeDot={{ r: 6, fill: "white", stroke: "#3451C7", strokeWidth: 2.5 }} isAnimationActive={false} />
                  <Line yAxisId="right" type="linear" dataKey="totalHarga" stroke="#94A3B8" strokeWidth={2} strokeDasharray="6 4" dot={{ r: 4, fill: "white", stroke: "#94A3B8", strokeWidth: 2 }} activeDot={{ r: 6, fill: "white", stroke: "#64748B", strokeWidth: 2.5 }} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ writingMode: "vertical-rl", fontSize: 11, color: "#9A9BAA", whiteSpace: "nowrap", flexShrink: 0 }}>
              Total Harga
            </div>
          </div>
        </div>

        <div className="panel">
        <TabelPenjualan
    data={table}
    onEditBarang={(item) => {
      navigate('/barang-management', {
        state: { openEditModal: true, barangId: item.barangId }
      });
    }}
    onHapusBarang={(item) => {
      navigate('/barang-management', {
        state: { openHapusModal: true, barangId: item.barangId }
      });
    }}
  />  
        </div>
      </div>
    </>
  );
};

export default DashboardPage;