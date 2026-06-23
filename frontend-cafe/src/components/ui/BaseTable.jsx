import React from "react";

const BaseTable = ({ columns, data, emptyMessage = "Tidak ada data ditemukan.", actionRow }) => {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#E4EEFF" }}>
              {columns.map((col, index) => (
                <th
                  key={index}
                  style={{
                    padding: "14px 20px",
                    textAlign: col.align || "left",
                    fontSize: "15px",
                    fontWeight: 500,
                    color: "#1E1F24",
                    letterSpacing: "0.02em",
                    whiteSpace: "nowrap",
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
                    padding: "14px 20px",
                    textAlign: "left",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#1E1F24",
                    whiteSpace: "nowrap",
                    borderTopRightRadius: "12px",
                    borderLeft: "1px solid #EEEEEE",
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
                        padding: "14px 20px",
                        fontSize: "14px",
                        color: "#5E5E5E",
                        fontWeight: 400,
                        textAlign: col.align || "left",
                      }}
                    >
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                  {actionRow && (
                    <td
                      style={{
                        padding: "16px 24px",
                        borderLeft: "1px solid #EEEEEE",
                      }}
                    >
                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-start", alignItems: "center" }}>
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