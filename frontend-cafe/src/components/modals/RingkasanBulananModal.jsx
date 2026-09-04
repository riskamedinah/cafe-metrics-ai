import React from "react";
import BaseModal from "./BaseModal";

const parseRingkasanAI = (text) => {
  if (!text || typeof text !== "string") {
    return { ringkasan: "", analisisTren: "", rekomendasi: [] };
  }

  const regexRekomendasi = /\n\r?\n(?:Rekomendasi|Saran):?\s*\n?/i;
  const match = text.match(regexRekomendasi);

  let mainText = text;
  let rekomendasi = [];

  if (match) {
    const markerIndex = match.index;
    mainText = text.slice(0, markerIndex).trim();
    const rekomendasiBlock = text.slice(markerIndex + match[0].length).trim();

    rekomendasi = rekomendasiBlock
      .split(/\n+/)
      .map((line) => line.replace(/^[\s\d•\-\*\.]+/g, "").trim())
      .filter(Boolean);
  }

  const parts = mainText.split(/\n\r?\n+/).map((p) => p.trim()).filter(Boolean);
  const ringkasan = parts[0] || "";
  const analisisTren = parts.slice(1).join("\n\n") || "";

  return { ringkasan, analisisTren, rekomendasi };
};

const RingkasanBulananModal = ({ isOpen, onClose, data }) => {
  if (!data) return null;

  const { ringkasan: detail, analisisTren: analisisTrend, rekomendasi } = parseRingkasanAI(data.ringkasanAI);

  const stats = [
    { label: "Bulan", value: data.bulan || "-" },
    { label: "Tahun", value: data.tahun || "-" },
    { label: "Total Penjualan", value: data.totalPenjualan ?? 0 },
    { label: "Total Pendapatan", value: `Rp ${(data.totalPendapatan || 0).toLocaleString("id-ID")}` },
  ];

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Detail Ringkasan" maxWidth="max-w-xl">
      <div className="p-6 flex flex-col gap-5">
        
        <div className="grid grid-cols-2 sm:grid-cols-4 border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
          {stats.map((cell, idx) => (
            <div key={idx} className="p-3 sm:p-4 border-r border-b border-gray-200 last:border-r-0">
              <div className="text-[11px] text-gray-400 font-medium mb-1">{cell.label}</div>
              <div className="text-sm text-gray-900 font-semibold">{cell.value}</div>
            </div>
          ))}
        </div>

        {detail && (
          <Section title="Ringkasan AI">
            <p className="text-sm text-gray-600 leading-relaxed m-0">{detail}</p>
          </Section>
        )}

        {rekomendasi.length > 0 && (
          <Section title="Rekomendasi AI">
            <div className="flex flex-col gap-2">
              {rekomendasi.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                  <span className="text-gray-400 text-sm shrink-0">•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {analisisTrend && (
          <Section title="Analisis Trend AI">
            <p className="text-sm text-gray-600 leading-relaxed m-0 whitespace-pre-line">{analisisTrend}</p>
          </Section>
        )}
      </div>
    </BaseModal>
  );
};

const Section = ({ title, children }) => (
  <div>
    <h3 className="text-sm font-bold text-gray-900 mb-2.5 mt-0">{title}</h3>
    {children}
  </div>
);

export default RingkasanBulananModal;