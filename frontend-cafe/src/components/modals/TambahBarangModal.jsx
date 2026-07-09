import React, { useState } from "react";
import { FilePlus, ChevronDown } from "lucide-react";
import BaseModal from "../ui/BaseModal";

// 🔹 Fungsi kompresi gambar
const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const MAX_WIDTH = 800; // lebar maksimal

        if (width > MAX_WIDTH) {
          height = (height * MAX_WIDTH) / width;
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error("Canvas toBlob gagal"));
            }
          },
          "image/jpeg",
          0.7 // kualitas kompresi 70%
        );
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const TambahBarangModal = ({ isOpen, onClose, onSave, kategoriList = [] }) => {
  const [form, setForm] = useState({
    nama: "",
    harga: "",
    kategori_id: "",
    stok: "",
    deskripsi: "",
  });

  const [filePreview, setFilePreview] = useState(null);
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 10MB sebelum dikompresi.");
      return;
    }

    setIsCompressing(true);
    try {
      const compressed = await compressImage(file);
      // Batasi tetap 2MB setelah kompresi
      if (compressed.size > 2 * 1024 * 1024) {
        alert("Gambar masih terlalu besar setelah kompresi, pilih gambar lain.");
        setIsCompressing(false);
        return;
      }

      setSelectedFile(compressed);
      setFileName(compressed.name);

      // Preview dari hasil kompresi
      const previewReader = new FileReader();
      previewReader.onloadend = () => setFilePreview(previewReader.result);
      previewReader.readAsDataURL(compressed);
    } catch (err) {
      alert("Gagal mengompresi gambar.");
      console.error(err);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSubmit = () => {
    if (!form.nama || !form.harga || !form.kategori_id || form.stok === "") {
      alert("Nama, Harga, Kategori, dan Stok wajib diisi.");
      return;
    }

    const formData = new FormData();
    formData.append("nama_barang", form.nama);
    formData.append("harga_barang", parseFloat(form.harga.replace(/\./g, "")) || 0);
    formData.append("kategori_id", form.kategori_id);
    formData.append("stok_barang", parseInt(form.stok, 10) || 0);
    formData.append("deskripsi_barang", form.deskripsi || "");
    if (selectedFile) {
      formData.append("foto_barang", selectedFile);
    }

    onSave(formData);

    // Reset
    setForm({ nama: "", harga: "", kategori_id: "", stok: "", deskripsi: "" });
    setFilePreview(null);
    setFileName("");
    setSelectedFile(null);
  };

  const handleClose = () => {
    setForm({ nama: "", harga: "", kategori_id: "", stok: "", deskripsi: "" });
    setFilePreview(null);
    setFileName("");
    setSelectedFile(null);
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} title="Tambah Barang">
      <div style={{ padding: "24px" }}>
        {/* Nama */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1E1F24", marginBottom: 6 }}>Nama Barang</label>
          <input type="text" name="nama" value={form.nama} onChange={handleChange} placeholder="Masukkan nama barang" style={{ width: "100%", padding: "10px 14px", border: "1px solid #DDE1E7", borderRadius: 8, fontSize: 13, color: "#374151", outline: "none", fontFamily: "inherit" }} />
        </div>

        {/* Harga */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1E1F24", marginBottom: 6 }}>Harga Barang</label>
          <input type="text" name="harga" value={form.harga} onChange={handleChange} placeholder="Masukkan harga barang" style={{ width: "100%", padding: "10px 14px", border: "1px solid #DDE1E7", borderRadius: 8, fontSize: 13, color: "#374151", outline: "none", fontFamily: "inherit" }} />
        </div>

        {/* Kategori */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1E1F24", marginBottom: 6 }}>Kategori Barang</label>
          <div style={{ position: "relative" }}>
            <select name="kategori_id" value={form.kategori_id} onChange={handleChange} style={{ width: "100%", padding: "10px 40px 10px 14px", border: "1px solid #DDE1E7", borderRadius: 8, fontSize: 13, color: "#374151", outline: "none", fontFamily: "inherit", background: "#fff", appearance: "none" }}>
              <option value="">Pilih Kategori Barang</option>
              {kategoriList.map((kat) => (<option key={kat.id} value={kat.id}>{kat.nama_kategori}</option>))}
            </select>
            <ChevronDown size={18} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "#374151", pointerEvents: "none" }} />
          </div>
        </div>

        {/* Stok */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1E1F24", marginBottom: 6 }}>Stok Barang</label>
          <input type="number" name="stok" value={form.stok} onChange={handleChange} placeholder="Masukkan jumlah stok" min="0" style={{ width: "100%", padding: "10px 14px", border: "1px solid #DDE1E7", borderRadius: 8, fontSize: 13, color: "#374151", outline: "none", fontFamily: "inherit" }} />
        </div>

        {/* Deskripsi */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1E1F24", marginBottom: 6 }}>Deskripsi</label>
          <div style={{ position: "relative" }}>
            <textarea name="deskripsi" value={form.deskripsi} onChange={handleChange} placeholder="Masukkan deskripsi barang" rows={3} maxLength={200} style={{ width: "100%", padding: "10px 14px 26px 14px", border: "1px solid #DDE1E7", borderRadius: 8, fontSize: 13, color: "#374151", outline: "none", fontFamily: "inherit", resize: "vertical" }} />
            <span style={{ position: "absolute", left: 14, bottom: 8, fontSize: 11, color: "#9DA3AE" }}>{form.deskripsi.length}/200</span>
          </div>
        </div>

        {/* Upload Foto + Kompresi */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1E1F24", marginBottom: 6 }}>Foto Barang</label>
          <div
            style={{ border: "1px dashed #DDE1E7", borderRadius: 8, padding: "28px 20px", textAlign: "center", cursor: "pointer", transition: "border-color 0.15s" }}
            onClick={() => document.getElementById("fileInputTambah").click()}
          >
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#3A72D2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <FilePlus size={22} color="#fff" />
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1E1F24", marginBottom: 4 }}>Klik Atau Seret Untuk Mengunggah</div>
            <div style={{ fontSize: 12, color: "#9DA3AE" }}>• Maksimal 2MB setelah kompresi</div>
            <input id="fileInputTambah" type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
          </div>

          {isCompressing && <p style={{ marginTop: 8, fontSize: 12, color: "#6B7280" }}>Mengompresi gambar...</p>}

          {filePreview && (
            <div style={{ marginTop: 16 }}>
              <img src={filePreview} alt="Preview" style={{ maxHeight: 70, maxWidth: "100%", objectFit: "contain", display: "block" }} />
              <span style={{ display: "block", fontSize: 12, color: "#6B7280", marginTop: 8 }}>{fileName}</span>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, paddingTop: 8, borderTop: "1px solid #F0F1F3", marginTop: 24 }}>
          <button onClick={handleClose} style={{ padding: "10px 24px", background: "transparent", border: "1px solid #DDE1E7", borderRadius: 8, fontSize: 13, fontWeight: 500, color: "#6B7280", cursor: "pointer" }}>Batal</button>
          <button onClick={handleSubmit} style={{ padding: "10px 24px", background: "#3A72D2", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer" }}>Tambah Barang</button>
        </div>
      </div>
    </BaseModal>
  );
};

export default TambahBarangModal;