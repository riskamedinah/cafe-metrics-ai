import { useState, useEffect } from "react";
import BaseModal from "../ui/BaseModal";

const EditKategoriModal = ({ isOpen, item, onClose, onSave }) => {
  const [nama, setNama] = useState("");

  // Isi ulang form saat item berubah
  useEffect(() => {
    if (item) {
      setNama(item.nama || "");
    }
  }, [item]);

  const handleSave = () => {
    if (!nama.trim()) return;
    onSave({ ...item, nama: nama.trim() });
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Edit Kategori" maxWidth="460px">
      <div style={{ padding: "20px 24px" }}>
        <label
          style={{
            display: "block",
            fontSize: "13px",
            fontWeight: 500,
            color: "#374151",
            marginBottom: 6,
          }}
        >
          Nama Kategori
        </label>
        <input
          style={{
            width: "100%",
            padding: "10px 12px",
            border: "1px solid #DDE1E7",
            borderRadius: "8px",
            fontSize: "13px",
            color: "#1E1F24",
            outline: "none",
            boxSizing: "border-box",
            fontFamily: "inherit",
            background: "#fff",
          }}
          placeholder="Masukkan nama kategori"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          onFocus={(e) => (e.target.style.borderColor = "#3B5BDB")}
          onBlur={(e) => (e.target.style.borderColor = "#DDE1E7")}
        />
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
          onClick={handleSave}
          style={{
            padding: "9px 20px",
            border: "none",
            borderRadius: "8px",
            background: "#3B5BDB",
            fontSize: "13px",
            fontWeight: 600,
            color: "#fff",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#3451C7")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#3B5BDB")}
        >
          Edit Kategori
        </button>
      </div>
    </BaseModal>
  );
};

export default EditKategoriModal;