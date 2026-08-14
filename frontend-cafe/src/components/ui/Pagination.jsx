import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 p-4 bg-white rounded-b-xl border-t border-gray-100">
      <span className="text-xs text-gray-500">
        Halaman <strong className="font-semibold text-gray-900">{currentPage}</strong> dari{" "}
        <strong className="font-semibold text-gray-900">{totalPages}</strong>
      </span>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-white border border-gray-300 rounded-md transition-colors text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
        >
          <ChevronLeft size={16} /> Sebelumnya
        </button>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-white border border-gray-300 rounded-md transition-colors text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
        >
          Selanjutnya <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;