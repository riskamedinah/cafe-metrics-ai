import BaseModal from "./BaseModal";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Konfirmasi",
  message = "Apakah Anda yakin ingin melanjutkan?",
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  confirmVariant = "danger",
  loading = false,
  maxWidth = "max-w-xs",
}) => {
  const getButtonVariantClass = () => {
    switch (confirmVariant) {
      case "danger":
        return "bg-danger hover:bg-neutral-800 text-white";
      case "warning":
        return "bg-warning text-white";
      case "primary":
      default:
        return "bg-primary hover:bg-primary-hover text-white";
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title} maxWidth={maxWidth}>
      <div className="p-5 px-6">
        <p className="m-0 text-xs leading-relaxed text-neutral-800">
          {message}
        </p>
      </div>

      <div className="h-px bg-neutral-100" />

      <div className="flex justify-end gap-2.5 p-4 px-6">
        <button
          onClick={onClose}
          disabled={loading}
          className="cursor-pointer rounded-lg border border-neutral-200 bg-white px-5 py-2 text-xs font-medium text-neutral-800 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={`cursor-pointer rounded-lg px-5 py-2 text-xs font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60 ${getButtonVariantClass()}`}
        >
          {loading ? "Memproses..." : confirmText}
        </button>
      </div>
    </BaseModal>
  );
};

export default ConfirmModal;