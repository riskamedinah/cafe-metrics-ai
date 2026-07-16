import { useState, useEffect } from "react";
import BaseModal from "../ui/BaseModal";
import api from "../../lib/axios";

const TambahPenjualanModal = ({ isOpen, onClose, onSave }) => {
  const [barangList, setBarangList] = useState([]);
  const [selectedBarang, setSelectedBarang] = useState("");
  const [jumlah, setJumlah] = useState("1");
  const [hargaSatuan, setHargaSatuan] = useState(0);

  // Ambil daftar barang
  useEffect(() => {
    if (isOpen) {
      api.get("/barang").then((res) => {
        if (res.data.status) {
          setBarangList(res.data.data);
        }
      });
    }
  }, [isOpen]);

  // Update harga satuan saat barang dipilih
  useEffect(() => {
    if (selectedBarang) {
      const barang = barangList.find((b) => b.id == selectedBarang);
      setHargaSatuan(barang?.harga_barang || 0);
    } else {
      setHargaSatuan(0);
    }
  }, [selectedBarang, barangList]);

  const totalHarga = hargaSatuan * (parseInt(jumlah) || 0);

  const handleSubmit = () => {
    if (!selectedBarang || !jumlah || parseInt(jumlah) < 1) {
      alert("Pilih barang dan jumlah minimal 1.");
      return;
    }
    onSave({
      barang_id: selectedBarang,
      jumlah: parseInt(jumlah),
    });
    // Reset form
    setSelectedBarang("");
    setJumlah("1");
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Tambah Penjualan" maxWidth="500px">
      <div style={{ padding: "20px 24px" }}>
        <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Pilih Barang</label>
        <select
          value={selectedBarang}
          onChange={(e) => setSelectedBarang(e.target.value)}
          style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #DDE1E7", marginBottom: 16 }}
        >
          <option value="">-- Pilih Barang --</option>
          {barangList.map((b) => (
            <option key={b.id} value={b.id}>
              {b.nama_barang} (Stok: {b.stok_barang})
            </option>
          ))}
        </select>

        <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Jumlah</label>
        <input
          type="number"
          min="1"
          value={jumlah}
          onChange={(e) => setJumlah(e.target.value)}
          style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #DDE1E7", marginBottom: 16 }}
        />

        <div style={{ fontSize: 14, color: "#374151", marginBottom: 8 }}>
          Harga Satuan: Rp {hargaSatuan.toLocaleString("id-ID")}
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#1E1F24" }}>
          Total: Rp {totalHarga.toLocaleString("id-ID")}
        </div>
      </div>

      <div style={{ height: "1px", background: "#F0F1F3" }} />
      <div style={{ padding: "16px 24px", display: "flex", justifyContent: "flex-end", gap: 10 }}>
        <button onClick={onClose} style={{ padding: "9px 20px", background: "#fff", border: "1px solid #DDE1E7", borderRadius: 8 }}>Batal</button>
        <button onClick={handleSubmit} style={{ padding: "9px 20px", background: "#3A72D4", color: "#fff", border: "none", borderRadius: 8 }}>Simpan</button>
      </div>
    </BaseModal>
  );
};

export default TambahPenjualanModal;