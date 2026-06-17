import React from "react";

const BaseTable = ({ columns, data, emptyMessage = "Tidak ada data ditemukan.", actionRow }) => {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        border: "1px solid #E8E9EC",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#EEF2FF" }}>
              {columns.map((col, index) => (
                <th
                  key={index}
                  style={{
                    padding: "10px 16px",
                    textAlign: col.align || "left",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#4B5563",
                    letterSpacing: "0.02em",
                    whiteSpace: "nowrap",
                    // Mengikuti lengkungan radius kotak putih luar
                    borderTopLeftRadius: index === 0 ? "12px" : "0",
                    borderTopRightRadius: (index === columns.length - 1 && !actionRow) ? "12px" : "0",
                  }}
                >
                  {col.header}
                </th>
              ))}
              {actionRow && (
                <th
                  style={{
                    padding: "10px 16px",
                    textAlign: "center",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#4B5563",
                    borderTopRightRadius: "12px",
                  }}
                >
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actionRow ? 1 : 0)}
                  style={{ textAlign: "center", color: "#9DA3AE", fontSize: "13px", padding: "32px" }}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, idx) => (
                <tr
                  key={item.id || idx}
                  style={{
                    background: "#fff",
                    borderBottom: idx === data.length - 1 ? "none" : "1px solid #F3F4F6",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#F8F9FF")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      style={{
                        padding: "13px 16px",
                        fontSize: "13px",
                        color: colIdx === 0 ? "#1E1F24" : "#374151",
                        fontWeight: 400,
                        textAlign: col.align || "left",
                      }}
                    >
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                  {actionRow && (
                    <td style={{ padding: "13px 16px" }}>
                      <div style={{ display: "flex", gap: 8, justifyContent: "center", alignItems: "center" }}>
                        {actionRow(item)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BaseTable;