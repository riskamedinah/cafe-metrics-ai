import React, { useState, useEffect } from "react";
import { FilePlus, ChevronDown } from "lucide-react";
import BaseModal from "../ui/BaseModal";

const EditBarangModal = ({ isOpen, onClose, onSave, data }) => {
  const [form, setForm] = useState({
    id: "",
    nama: "",
    harga: "",
    kategori: "",
    deskripsi: "",
    gambar: "",
  });

  const [filePreview, setFilePreview] = useState(null);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (data) {
      setForm({
        id: data.id,
        nama: data.nama || "",
        harga: data.harga ? data.harga.toString() : "",
        kategori: data.kategori || "",
        deskripsi: data.deskripsi || "",
        gambar: data.gambar || "",
      });
      setFilePreview(data.gambar || null);
      setFileName(data.gambar ? data.gambar.split("/").pop() : "");
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran gambar maksimal 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
        setForm((prev) => ({ ...prev, gambar: reader.result }));
      };
      reader.readAsDataURL(file);
      setFileName(file.name);
    }
  };

  const handleSubmit = () => {
    if (!form.nama || !form.harga || !form.kategori) {
      alert("Nama, Harga, dan Kategori wajib diisi.");
      return;
    }
    onSave({
      ...form,
      harga: parseFloat(form.harga.replace(/\./g, "")) || 0,
    });
  };

  const handleClose = () => {
    setForm({ id: "", nama: "", harga: "", kategori: "", deskripsi: "", gambar: "" });
    setFilePreview(null);
    setFileName("");
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} title="Edit Barang">
      <div style={{ padding: "24px" }}>
        {/* Nama Barang */}
        <div style={{ marginBottom: 18 }}>
          <label
            style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1E1F24", marginBottom: 6 }}
          >
            Nama Barang
          </label>
          <input
            type="text"
            name="nama"
            value={form.nama}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px 14px",
              border: "1px solid #DDE1E7",
              borderRadius: 8,
              fontSize: 13,
              color: "#374151",
              outline: "none",
              fontFamily: "inherit",
              transition: "border-color 0.15s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#3A72D2")}
            onBlur={(e) => (e.target.style.borderColor = "#DDE1E7")}
          />
        </div>

        {/* Harga Barang */}
        <div style={{ marginBottom: 18 }}>
          <label
            style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1E1F24", marginBottom: 6 }}
          >
            Harga Barang
          </label>
          <input
            type="text"
            name="harga"
            value={form.harga}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px 14px",
              border: "1px solid #DDE1E7",
              borderRadius: 8,
              fontSize: 13,
              color: "#374151",
              outline: "none",
              fontFamily: "inherit",
              transition: "border-color 0.15s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#3A72D2")}
            onBlur={(e) => (e.target.style.borderColor = "#DDE1E7")}
          />
        </div>

        {/* Kategori Barang */}
        <div style={{ marginBottom: 18 }}>
          <label
            style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1E1F24", marginBottom: 6 }}
          >
            Kategori Barang
          </label>
          <div style={{ position: "relative" }}>
            <select
              name="kategori"
              value={form.kategori}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px 40px 10px 14px",
                border: "1px solid #DDE1E7",
                borderRadius: 8,
                fontSize: 13,
                color: "#374151",
                outline: "none",
                fontFamily: "inherit",
                background: "#fff",
                appearance: "none",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#3A72D2")}
              onBlur={(e) => (e.target.style.borderColor = "#DDE1E7")}
            >
              <option value="">Pilih Kategori Barang</option>
              <option value="Fashion">Fashion</option>
              <option value="Elektronik">Elektronik</option>
              <option value="Makanan">Makanan</option>
              <option value="Minuman">Minuman</option>
              <option value="Lainnya">Lainnya</option>
            </select>
            <ChevronDown
              size={18}
              style={{
                position: "absolute",
                right: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#374151",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>

        {/* Deskripsi */}
        <div style={{ marginBottom: 18 }}>
          <label
            style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1E1F24", marginBottom: 6 }}
          >
            Deskripsi
          </label>
          <div style={{ position: "relative" }}>
            <textarea
              name="deskripsi"
              value={form.deskripsi}
              onChange={handleChange}
              rows={3}
              maxLength={200}
              style={{
                width: "100%",
                padding: "10px 14px 26px 14px",
                border: "1px solid #DDE1E7",
                borderRadius: 8,
                fontSize: 13,
                color: "#374151",
                outline: "none",
                fontFamily: "inherit",
                resize: "vertical",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#3A72D2")}
              onBlur={(e) => (e.target.style.borderColor = "#DDE1E7")}
            />
            <span
              style={{
                position: "absolute",
                left: 14,
                bottom: 8,
                fontSize: 11,
                color: "#9DA3AE",
                pointerEvents: "none",
              }}
            >
              {form.deskripsi.length}/200
            </span>
          </div>
        </div>

        {/* Foto Barang */}
        <div style={{ marginBottom: 24 }}>
          <label
            style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1E1F24", marginBottom: 6 }}
          >
            Foto Barang
          </label>
          <div
            style={{
              border: "1px dashed #DDE1E7",
              borderRadius: 8,
              padding: "28px 20px",
              textAlign: "center",
              cursor: "pointer",
              transition: "border-color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#3A72D2")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#DDE1E7")}
            onClick={() => document.getElementById("fileInputEdit").click()}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "#3A72D2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <FilePlus size={22} color="#fff" />
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1E1F24", marginBottom: 4 }}>
              Klik Atau Seret Untuk Mengunggah
            </div>
            <div style={{ fontSize: 12, color: "#9DA3AE" }}>
              • Maksimal gambar 2mb
            </div>
            <input
              id="fileInputEdit"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>

          {filePreview && (
            <div style={{ marginTop: 16 }}>
              <img
                src={filePreview}
                alt="Preview"
                style={{ maxHeight: 70, maxWidth: "100%", objectFit: "contain", display: "block" }}
              />
              <span style={{ display: "block", fontSize: 12, color: "#6B7280", marginTop: 8 }}>
                {fileName}
              </span>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            paddingTop: 8,
            borderTop: "1px solid #F0F1F3",
          }}
        >
          <button
            onClick={handleClose}
            style={{
              padding: "10px 24px",
              background: "transparent",
              border: "1px solid #DDE1E7",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
              color: "#6B7280",
              cursor: "pointer",
              transition: "background 0.15s, border-color 0.15s",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#F4F5F7";
              e.currentTarget.style.borderColor = "#C5CAD4";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "#DDE1E7";
            }}
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            style={{
              padding: "10px 24px",
              background: "#3A72D2",
              border: "none",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              color: "#fff",
              cursor: "pointer",
              transition: "background 0.15s",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#3569C1")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#3A72D2")}
          >
            Update Barang
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default EditBarangModal;