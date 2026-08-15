import { useState } from "react";
import { Sparkles, Package, Info, TrendingUp, Save } from "lucide-react";
import api from "../lib/axios";
import SelectField from "../components/ui/SelectField";
import { useToast } from "../components/ui/Notification";
import { useData } from "../context/DataContext";

const bulanSekarang = new Date().getMonth() + 1;
const tahunSekarang = new Date().getFullYear();

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
  const toast = useToast();
  const [bulan, setBulan] = useState(bulanSekarang);
  const [tahun, setTahun] = useState(tahunSekarang);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [ringkasan, setRingkasan] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [error, setError] = useState("");

  const { refreshRingkasan } = useData();

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/ringkasan/hitung", { bulan, tahun });
      if (!res.data.status) {
        toast.error("Gagal menghitung statistik", res.data.message);
        setLoading(false);
        return;
      }
      const data = res.data.data;
      setRawData(data);

      const aiRes = await api.post("/generate-ai", { raw_data_ai: data.raw_data_ai });
      if (aiRes.data.status) {
        const ai = aiRes.data.data;
        setRingkasan({
          detail: ai.ringkasan,
          rekomendasi: ai.rekomendasi,
          analisisTren: ai.analisis_tren,
        });
      } else {
        toast.warning("AI tidak merespons", "Menampilkan ringkasan dasar dari data statistik");
        setRingkasan({
          detail: `Total omzet bulan ini Rp ${data.total_omzet.toLocaleString('id-ID')} dengan ${data.total_item_terjual} item terjual.`,
          rekomendasi: ["Coba lagi nanti"],
          analisisTren: "Data tidak dapat dianalisis oleh AI.",
        });
      }
    } catch (err) {
      toast.error("Terjadi kesalahan", err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!rawData) return;
    setSaving(true);
    try {
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
        toast.success("Ringkasan disimpan", "Data berhasil disimpan");
        refreshRingkasan();
        setRingkasan(null);
        setRawData(null);
      } else {
        toast.error("Gagal menyimpan ringkasan", res.data.message);
      }
    } catch (err) {
      toast.error("Gagal menyimpan", err.response?.data?.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setRingkasan(null);
    setRawData(null);
    setError("");
  };

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString('id-ID', { month: 'long' }),
  }));

  return (
    <div className="p-8 bg-neutral-50 min-h-screen font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-medium text-[#1E1F24]">AI Generate Ringkasan</h2>
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-45">
            <SelectField
              label=""
              name="bulan"
              value={bulan}
              onChange={(e) => setBulan(Number(e.target.value))}
              options={monthOptions}
              placeholder="Pilih Bulan"
              required
            />
          </div>
          <input
            type="number"
            value={tahun}
            onChange={(e) => setTahun(Number(e.target.value))}
            className="p-2 w-20 rounded-lg border border-[#DDE1E7] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#3A72D4]"
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 bg-[#3A72D4] hover:bg-[#2e5eb3] text-white rounded-lg px-5 py-2.5 text-base font-medium transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {loading ? (
              "Menghasilkan..."
            ) : (
              <>
                <Sparkles size={25} /> Generate
              </>
            )}
          </button>
        </div>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {ringkasan && (
        <>
          <div className="flex flex-col gap-4">
            <Card
              icon={<Package size={25} className="text-[#3A72D4]" />}
              title="Ringkasan"
              subtitle="Data periode bulan ini"
            >
              <p className="text-base text-gray-600 m-0">{ringkasan.detail}</p>
            </Card>

            <Card
              icon={<Info size={25} className="text-[#3A72D4]" />}
              title="Rekomendasi"
              subtitle="Insight untuk meningkatkan performa"
            >
              <div className="flex flex-col gap-2">
                {ringkasan.rekomendasi.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 bg-neutral-50 rounded-lg p-3 text-base text-gray-600"
                  >
                    <span className="text-gray-400 text-sm shrink-0 mt-0.5">•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card
              icon={<TrendingUp size={25} className="text-[#3A72D4]" />}
              title="Analisis Tren"
              subtitle="Insight Performa Produk"
            >
              <p className="text-base text-gray-600 leading-relaxed m-0">
                {ringkasan.analisisTren}
              </p>
            </Card>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-5 py-2.5 text-base font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-75"
            >
              <Save size={20} /> Simpan Ringkasan
            </button>
            <button
              onClick={handleReset}
              className="px-5 py-2.5 bg-white border border-[#DDE1E7] hover:bg-gray-50 rounded-lg text-base text-black transition-colors"
            >
              Reset
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const Card = ({ icon, title, subtitle, children }) => (
  <div className="bg-white rounded-xl border border-[#E8E9EC] p-6">
    <div className="flex items-center gap-3.5 mb-4">
      <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-lg font-medium text-[#1E1F24]">{title}</div>
        <div className="text-base text-gray-600 mt-0.5">{subtitle}</div>
      </div>
    </div>
    {children}
  </div>
);

export default GenerateRingkasanPage;