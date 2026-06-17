import React from "react";
import BaseModal from "../ui/BaseModal";

const HapusBarangModal = ({ isOpen, onClose, onConfirm, namaBarang = "" }) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Hapus Barang">
      <div style={{ padding: "24px" }}>
        <p
          style={{
            fontSize: 13,
            color: "#374151",
            marginBottom: 24,
          }}
        >
          Apakah kamu yakin akan menghapus produk{" "}
          <strong style={{ color: "#1E1F24" }}>{namaBarang}</strong>?
        </p>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            paddingTop: 8,
            borderTop: "1px solid #F0F1F3",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "10px 28px",
              background: "transparent",
              border: "1px solid #DDE1E7",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
              color: "#6B7280",
              cursor: "pointer",
              transition: "background 0.15s, border-color 0.15s",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#F4F5F7";
              e.currentTarget.style.borderColor = "#C5CAD4";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "#DDE1E7";
            }}
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "10px 28px",
              background: "#E11D48",
              border: "none",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              color: "#fff",
              cursor: "pointer",
              transition: "background 0.15s",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#BE123C")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#E11D48")}
          >
            Hapus Barang
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default HapusBarangModal;