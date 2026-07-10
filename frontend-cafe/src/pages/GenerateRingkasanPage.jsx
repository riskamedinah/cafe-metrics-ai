import { useState } from "react";
import { Sparkles, Package, Info, TrendingUp, Save } from "lucide-react";
import api from "../lib/axios";
import { useData } from "../context/DataContext";

const bulanSekarang = new Date().getMonth() + 1;
const tahunSekarang = new Date().getFullYear();

// Gabungkan hasil AI (ringkasan, rekomendasi, analisisTren) jadi satu teks bersih.
// Ini yang disimpan ke kolom analisis_ai — bukan JSON lagi.
const formatAnalisisAI = ({ detail, rekomendasi = [], analisisTren }) => {
  let text = (detail || "").trim();

  if (analisisTren) {
    text += `\n\n${analisisTren.trim()}`;
  }

  if (rekomendasi.length > 0) {
    text += `\n\nRekomendasi:\n`;
    text += rekomendasi.map((r, i) => `${i + 1}. ${r}`).join("\n");
  }

  return text;
};

const GenerateRingkasanPage = () => {
  const [bulan, setBulan] = useState(bulanSekarang);
  const [tahun, setTahun] = useState(tahunSekarang);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [ringkasan, setRingkasan] = useState(null); // { detail, rekomendasi, analisisTren }
  const [rawData, setRawData] = useState(null); // data statistik dari backend (untuk simpan)
  const [error, setError] = useState("");

  const { refreshRingkasan } = useData();

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      // 1. Hitung statistik bulanan
      const res = await api.post("/ringkasan/hitung", { bulan, tahun });
      if (!res.data.status) {
        setError(res.data.message || "Gagal menghitung statistik");
        setLoading(false);
        return;
      }
      const data = res.data.data;
      setRawData(data);

      // 2. Panggil Gemini untuk analisis
      const aiRes = await api.post("/generate-ai", {
        raw_data_ai: data.raw_data_ai,
      });
      if (aiRes.data.status) {
        const ai = aiRes.data.data;
        setRingkasan({
          detail: ai.ringkasan,
          rekomendasi: ai.rekomendasi,
          analisisTren: ai.analisis_tren,
        });
      } else {
        // Fallback kalau Gemini gagal
        setRingkasan({
          detail: `Total omzet bulan ini Rp ${data.total_omzet.toLocaleString('id-ID')} dengan ${data.total_item_terjual} item terjual.`,
          rekomendasi: ["Coba lagi nanti"],
          analisisTren: "Data tidak dapat dianalisis oleh AI.",
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!rawData) return;
    setSaving(true);
    try {
      // Gabungkan semua konten AI menjadi satu teks bersih (bukan JSON)
      const analisisAi = formatAnalisisAI(ringkasan);

      const res = await api.post("/ringkasan", {
        bulan: rawData.bulan,
        tahun: rawData.tahun,
        total_penjualan: rawData.total_penjualan,
        total_omzet: rawData.total_omzet,
        total_item_terjual: rawData.total_item_terjual,
        analisis_ai: analisisAi,
      });

      if (res.data.status) {
        alert("Ringkasan berhasil disimpan!");
        refreshRingkasan(); // perbarui daftar di halaman RingkasanBulanan
        // Reset form (opsional)
        setRingkasan(null);
        setRawData(null);
      } else {
        alert(res.data.message || "Gagal menyimpan ringkasan");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setRingkasan(null);
    setRawData(null);
    setError("");
  };

  return (
    <div style={{ padding: "32px", background: "#F4F5F7", minHeight: "100vh", fontFamily: "'Geist Variable', 'Inter', sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 500, color: "#1E1F24", margin: 0 }}>AI Generate Ringkasan</h2>
        <div style={{ display: "flex", gap: "12px" }}>
          <select value={bulan} onChange={(e) => setBulan(Number(e.target.value))}
            style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #DDE1E7", background: "#fff", fontSize: 14 }}>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('id-ID', { month: 'long' })}</option>
            ))}
          </select>
          <input type="number" value={tahun} onChange={(e) => setTahun(Number(e.target.value))}
            style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #DDE1E7", background: "#fff", fontSize: 14, width: 80 }} />
          <button onClick={handleGenerate} disabled={loading}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "#3B5BDB", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 15, fontWeight: 500, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.75 : 1 }}>
            {loading ? "Menghasilkan..." : <><Sparkles size={25} /> Generate</>}
          </button>
        </div>
      </div>

      {error && <div style={{ color: "red", marginBottom: 16 }}>{error}</div>}

      {ringkasan && (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Card icon={<Package size={25} color="#3B5BDB" />} title="Ringkasan" subtitle="Data periode bulan ini">
              <p style={{ fontSize: 15, color: "#4B5563", margin: 0 }}>{ringkasan.detail}</p>
            </Card>

            <Card icon={<Info size={25} color="#3B5BDB" />} title="Rekomendasi" subtitle="Insight untuk meningkatkan performa">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {ringkasan.rekomendasi.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "#F4F5F7", borderRadius: 8, padding: "12px 14px", fontSize: 15, color: "#4B5563" }}>
                    <span style={{ color: "#9DA3AE", fontSize: 14, flexShrink: 0, marginTop: 1 }}>•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card icon={<TrendingUp size={25} color="#3B5BDB" />} title="Analisis Tren" subtitle="Insight Performa Produk">
              <p style={{ fontSize: 15, color: "#4B5563", lineHeight: 1.75, margin: 0 }}>{ringkasan.analisisTren}</p>
            </Card>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button onClick={handleSave} disabled={saving}
              style={{ display: "flex", alignItems: "center", gap: 8, background: "#059669", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 15, fontWeight: 500, cursor: saving ? "not-allowed" : "pointer" }}>
              <Save size={20} /> Simpan Ringkasan
            </button>
            <button onClick={handleReset}
              style={{ padding: "10px 20px", background: "#fff", border: "1px solid #DDE1E7", borderRadius: 8, fontSize: 15, color: "black", cursor: "pointer" }}>
              Reset
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const Card = ({ icon, title, subtitle, children }) => (
  <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E8E9EC", padding: 24 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
      <div style={{ width: 44, height: 44, borderRadius: "25%", background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 18, fontWeight: 500, color: "#1E1F24" }}>{title}</div>
        <div style={{ fontSize: 15, color: "#4B5563", marginTop: 2 }}>{subtitle}</div>
      </div>
    </div>
    {children}
  </div>
);

export default GenerateRingkasanPage;