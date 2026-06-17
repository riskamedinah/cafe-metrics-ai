import BaseModal from "../ui/BaseModal";

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    // Kita set lebar maksimalnya 384px (setara max-w-sm di Tailwind) agar konsisten dengan ukuran aslimu
    <BaseModal isOpen={isOpen} onClose={onClose} title="Logout" maxWidth="384px">
      {/* Body */}
      <div style={{ padding: "20px 24px" }}>
        <p style={{ fontSize: "13px", color: "#4B5563", margin: 0, lineHeight: 1.6 }}>
          Apakah kamu yakin akan <span style={{ fontWeight: 600, color: "#1E1F24" }}>Logout</span> dari sistem?
        </p>
      </div>

      {/* Garis Pembatas Bawah */}
      <div style={{ height: "1px", background: "#F0F1F3" }} />

      {/* Footer */}
      <div style={{ padding: "16px 24px", display: "flex", justifyContent: "flex-end", gap: 10 }}>
        <button onClick={onClose} style={{ padding: "9px 20px", border: "1px solid #DDE1E7", borderRadius: "8px", background: "#fff", fontSize: "13px", fontWeight: 500, color: "#374151", cursor: "pointer", fontFamily: "inherit" }}>
          Batal
        </button>
        <button
          onClick={onConfirm}
          style={{ padding: "9px 20px", border: "none", borderRadius: "8px", background: "#E02424", fontSize: "13px", fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "inherit" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#C81E1E")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#E02424")}
        >
          Logout
        </button>
      </div>
    </BaseModal>
  );
};

export default LogoutModal;