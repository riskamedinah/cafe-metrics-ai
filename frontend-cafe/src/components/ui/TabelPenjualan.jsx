import { useState } from "react";
import { SquarePen, Trash2 } from "lucide-react";
import EditPenjualanModal from "../modals/EditPenjualanModal";
import HapusPenjualanModal from "../modals/HapusPenjualanModal";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatRupiah = (n) => "Rp " + n.toLocaleString("id-ID").replace(/\./g, ".");
const formatTotal = (n) => "Rp. " + n.toLocaleString("id-ID").replace(/\./g, ".");

const bulanIni = () => {
  const d = new Date();
  return d.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
};

// ─── Main Component ──────────────────────────────────────────────────────────
const TabelPenjualan = ({ data, onDataChange }) => {
  const [editItem, setEditItem] = useState(null);
  const [hapusItem, setHapusItem] = useState(null);

  const handleSaveEdit = (updated) => {
    const updatedData = data.map((item) =>
      item.id === updated.id
        ? { ...updated, total: updated.harga * updated.jumlah }
        : item
    );
    onDataChange(updatedData);
    setEditItem(null);
  };

  const handleHapus = (id) => {
    const updatedData = data.filter((item) => item.id !== id);
    onDataChange(updatedData);
    setHapusItem(null);
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        border: "1px solid #E8E9EC",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        fontFamily: "'Geist Variable', 'Inter', sans-serif",
      }}
    >
      {/* Card Header */}
      <div style={{ padding: "18px 20px 14px" }}>
        <p style={{ fontWeight: 700, fontSize: "14px", color: "#1E1F24", margin: 0 }}>
          Tabel Data Penjualan
        </p>
        <p style={{ fontSize: "12px", color: "#9DA3AE", margin: "2px 0 0" }}>
          {bulanIni()}
        </p>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            borderTop: "1px solid #E8E9EC",
          }}
        >
          <thead>
            <tr style={{ background: "#EEF2FF" }}>
              {["Nama Produk", "Harga", "Jumlah", "Total"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "10px 16px",
                    textAlign: "left",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#4B5563",
                    letterSpacing: "0.02em",
                    whiteSpace: "nowrap",
                    borderBottom: "1px solid #D8DCF0",
                  }}
                >
                  {h}
                </th>
              ))}
              <th
                style={{
                  padding: "10px 16px",
                  textAlign: "center",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#4B5563",
                  letterSpacing: "0.02em",
                  whiteSpace: "nowrap",
                  borderBottom: "1px solid #D8DCF0",
                }}
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    textAlign: "center",
                    color: "#9DA3AE",
                    fontSize: "13px",
                    padding: "32px",
                  }}
                >
                  Tidak ada data ditemukan.
                </td>
              </tr>
            ) : (
              data.map((item, idx) => (
                <tr
                  key={item.id}
                  style={{
                    background: "#fff",
                    borderBottom:
                      idx === data.length - 1
                        ? "none"
                        : "1px solid #F3F4F6",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#F8F9FF")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#fff")
                  }
                >
                  <td
                    style={{
                      padding: "13px 16px",
                      fontSize: "13px",
                      color: "#1E1F24",
                      fontWeight: 400,
                    }}
                  >
                    {item.namaProduk}
                  </td>
                  <td
                    style={{
                      padding: "13px 16px",
                      fontSize: "13px",
                      color: "#374151",
                    }}
                  >
                    {formatRupiah(item.harga)}
                  </td>
                  <td
                    style={{
                      padding: "13px 16px",
                      fontSize: "13px",
                      color: "#374151",
                    }}
                  >
                    {item.jumlah}
                  </td>
                  <td
                    style={{
                      padding: "13px 16px",
                      fontSize: "13px",
                      color: "#374151",
                    }}
                  >
                    {formatTotal(item.harga * item.jumlah)}
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <button
                        onClick={() => setEditItem(item)}
                        title="Edit"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: "2px",
                          color: "#D97706",
                          display: "flex",
                          alignItems: "center",
                          transition: "opacity 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.opacity = "0.65")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.opacity = "1")
                        }
                      >
                        <SquarePen size={17} strokeWidth={1.8} />
                      </button>
                      <button
                        onClick={() => setHapusItem(item)}
                        title="Hapus"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: "2px",
                          color: "#E02424",
                          display: "flex",
                          alignItems: "center",
                          transition: "opacity 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.opacity = "0.65")
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
};

export default TabelPenjualan;