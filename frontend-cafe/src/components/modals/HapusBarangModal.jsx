import ConfirmModal from "../ui/ConfirmModal";

const HapusBarangModal = ({ isOpen, onClose, onConfirm, namaBarang = "" }) => {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Hapus Barang"
      message={`Apakah kamu yakin akan menghapus produk "${namaBarang}"?`}
      confirmText="Hapus Barang"
      cancelText="Batal"
      confirmVariant="danger"
    />
  );
};

export default HapusBarangModal;