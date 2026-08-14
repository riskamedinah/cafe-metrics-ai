import { useState, useEffect } from "react";
import BaseModal from "./BaseModal";

const EditPenjualanModal = ({ isOpen, item, onClose, onSave }) => {
  const [namaBarang, setNamaBarang] = useState("");
  const [jumlah, setJumlah] = useState("");

  useEffect(() => {
    if (isOpen && item) {
      setNamaBarang(item.namaProduk ?? "");
      setJumlah(item.jumlah ?? "");
    }
  }, [item, isOpen]);

  const handleSave = () => {
    if (!namaBarang.trim() || !jumlah) return;
    onSave({ ...item, namaProduk: namaBarang, jumlah: Number(jumlah) });
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Edit Penjualan" maxWidth="max-w-md">
      <div className="p-5 px-6">
        <label className="mb-1.5 block text-xs font-medium text-neutral-800">
          Nama Barang
        </label>
        <input
          type="text"
          placeholder="Masukkan nama barang"
          value={namaBarang}
          onChange={(e) => setNamaBarang(e.target.value)}
          className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-xs text-neutral-900 outline-none focus:border-primary"
        />

        <label className="mt-4 mb-1.5 block text-xs font-medium text-neutral-800">
          Jumlah Barang
        </label>
        <input
          type="number"
          min={1}
          placeholder="Masukkan jumlah barang"
          value={jumlah}
          onChange={(e) => setJumlah(e.target.value)}
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
          Edit Penjualan
        </button>
      </div>
    </BaseModal>
  );
};

export default EditPenjualanModal;