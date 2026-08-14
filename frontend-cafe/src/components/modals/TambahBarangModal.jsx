import React, { useState, useRef, useEffect } from "react";
import { FilePlus, X } from "lucide-react";
import BaseModal from "./BaseModal";
import SelectField from "../ui/SelectField";

const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const MAX_WIDTH = 800;

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
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error("Canvas toBlob gagal"));
            }
          },
          "image/jpeg",
          0.7
        );
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const formatRupiahInput = (val) => {
  const numberString = val.replace(/[^,\d]/g, "").toString();
  const split = numberString.split(",");
  const sisa = split[0].length % 3;
  let rupiah = split[0].substr(0, sisa);
  const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  if (ribuan) {
    const separator = sisa ? "." : "";
    rupiah += separator + ribuan.join(".");
  }

  return split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
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
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (filePreview && filePreview.startsWith("blob:")) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "harga") {
      setForm((prev) => ({ ...prev, harga: formatRupiahInput(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setForm({ nama: "", harga: "", kategori_id: "", stok: "", deskripsi: "" });
    if (filePreview && filePreview.startsWith("blob:")) {
      URL.revokeObjectURL(filePreview);
    }
    setFilePreview(null);
    setFileName("");
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const processFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Harap pilih file gambar.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 10MB sebelum dikompresi.");
      return;
    }

    setIsCompressing(true);
    try {
      const compressed = await compressImage(file);
      if (compressed.size > 2 * 1024 * 1024) {
        alert("Gambar masih terlalu besar setelah kompresi, pilih gambar lain.");
        return;
      }

      setSelectedFile(compressed);
      setFileName(compressed.name);

      const objectUrl = URL.createObjectURL(compressed);
      setFilePreview(objectUrl);
    } catch (err) {
      alert("Gagal mengompresi gambar.");
      console.error(err);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    if (filePreview && filePreview.startsWith("blob:")) {
      URL.revokeObjectURL(filePreview);
    }
    setSelectedFile(null);
    setFilePreview(null);
    setFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    if (!form.nama || !form.harga || !form.kategori_id || form.stok === "") {
      alert("Nama, Harga, Kategori, dan Stok wajib diisi.");
      return;
    }

    const cleanHarga = parseFloat(form.harga.replace(/\./g, "").replace(",", ".")) || 0;

    const formData = new FormData();
    formData.append("nama_barang", form.nama);
    formData.append("harga_barang", cleanHarga);
    formData.append("kategori_id", form.kategori_id);
    formData.append("stok_barang", parseInt(form.stok, 10) || 0);
    formData.append("deskripsi_barang", form.deskripsi || "");
    if (selectedFile) {
      formData.append("foto_barang", selectedFile);
    }

    onSave(formData);
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} title="Tambah Barang">
      <div className="p-6">
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-900 mb-1.5">Nama Barang</label>
          <input
            type="text"
            name="nama"
            value={form.nama}
            onChange={handleChange}
            placeholder="Masukkan nama barang"
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-900 mb-1.5">Harga Barang</label>
          <input
            type="text"
            name="harga"
            value={form.harga}
            onChange={handleChange}
            placeholder="Contoh: 150.000"
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div className="mb-4">
          <SelectField
            label="Kategori Barang"
            name="kategori_id"
            value={form.kategori_id}
            onChange={handleChange}
            options={kategoriList.map((kat) => ({ value: kat.id, label: kat.nama_kategori }))}
            placeholder="Pilih Kategori Barang"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-900 mb-1.5">Stok Barang</label>
          <input
            type="number"
            name="stok"
            value={form.stok}
            onChange={handleChange}
            placeholder="Masukkan jumlah stok"
            min="0"
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-900 mb-1.5">Deskripsi</label>
          <div className="relative">
            <textarea
              name="deskripsi"
              value={form.deskripsi}
              onChange={handleChange}
              placeholder="Masukkan deskripsi barang"
              rows={3}
              maxLength={200}
              className="w-full px-3.5 pt-2.5 pb-6 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 resize-y"
            />
            <span className="absolute left-3.5 bottom-2 text-[11px] text-gray-400">{form.deskripsi.length}/200</span>
          </div>
        </div>

        {/* Drag & Drop File Upload */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-gray-900 mb-1.5">Foto Barang</label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-3">
              <FilePlus size={22} className="text-white" />
            </div>
            <div className="text-sm font-semibold text-gray-900 mb-1">Klik Atau Seret Untuk Mengunggah</div>
            <div className="text-xs text-gray-400">• Maksimal 2MB setelah kompresi</div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>

          {isCompressing && <p className="mt-2 text-xs text-gray-500">Mengompresi gambar...</p>}

          {filePreview && (
            <div className="mt-4 flex items-center gap-3 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
              <img src={filePreview} alt="Preview" className="h-12 w-12 object-cover rounded-md" />
              <div className="flex-1 overflow-hidden">
                <span className="block text-xs font-medium text-gray-700 truncate">{fileName}</span>
              </div>
              <button type="button" onClick={handleRemoveFile} className="p-1 text-gray-400 hover:text-red-500">
                <X size={18} />
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isCompressing}
            className={`px-5 py-2.5 rounded-lg text-xs font-semibold text-white transition-colors ${
              isCompressing ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Tambah Barang
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default TambahBarangModal;