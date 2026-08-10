import React from "react";
import { FolderOpen } from "lucide-react";

const EmptyState = ({
  icon: Icon = FolderOpen,
  title = "Tidak ada data",
  description = "Belum ada data yang tersedia saat ini.",
  actionButton,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        textAlign: "center",
        background: "#ffffff",
        borderRadius: "12px",
        border: "1px dashed #E5E7EB",
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "#F3F4F6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "16px",
        }}
      >
        <Icon size={28} color="#9CA3AF" />
      </div>

      <h4 style={{ fontSize: "16px", fontWeight: 600, color: "#1E1F24", margin: "0 0 6px 0" }}>
        {title}
      </h4>

      <p style={{ fontSize: "14px", color: "#6B7280", margin: "0 0 20px 0", maxWidth: "320px" }}>
        {description}
      </p>

      {actionButton && <div>{actionButton}</div>}
    </div>
  );
};

export default EmptyState;
