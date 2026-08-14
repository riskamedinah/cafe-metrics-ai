import { useState, useEffect, useRef } from "react";
import { FilePlus } from "lucide-react";
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

const EditBarangModal = ({ isOpen, onClose, onSave, data, kategoriList = [] }) => {
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    id: "",
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

  useEffect(() => {
    if (isOpen && data) {
      setForm({
        id: data.id || "",
        nama: data.nama || "",
        harga: data.harga ? data.harga.toString() : "",
        kategori_id: data.kategori_id || "",
        stok: data.stok != null ? data.stok.toString() : "",
        deskripsi: data.deskripsi || "",
      });
      setFilePreview(data.gambar || null);
      setFileName(data.gambar ? data.gambar.split("/").pop() : "");
      setSelectedFile(null);
    }
  }, [data, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const processFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Harap pilih file gambar yang valid.");
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  // Drag & Drop Handlers
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

  const handleSubmit = () => {
    if (!form.nama || !form.harga || !form.kategori_id || form.stok === "") {
      alert("Nama, Harga, Kategori, dan Stok wajib diisi.");
      return;
    }

    const formData = new FormData();
    formData.append("nama_barang", form.nama);
    formData.append("harga_barang", parseFloat(form.harga.replace(/[^\d.-]/g, "")) || 0);
    formData.append("kategori_id", form.kategori_id);
    formData.append("stok_barang", parseInt(form.stok, 10) || 0);
    formData.append("deskripsi_barang", form.deskripsi || "");
    if (selectedFile) {
      formData.append("foto_barang", selectedFile);
    }
    formData.append("_method", "PUT");

    onSave({ id: form.id, formData });
  };

  const handleClose = () => {
    setForm({ id: "", nama: "", harga: "", kategori_id: "", stok: "", deskripsi: "" });
    setFilePreview(null);
    setFileName("");
    setSelectedFile(null);
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} title="Edit Barang">
      <div className="p-6">
        {/* Input Nama */}
        <div className="mb-4.5">
          <label className="mb-1.5 block text-xs font-semibold text-neutral-900">
            Nama Barang
          </label>
          <input
            type="text"
            name="nama"
            value={form.nama}
            onChange={handleChange}
            className="w-full rounded-lg border border-neutral-200 px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:border-primary"
          />
        </div>

        {/* Input Harga */}
        <div className="mb-4.5">
          <label className="mb-1.5 block text-xs font-semibold text-neutral-900">
            Harga Barang
          </label>
          <input
            type="text"
            name="harga"
            value={form.harga}
            onChange={handleChange}
            className="w-full rounded-lg border border-neutral-200 px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:border-primary"
          />
        </div>

        {/* Select Kategori */}
        <div className="mb-4.5">
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

        {/* Input Stok */}
        <div className="mb-4.5">
          <label className="mb-1.5 block text-xs font-semibold text-neutral-900">
            Stok Barang
          </label>
          <input
            type="number"
            name="stok"
            value={form.stok}
            onChange={handleChange}
            placeholder="Masukkan jumlah stok"
            min="0"
            className="w-full rounded-lg border border-neutral-200 px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:border-primary"
          />
        </div>

        {/* Textarea Deskripsi */}
        <div className="mb-4.5">
          <label className="mb-1.5 block text-xs font-semibold text-neutral-900">
            Deskripsi
          </label>
          <div className="relative">
            <textarea
              name="deskripsi"
              value={form.deskripsi}
              onChange={handleChange}
              rows={3}
              maxLength={200}
              className="w-full rounded-lg border border-neutral-200 px-3.5 pt-2.5 pb-6 text-xs text-neutral-900 outline-none focus:border-primary"
            />
            <span className="absolute left-3.5 bottom-2 text-[11px] text-neutral-400">
              {form.deskripsi.length}/200
            </span>
          </div>
        </div>

        {/* Upload Foto dengan Drag & Drop */}
        <div className="mb-6">
          <label className="mb-1.5 block text-xs font-semibold text-neutral-900">
            Foto Barang
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`cursor-pointer rounded-lg border border-dashed px-5 py-7 text-center transition-colors ${
              isDragging ? "border-primary bg-primary/5" : "border-neutral-200 hover:border-primary"
            }`}
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
              <FilePlus size={22} />
            </div>
            <div className="mb-1 text-sm font-semibold text-neutral-900">
              Klik Atau Seret Untuk Mengunggah
            </div>
            <div className="text-xs text-neutral-400">
              • Maksimal 2MB setelah kompresi
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {isCompressing && (
            <p className="mt-2 text-xs text-neutral-500">Mengompresi gambar...</p>
          )}

          {filePreview && (
            <div className="mt-4">
              <img
                src={filePreview}
                alt="Preview"
                className="max-h-24 max-w-full object-contain rounded-md border border-neutral-100"
              />
              <span className="mt-2 block text-xs text-neutral-500">{fileName}</span>
            </div>
          )}
        </div>


        <div className="mt-6 flex justify-end gap-3 border-t border-neutral-100 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="cursor-pointer rounded-lg border border-neutral-200 bg-white px-6 py-2.5 text-xs font-medium text-neutral-800 hover:bg-neutral-50"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={isCompressing}
            onClick={handleSubmit}
            className="cursor-pointer rounded-lg bg-primary px-6 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
          >
            Update Barang
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default EditBarangModal;