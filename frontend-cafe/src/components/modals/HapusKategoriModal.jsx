import ConfirmModal from "../ui/ConfirmModal";

const HapusKategoriModal = ({ isOpen, item, onClose, onConfirm }) => {
  if (!item) return null;

  const handleHapus = () => {
    onConfirm(item.id);
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleHapus}
      title="Hapus Kategori"
      message={`Apakah kamu yakin akan menghapus kategori "${item.nama}"?`}
      confirmText="Hapus Kategori"
      cancelText="Batal"
      confirmVariant="danger"
      maxWidth="440px"
    />
  );
};

export default HapusKategoriModal;