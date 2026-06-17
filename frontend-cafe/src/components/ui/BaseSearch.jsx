import React from "react";
import { Search } from "lucide-react";

const BaseSearch = ({ value, onChange, placeholder = "Cari...", ...props }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "#fff",
        border: "1px solid #DDE1E7",
        borderRadius: "8px",
        padding: "10px 14px",
        maxWidth: 340,
        marginBottom: 24,
        fontFamily: "'Geist Variable', 'Inter', sans-serif",
      }}
    >
      <Search size={16} color="#9DA3AE" strokeWidth={2} />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
        style={{
          border: "none",
          outline: "none",
          fontSize: "13px",
          color: "#374151",
          background: "transparent",
          width: "100%",
          fontFamily: "inherit",
        }}
      />
    </div>
  );
};

export default BaseSearch;