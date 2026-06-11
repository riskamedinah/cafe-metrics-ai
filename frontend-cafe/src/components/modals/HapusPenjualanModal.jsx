import { X } from "lucide-react";

const HapusPenjualanModal = ({ item, onClose, onConfirm }) => {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "12px",
          width: "460px",
          maxWidth: "90vw",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px 16px",
          }}
        >
          <span style={{ fontWeight: 700, fontSize: "15px", color: "#1E1F24" }}>
            Hapus Penjualan
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              color: "#6B7280",
              display: "flex",
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ height: "1px", background: "#F0F1F3" }} />

        {/* Body */}
        <div style={{ padding: "20px 24px" }}>
          <p
            style={{
              fontSize: "13px",
              color: "#4B5563",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Apakah kamu yakin akan menghapus produk{" "}
            <strong style={{ color: "#1E1F24" }}>{item?.namaProduk}</strong>?
          </p>
        </div>

        <div style={{ height: "1px", background: "#F0F1F3" }} />

        {/* Footer */}
        <div
          style={{
            padding: "16px 24px",
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "9px 20px",
              border: "1px solid #DDE1E7",
              borderRadius: "8px",
              background: "#fff",
              fontSize: "13px",
              fontWeight: 500,
              color: "#374151",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Batal
          </button>
          <button
            onClick={() => {
              onConfirm(item.id);
              onClose();
            }}
            style={{
              padding: "9px 20px",
              border: "none",
              borderRadius: "8px",
              background: "#E02424",
              fontSize: "13px",
              fontWeight: 600,
              color: "#fff",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#C81E1E")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#E02424")}
          >
            Hapus Barang
          </button>
        </div>
      </div>
    </div>
  );
};

export default HapusPenjualanModal;