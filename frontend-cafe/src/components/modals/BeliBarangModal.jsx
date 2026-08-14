import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import BaseModal from "./BaseModal";
import { useToast } from "../ui/Notification";
import api from "../../lib/axios";

const formatRupiah = (n) => `Rp ${(n || 0).toLocaleString("id-ID")}`;

const BeliBarangModal = ({ isOpen, onClose, item, onSuccess }) => {
  const toast = useToast();
  const [jumlah, setJumlah] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  if (!item) return null;

  const total = (item.harga || 0) * jumlah;

  const handleClose = () => {
    setJumlah(1);
    onClose();
  };

  const ubahJumlah = (delta) => {
    setJumlah((prev) => Math.max(1, prev + delta));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await api.post("/penjualan", {
        barang_id: item.id,
        namaProduk: item.nama,
        harga: item.harga,
        jumlah,
      });

      if (res.data.status) {
        toast.success("Penjualan ditambahkan", `"${item.nama}" x${jumlah} berhasil dicatat`);
        onSuccess?.();
        handleClose();
      } else {
        toast.error("Gagal mencatat penjualan", res.data.message);
      }
    } catch (err) {
      toast.error(
        "Gagal mencatat penjualan",
        err.response?.data?.message || "Terjadi kesalahan pada server"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} title="Beli Produk" maxWidth="max-w-sm">
      <div className="px-6 pt-5 pb-1">
        {/* Item Detail */}
        <div className="flex items-start gap-3.5">
          <img
            src={item.gambar}
            alt={item.nama}
            className="h-17 w-17 shrink-0 rounded-lg border border-neutral-100 bg-neutral-50 object-cover"
          />
          <div className="min-w-0">
            <div className="text-sm font-semibold leading-tight text-neutral-900">
              {item.nama}
            </div>
            {item.kategori && (
              <div className="mt-1.5 text-xs text-neutral-400">{item.kategori}</div>
            )}
            <div className="mt-1.5 text-sm font-semibold text-primary">
              {formatRupiah(item.harga)}
            </div>
          </div>
        </div>

        {/* Counter Quantity */}
        <div className="mt-5 flex items-center justify-between">
          <span className="text-xs font-medium text-neutral-800">Jumlah</span>

          <div className="flex items-center rounded-lg border border-neutral-200">
            <button
              onClick={() => ubahJumlah(-1)}
              disabled={jumlah <= 1}
              className="flex h-8 w-8 items-center justify-center border-r border-neutral-200 text-neutral-800 disabled:cursor-not-allowed disabled:text-neutral-300"
            >
              <Minus size={14} />
            </button>
            <span className="w-10 text-center text-xs font-semibold text-neutral-900">
              {jumlah}
            </span>
            <button
              onClick={() => ubahJumlah(1)}
              className="flex h-8 w-8 items-center justify-center border-l border-neutral-200 text-neutral-800 hover:bg-neutral-50"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Total Price Box */}
        <div className="mt-4 flex items-center justify-between rounded-lg bg-neutral-50 p-3 px-3.5">
          <span className="text-xs text-neutral-400">Total</span>
          <span className="text-sm font-bold text-neutral-900">{formatRupiah(total)}</span>
        </div>
      </div>

      <div className="mt-5 h-px bg-neutral-100" />

      {/* Footer Actions */}
      <div className="flex justify-end gap-2.5 p-4 px-6">
        <button
          onClick={handleClose}
          disabled={submitting}
          className="cursor-pointer rounded-lg border border-neutral-200 bg-white px-5 py-2 text-xs font-medium text-neutral-800 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Batal
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="cursor-pointer rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70 transition-colors"
        >
          {submitting ? "Memproses..." : "Konfirmasi Pembelian"}
        </button>
      </div>
    </BaseModal>
  );
};

export default BeliBarangModal;