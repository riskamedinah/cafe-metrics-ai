import { X } from "lucide-react";

const BaseModal = ({ isOpen, onClose, title, children, maxWidth = "max-w-[460px]" }) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/45"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: maxWidth.startsWith("max-w-") ? undefined : maxWidth }}
        className={`relative flex max-h-[85vh] w-full flex-col overflow-hidden rounded-xl bg-white shadow-xl max-w-[90vw] ${
          maxWidth.startsWith("max-w-") ? maxWidth : ""
        }`}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between px-6 pt-5 pb-4">
          <span className="text-[15px] font-bold text-neutral-900">
            {title}
          </span>
          <button
            onClick={onClose}
            className="flex cursor-pointer p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Divider */}
        <div className="h-px shrink-0 bg-neutral-100" />

        {/* Content Body */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BaseModal;