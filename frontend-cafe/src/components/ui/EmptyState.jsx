import React from "react";
import { FolderOpen } from "lucide-react";

const EmptyState = ({
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
