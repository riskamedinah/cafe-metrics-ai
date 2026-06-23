import BaseModal from "../ui/BaseModal";

const HapusKategoriModal = ({ isOpen, item, onClose, onConfirm }) => {
  if (!item) return null;

  const handleHapus = () => {
    onConfirm(item.id);
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Hapus Kategori" maxWidth="440px">
      <div style={{ padding: "24px 24px 20px" }}>
        <p style={{ fontSize: "14px", color: "#374151", margin: 0 }}>
          Apakah kamu yakin akan menghapus kategori{" "}
          <strong style={{ color: "#1E1F24" }}>{item.nama}</strong>?
        </p>
      </div>

      <div style={{ height: "1px", background: "#F0F1F3" }} />

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
          onClick={handleHapus}
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
          onMouseEnter={(e) => (e.currentTarget.style.background = "#C01E1E")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#E02424")}
        >
          Hapus Kategori
        </button>
      </div>
    </BaseModal>
  );
};

export default HapusKategoriModal;