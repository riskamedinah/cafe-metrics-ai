import { useState, useEffect } from "react";
import BaseModal from "./BaseModal";

const EditKategoriModal = ({ isOpen, item, onClose, onSave }) => {
  const [nama, setNama] = useState("");

  useEffect(() => {
    if (isOpen && item) {
      setNama(item.nama || "");
    }
  }, [item, isOpen]);

  const handleSave = () => {
    if (!nama.trim()) return;
    onSave({ ...item, nama: nama.trim() });
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Edit Kategori" maxWidth="max-w-md">
      <div className="p-5 px-6">
        <label className="mb-1.5 block text-xs font-medium text-neutral-800">
          Nama Kategori
        </label>
        <input
          type="text"
          placeholder="Masukkan nama kategori"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-xs text-neutral-900 outline-none focus:border-primary"
        />
      </div>

      <div className="h-px bg-neutral-100" />

      <div className="flex justify-end gap-2.5 p-4 px-6">
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer rounded-lg border border-neutral-200 bg-white px-5 py-2.25 text-xs font-medium text-neutral-800 hover:bg-neutral-50"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="cursor-pointer rounded-lg bg-primary px-5 py-2.25 text-xs font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          Edit Kategori
        </button>
      </div>
    </BaseModal>
  );
};

export default EditKategoriModal;