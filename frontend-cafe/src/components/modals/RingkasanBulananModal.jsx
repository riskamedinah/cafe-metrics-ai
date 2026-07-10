import BaseModal from "../ui/BaseModal";

// Reverse dari formatAnalisisAI (di GenerateRingkasanPage) —
// pecah teks bersih jadi { ringkasan, analisisTren, rekomendasi }
const parseRingkasanAI = (text) => {
  if (!text) return { ringkasan: "", analisisTren: "", rekomendasi: [] };

  const REKOMENDASI_MARKER = "\n\nRekomendasi:\n";
  const markerIndex = text.indexOf(REKOMENDASI_MARKER);

  let mainText = text;
  let rekomendasi = [];

  if (markerIndex !== -1) {
    mainText = text.slice(0, markerIndex).trim();
    const rekomendasiBlock = text.slice(markerIndex + REKOMENDASI_MARKER.length).trim();
    rekomendasi = rekomendasiBlock
      .split("\n")
      .map((line) => line.replace(/^\d+\.\s*/, "").trim())
      .filter(Boolean);
  }

  // mainText berisi ringkasan (+ opsional analisis tren dipisah baris kosong)
  const parts = mainText.split("\n\n").map((p) => p.trim()).filter(Boolean);
  const ringkasan = parts[0] || "";
  const analisisTren = parts.slice(1).join("\n\n") || "";

  return { ringkasan, analisisTren, rekomendasi };
};

const RingkasanBulananModal = ({ isOpen, onClose, data }) => {
  if (!data) return null;

  const { ringkasan: detail, analisisTren: analisisTrend, rekomendasi } = parseRingkasanAI(data.ringkasanAI);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Detail Ringkasan" maxWidth="640px">
      <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Info Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", border: "1px solid #E8E9EC", borderRadius: 10, overflow: "hidden" }}>
          {[
            { label: "Bulan", value: data.bulan },
            { label: "Tahun", value: data.tahun },
            { label: "Total Penjualan", value: data.totalPenjualan },
            { label: "Total Pendapatan", value: `Rp ${(data.totalPendapatan || 0).toLocaleString("id-ID")}` },
          ].map((cell, idx, arr) => (
            <div key={idx} style={{ padding: "12px 16px", background: "#F4F5F7", borderRight: idx < arr.length - 1 ? "1px solid #E8E9EC" : "none" }}>
              <div style={{ fontSize: 11, color: "#9DA3AE", fontWeight: 500, marginBottom: 4 }}>{cell.label}</div>
              <div style={{ fontSize: 14, color: "#1E1F24", fontWeight: 600 }}>{cell.value}</div>
            </div>
          ))}
        </div>

        {/* Ringkasan AI */}
        <Section title="Ringkasan AI">
          <p style={{ fontSize: 13, color: "#4B5563", lineHeight: 1.7 }}>{detail}</p>
        </Section>

        {/* Rekomendasi */}
        {rekomendasi.length > 0 && (
          <Section title="Rekomendasi AI">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {rekomendasi.map((item, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "#F4F5F7", borderRadius: 8, padding: "12px 14px", fontSize: 13, color: "#4B5563" }}>
                  <span style={{ color: "#9DA3AE", fontSize: 14, flexShrink: 0 }}>•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Analisis Trend */}
        {analisisTrend && (
          <Section title="Analisis Trend AI">
            <p style={{ fontSize: 13, color: "#4B5563", lineHeight: 1.7 }}>{analisisTrend}</p>
          </Section>
        )}
      </div>
    </BaseModal>
  );
};

const Section = ({ title, children }) => (
  <div>
    <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1E1F24", marginBottom: 10 }}>{title}</h3>
    {children}
  </div>
);

export default RingkasanBulananModal;