import React from "react";

const BaseTable = ({ columns, data, emptyMessage = "Tidak ada data ditemukan.", actionRow }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#E4EEFF]">
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={`px-5 py-3.5 text-base font-medium text-gray-900 tracking-wide whitespace-nowrap ${
                    col.align === "center"
                      ? "text-center"
                      : col.align === "right"
                      ? "text-right"
                      : "text-left"
                  } ${index === 0 ? "rounded-tl-xl" : ""} ${
                    index === columns.length - 1 && !actionRow ? "rounded-tr-xl" : ""
                  }`}
                >
                  {col.header}
                </th>
              ))}
              {actionRow && (
                <th className="px-5 py-3.5 text-left text-sm font-semibold text-gray-900 whitespace-nowrap rounded-tr-xl border-l border-gray-200">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actionRow ? 1 : 0)}
                  className="text-center text-gray-400 text-xs p-8"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, idx) => (
                <tr
                  key={item.id || idx}
                  className="bg-white hover:bg-[#F8F9FF] transition-colors duration-100"
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className={`px-5 py-3.5 text-sm text-gray-600 font-normal ${
                        col.align === "center"
                          ? "text-center"
                          : col.align === "right"
                          ? "text-right"
                          : "text-left"
                      }`}
                    >
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                  {actionRow && (
                    <td className="px-6 py-4 border-l border-gray-200">
                      <div className="flex items-center justify-start gap-2">
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