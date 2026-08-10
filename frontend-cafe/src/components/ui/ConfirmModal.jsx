import BaseModal from "./BaseModal";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Konfirmasi",
  message = "Apakah Anda yakin ingin melanjutkan?",
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  confirmVariant = "danger", // "danger" | "primary" | "warning"
  loading = false,
  maxWidth = "384px",
}) => {
  const getButtonStyles = () => {
    switch (confirmVariant) {
      case "danger":
        return {
          bg: "#E02424",
          hoverBg: "#C81E1E",
          color: "#ffffff",
        };
      case "warning":
        return {
          bg: "#C77D1E",
          hoverBg: "#a86817",
          color: "#ffffff",
        };
      case "primary":
      default:
        return {
          bg: "#3A72D4",
          hoverBg: "#3451c7",
          color: "#ffffff",
        };
    }
  };

  const btnStyle = getButtonStyles();

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title} maxWidth={maxWidth}>
      {/* Body */}
      <div style={{ padding: "20px 24px" }}>
        <p style={{ fontSize: "13px", color: "#4B5563", margin: 0, lineHeight: 1.6 }}>
          {message}
        </p>
      </div>

      {/* Garis Pembatas Bawah */}
      <div style={{ height: "1px", background: "#F0F1F3" }} />

      {/* Footer */}
      <div style={{ padding: "16px 24px", display: "flex", justifyContent: "flex-end", gap: 10 }}>
        <button
          onClick={onClose}
          disabled={loading}
          style={{
            padding: "9px 20px",
            border: "1px solid #DDE1E7",
            borderRadius: "8px",
            background: "#fff",
            fontSize: "13px",
            fontWeight: 500,
            color: "#374151",
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          style={{
            padding: "9px 20px",
            border: "none",
            borderRadius: "8px",
            background: btnStyle.bg,
            fontSize: "13px",
            fontWeight: 600,
            color: btnStyle.color,
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            opacity: loading ? 0.6 : 1,
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.background = btnStyle.hoverBg;
          }}
          onMouseLeave={(e) => {
            if (!loading) e.currentTarget.style.background = btnStyle.bg;
          }}
        >
          {loading ? "Memproses..." : confirmText}
        </button>
      </div>
    </BaseModal>
  );
};

export default ConfirmModal;
