import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap", // <-- Agar otomatis berpindah baris dengan rapi jika di layar HP sempit
        gap: "12px",     // <-- Memberikan jarak minimal 12px antara teks dan tombol
        padding: "16px 20px",
        background: "#ffffff",
        borderRadius: "0 0 12px 12px",
        borderTop: "1px solid #F3F4F6",
      }}
    >
      <span style={{ fontSize: "13px", color: "#6B7280" }}>
        Halaman <strong style={{ color: "#1E1F24" }}>{currentPage}</strong> dari{" "}
        <strong style={{ color: "#1E1F24" }}>{totalPages}</strong>
      </span>

      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "6px 12px",
            fontSize: "13px",
            fontWeight: 500,
            color: currentPage === 1 ? "#9CA3AF" : "#374151",
            background: "#ffffff",
            border: "1px solid #D1D5DB",
            borderRadius: "6px",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
            opacity: currentPage === 1 ? 0.5 : 1,
          }}
        >
          <ChevronLeft size={16} /> Sebelumnya
        </button>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "6px 12px",
            fontSize: "13px",
            fontWeight: 500,
            color: currentPage === totalPages ? "#9CA3AF" : "#374151",
            background: "#ffffff",
            border: "1px solid #D1D5DB",
            borderRadius: "6px",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            opacity: currentPage === totalPages ? 0.5 : 1,
          }}
        >
          Selanjutnya <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;