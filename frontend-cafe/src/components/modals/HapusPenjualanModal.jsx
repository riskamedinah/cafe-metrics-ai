import ConfirmModal from "../ui/ConfirmModal";

const HapusPenjualanModal = ({ isOpen, item, onClose, onConfirm }) => {
  if (!item) return null;

  const handleConfirm = () => {
    onConfirm(item.id);
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Hapus Penjualan"
      message={`Apakah kamu yakin akan menghapus produk "${item?.namaProduk}"?`}
      confirmText="Hapus Barang"
      cancelText="Batal"
      confirmVariant="danger"
      maxWidth="460px"
    />
  );
};

export default HapusPenjualanModal;