import ConfirmModal from "../ui/ConfirmModal";

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Logout"
      message="Apakah kamu yakin akan logout dari sistem?"
      confirmText="Logout"
      cancelText="Batal"
      confirmVariant="danger"
      maxWidth="384px"
    />
  );
};

export default LogoutModal;