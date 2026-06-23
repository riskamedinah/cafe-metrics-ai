import BaseModal from "../ui/BaseModal";

const RingkasanBulananModal = ({ isOpen, onClose, data }) => {
  if (!data) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Detail Barang"
      maxWidth="640px"
    >
      {/* HANYA di sini perbaikannya: hilangkan maxHeight & overflowY */}
      <div
        style={{
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          // maxHeight & overflowY dihapus
        }}
      >
        {/* Info Grid — warna tidak diubah */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            border: "1px solid #E8E9EC",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          {[
            { label: "Bulan", value: data.bulan },
            { label: "Tahun", value: data.tahun },
            { label: "Total Penjualan", value: data.totalPenjualan },
            {
              label: "Total Pendapatan",
              value: `Rp ${data.totalPendapatan.toLocaleString("id-ID")}`,
            },
          ].map((cell, idx, arr) => (
            <div
              key={idx}
              style={{
                padding: "12px 16px",
                background: "#F4F5F7", // tetap seperti semula
                borderRight: idx < arr.length - 1 ? "1px solid #E8E9EC" : "none",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: "#9DA3AE", // tetap abu-abu
                  fontWeight: 500,
                  marginBottom: "4px",
                }}
              >
                {cell.label}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#1E1F24",
                  fontWeight: 600,
                }}
              >
                {cell.value}
              </div>
            </div>
          ))}
        </div>

        {/* Ringkasan AI */}
        <div>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#1E1F24",
              marginBottom: "10px",
            }}
          >
            Ringkasan AI
          </h3>
          <p
            style={{
              fontSize: "13px",
              color: "#4B5563", // tetap seperti semula
              lineHeight: 1.7,
            }}
          >
            {data.ringkasanAI}
          </p>
        </div>

        {/* Rekomendasi AI */}
        <div>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#1E1F24",
              marginBottom: "10px",
            }}
          >
            Rekomendasi AI
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {data.rekomendasi?.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  background: "#F4F5F7",
                  borderRadius: "8px",
                  padding: "12px 14px",
                  fontSize: "13px",
                  color: "#4B5563", // tetap seperti semula
                }}
              >
                <span style={{ color: "#9DA3AE", fontSize: "14px", flexShrink: 0, marginTop: "1px" }}>
                  •
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Analisis Trend AI */}
        <div>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#1E1F24",
              marginBottom: "10px",
            }}
          >
            Analisis Trend AI
          </h3>
          <p
            style={{
              fontSize: "13px",
              color: "#4B5563", // tetap seperti semula
              lineHeight: 1.7,
            }}
          >
            {data.analisisTrend}
          </p>
        </div>
      </div>
    </BaseModal>
  );
};

export default RingkasanBulananModal;