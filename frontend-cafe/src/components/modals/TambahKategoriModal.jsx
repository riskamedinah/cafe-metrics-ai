import React, { useState, useEffect } from "react";
import BaseModal from "./BaseModal";

const TambahKategoriModal = ({ isOpen, onClose, onSave }) => {
  const [nama, setNama] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setNama("");
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!nama.trim()) return;
    onSave(nama.trim());
    setNama("");
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Tambah Kategori" maxWidth="max-w-md">
      <div className="p-5 sm:p-6">
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          Nama Kategori
        </label>
        <input
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-xs text-gray-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
          placeholder="Masukkan nama kategori"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      </div>

      <div className="h-px bg-gray-100" />

      <div className="p-4 sm:px-6 flex justify-end gap-2.5">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2 border border-gray-300 rounded-lg bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-2 border-none rounded-lg bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Tambah Kategori
        </button>
      </div>
    </BaseModal>
  );
};

export default TambahKategoriModal;