import { X } from "lucide-react";

const BaseModal = ({ isOpen, onClose, title, children, maxWidth = "460px" }) => {
  if (!isOpen) return null;

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
        padding: "24px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "12px",
          width: maxWidth,
          maxWidth: "90vw",
          maxHeight: "85vh",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          display: "flex",
          flexDirection: "column",
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
            flexShrink: 0,
          }}
        >
          <span style={{ fontWeight: 700, fontSize: "15px", color: "#1E1F24" }}>
            {title}
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

        {/* Garis Pembatas Atas */}
        <div style={{ height: "1px", background: "#F0F1F3", flexShrink: 0 }} />

        {/* Konten dinamis — area ini yang scroll kalau kepanjangan */}
        <div style={{ overflowY: "auto", flex: "1 1 auto", minHeight: 0 }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default BaseModal;