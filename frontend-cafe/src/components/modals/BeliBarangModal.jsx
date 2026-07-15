import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import BaseModal from "../ui/BaseModal";
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
      // Sesuaikan field ini dengan kontrak backend /api/penjualan kamu
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
      toast.error("Gagal mencatat penjualan", err.response?.data?.message || "Terjadi kesalahan pada server");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} title="Beli Produk" maxWidth="420px">
      <div style={{ padding: "20px 24px 4px" }}>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <img
            src={item.gambar}
            alt={item.nama}
            style={{
              width: 68,
              height: 68,
              borderRadius: 10,
              objectFit: "cover",
              border: "1px solid #EAECF0",
              flexShrink: 0,
              background: "#F4F5F7",
            }}
          />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1E1F24", lineHeight: 1.3 }}>
              {item.nama}
            </div>
            {item.kategori ? (
              <span
                style={{
                  display: "inline-block",
                  marginTop: 4,
                  padding: "2px 8px",
                  borderRadius: 999,
                  background: "#F4F5F7",
                  color: "#5F637B",
                  fontSize: 11,
                  fontWeight: 500,
                }}
              >
                {item.kategori}
              </span>
            ) : null}
            <div style={{ marginTop: 6, fontSize: 14, fontWeight: 600, color: "var(--color-primary)" }}>
              {formatRupiah(item.harga)}
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>Jumlah</span>

          <div style={{ display: "flex", alignItems: "center", gap: 0, border: "1px solid #DDE1E7", borderRadius: 8 }}>
            <button
              onClick={() => ubahJumlah(-1)}
              disabled={jumlah <= 1}
              style={{
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "none",
                border: "none",
                borderRight: "1px solid #DDE1E7",
                cursor: jumlah <= 1 ? "not-allowed" : "pointer",
                color: jumlah <= 1 ? "#CACCD7" : "#374151",
              }}
            >
              <Minus size={14} />
            </button>
            <span style={{ width: 40, textAlign: "center", fontSize: 13, fontWeight: 600, color: "#1E1F24" }}>
              {jumlah}
            </span>
            <button
              onClick={() => ubahJumlah(1)}
              style={{
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "none",
                border: "none",
                borderLeft: "1px solid #DDE1E7",
                cursor: "pointer",
                color: "#374151",
              }}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        <div
          style={{
            marginTop: 16,
            padding: "12px 14px",
            background: "#F4F5F7",
            borderRadius: 8,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 13, color: "#5F637B" }}>Total</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#1E1F24" }}>{formatRupiah(total)}</span>
        </div>
      </div>

      <div style={{ height: "1px", background: "#F0F1F3", marginTop: 20 }} />

      <div style={{ padding: "16px 24px", display: "flex", justifyContent: "flex-end", gap: 10 }}>
        <button
          onClick={handleClose}
          disabled={submitting}
          style={{
            padding: "9px 20px",
            border: "1px solid #DDE1E7",
            borderRadius: 8,
            background: "#fff",
            fontSize: 13,
            fontWeight: 500,
            color: "#374151",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Batal
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            padding: "9px 20px",
            border: "none",
            borderRadius: 8,
            background: "var(--color-primary)",
            fontSize: 13,
            fontWeight: 600,
            color: "#fff",
            cursor: submitting ? "not-allowed" : "pointer",
            opacity: submitting ? 0.7 : 1,
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => {
            if (!submitting) e.currentTarget.style.background = "var(--color-primary-hover)";
          }}
          onMouseLeave={(e) => {
            if (!submitting) e.currentTarget.style.background = "var(--color-primary)";
          }}
        >
          {submitting ? "Memproses..." : "Konfirmasi Pembelian"}
        </button>
      </div>
    </BaseModal>
  );
};

export default BeliBarangModal;