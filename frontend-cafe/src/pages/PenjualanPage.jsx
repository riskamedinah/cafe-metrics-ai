import { useState } from "react";
import { Search, SquarePen, Trash2 } from "lucide-react";
import EditPenjualanModal from "../components/modals/EditPenjualanModal";
import HapusPenjualanModal from "../components/modals/HapusPenjualanModal";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const initialData = [
  { id: 1, namaProduk: "Sepatu Running", harga: 100000, jumlah: 2 },
  { id: 2, namaProduk: "Baju Sporty", harga: 150000, jumlah: 1 },
  { id: 3, namaProduk: "Tumbler Stainless", harga: 85000, jumlah: 3 },
  { id: 4, namaProduk: "Tas Ransel", harga: 250000, jumlah: 1 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatRupiah = (n) => "Rp " + n.toLocaleString("id-ID").replace(/\./g, ".");
const formatTotal = (n) => "Rp. " + n.toLocaleString("id-ID").replace(/\./g, ".");

const bulanIni = () => {
  const d = new Date();
  return d.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const thStyle = {
  padding: "10px 16px",
  textAlign: "left",
  fontSize: "12px",
  fontWeight: 600,
  color: "#6B7280",
  letterSpacing: "0.02em",
  background: "#EEF2FF",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "12px 16px",
  fontSize: "13px",
  color: "#374151",
  borderBottom: "1px solid #F3F4F6",
};

// ─── Main Component ──────────────────────────────────────────────────────────
export default function ManagementPenjualan() {
  const [penjualan, setPenjualan] = useState(initialData);
  const [search, setSearch] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [hapusItem, setHapusItem] = useState(null);

  const filtered = penjualan.filter((p) =>
    p.namaProduk.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveEdit = (updated) => {
    setPenjualan((prev) =>
      prev.map((p) =>
        p.id === updated.id
          ? { ...updated, total: updated.harga * updated.jumlah }
          : p
      )
    );
  };

  const handleHapus = (id) => {
    setPenjualan((prev) => prev.filter((p) => p.id !== id));
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

      {/* Search Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "#fff",
          border: "1px solid #DDE1E7",
          borderRadius: "8px",
          padding: "10px 14px",
          maxWidth: 340,
          marginBottom: 24,
        }}
      >
        <Search size={16} color="#9DA3AE" strokeWidth={2} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari Penjualan"
          style={{
            border: "none",
            outline: "none",
            fontSize: "13px",
            color: "#374151",
            background: "transparent",
            width: "100%",
            fontFamily: "inherit",
          }}
        />
      </div>

      {/* Table Card */}
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          border: "1px solid #E8E9EC",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        {/* Card Header */}
        <div style={{ padding: "18px 20px 14px" }}>
          <p
            style={{
              fontWeight: 700,
              fontSize: "14px",
              color: "#1E1F24",
              margin: 0,
            }}
          >
            Tabel Data Penjualan
          </p>
          <p style={{ fontSize: "12px", color: "#9DA3AE", margin: "2px 0 0" }}>
            {bulanIni()}
          </p>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Nama Produk</th>
                <th style={thStyle}>Harga</th>
                <th style={thStyle}>Jumlah</th>
                <th style={thStyle}>Total</th>
                <th style={{ ...thStyle, textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      ...tdStyle,
                      textAlign: "center",
                      color: "#9DA3AE",
                      padding: "32px",
                    }}
                  >
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    style={{ transition: "background 0.1s" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#FAFAFA")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td style={tdStyle}>{item.namaProduk}</td>
                    <td style={tdStyle}>{formatRupiah(item.harga)}</td>
                    <td style={tdStyle}>{item.jumlah}</td>
                    <td style={tdStyle}>{formatTotal(item.harga * item.jumlah)}</td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: 10,
                          justifyContent: "center",
                        }}
                      >
                        {/* Edit Button */}
                        <button
                          onClick={() => setEditItem(item)}
                          title="Edit"
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 2,
                            color: "#D97706",
                            display: "flex",
                            transition: "opacity 0.15s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.opacity = "0.7")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.opacity = "1")
                          }
                        >
                          <SquarePen size={17} strokeWidth={1.8} />
                        </button>
                        {/* Hapus Button */}
                        <button
                          onClick={() => setHapusItem(item)}
                          title="Hapus"
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 2,
                            color: "#E02424",
                            display: "flex",
                            transition: "opacity 0.15s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.opacity = "0.7")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.opacity = "1")
                          }
                        >
                          <Trash2 size={17} strokeWidth={1.8} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {editItem && (
        <EditPenjualanModal
          item={editItem}
          onClose={() => setEditItem(null)}
          onSave={handleSaveEdit}
        />
      )}
      {hapusItem && (
        <HapusPenjualanModal
          item={hapusItem}
          onClose={() => setHapusItem(null)}
          onConfirm={handleHapus}
        />
      )}
    </div>
  );
}