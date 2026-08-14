import React from "react";
import { FolderOpen } from "lucide-react";

const EmptyState = ({
  title = "Tidak ada data",
  description = "Belum ada data yang tersedia saat ini.",
  actionButton,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-dashed border-gray-200">
      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-4 text-gray-400">
        <FolderOpen size={24} />
      </div>

      <h4 className="text-base font-semibold text-gray-900 mb-1.5">
        {title}
      </h4>

      <p className="text-sm text-gray-500 mb-5 max-w-xs leading-relaxed">
        {description}
      </p>

      {actionButton && <div>{actionButton}</div>}
    </div>
  );
};

export default EmptyState;