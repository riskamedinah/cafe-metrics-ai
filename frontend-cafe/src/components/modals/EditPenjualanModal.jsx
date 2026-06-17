import { useState, useEffect } from "react";
import BaseModal from "../ui/BaseModal";

const EditPenjualanModal = ({ isOpen, item, onClose, onSave }) => {
  const [namaBarang, setNamaBarang] = useState("");
  const [jumlah, setJumlah] = useState("");

  // Efek untuk mengisi ulang form saat item berubah
  useEffect(() => {
    if (item) {
      setNamaBarang(item.namaProduk ?? "");
      setJumlah(item.jumlah ?? "");
    }
  }, [item]);

  const handleSave = () => {
    if (!namaBarang.trim() || !jumlah) return;
    onSave({ ...item, namaProduk: namaBarang, jumlah: Number(jumlah) });
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Edit Penjualan" maxWidth="460px">
      {/* Body */}
      <div style={{ padding: "20px 24px" }}>
        <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: 6 }}>
          Nama Barang
        </label>
        <input
          style={{ width: "100%", padding: "10px 12px", border: "1px solid #DDE1E7", borderRadius: "8px", fontSize: "13px", color: "#1E1F24", outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "#fff" }}
          placeholder="Masukkan nama barang"
          value={namaBarang}
          onChange={(e) => setNamaBarang(e.target.value)}
          onFocus={(e) => (e.target.style.borderColor = "#3B5BDB")}
          onBlur={(e) => (e.target.style.borderColor = "#DDE1E7")}
        />

        <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: 6, marginTop: 16 }}>
          Jumlah Barang
        </label>
        <input
          style={{ width: "100%", padding: "10px 12px", border: "1px solid #DDE1E7", borderRadius: "8px", fontSize: "13px", color: "#1E1F24", outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "#fff" }}
          type="number"
          min={1}
          placeholder="Masukkan jumlah barang"
          value={jumlah}
          onChange={(e) => setJumlah(e.target.value)}
          onFocus={(e) => (e.target.style.borderColor = "#3B5BDB")}
          onBlur={(e) => (e.target.style.borderColor = "#DDE1E7")}
        />
      </div>

      {/* Garis Pembatas Bawah */}
      <div style={{ height: "1px", background: "#F0F1F3" }} />

      {/* Footer */}
      <div style={{ padding: "16px 24px", display: "flex", justifyContent: "flex-end", gap: 10 }}>
        <button onClick={onClose} style={{ padding: "9px 20px", border: "1px solid #DDE1E7", borderRadius: "8px", background: "#fff", fontSize: "13px", fontWeight: 500, color: "#374151", cursor: "pointer", fontFamily: "inherit" }}>
          Batal
        </button>
        <button
          onClick={handleSave}
          style={{ padding: "9px 20px", border: "none", borderRadius: "8px", background: "#3B5BDB", fontSize: "13px", fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "inherit" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#3451C7")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#3B5BDB")}
        >
          Edit Penjualan
        </button>
      </div>
    </BaseModal>
  );
};

export default EditPenjualanModal;