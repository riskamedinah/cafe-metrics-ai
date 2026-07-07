import { useState } from "react";
import { Sparkles, Package, Info, TrendingUp } from "lucide-react";
import { mockRingkasan } from "../data/generateMock";

const GenerateRingkasanPage = () => {
  const [ringkasan, setRingkasan] = useState(mockRingkasan);
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Nanti di sini bisa panggil API dan update state
    }, 1500);
  };

  return (
    <div
      style={{
        padding: "32px",
        background: "#F4F5F7",
        minHeight: "100vh",
        fontFamily: "'Geist Variable', 'Inter', sans-serif",
      }}
    >
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
        }}
      >
        <h2
          style={{
            fontSize: "22px",
            fontWeight: 500,
            color: "#1E1F24",
            margin: 0,
          }}
        >
          AI Generate Ringkasan
        </h2>

        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#3B5BDB",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "10px 20px",
            fontSize: "15px",
            fontWeight: 500,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.75 : 1,
            transition: "background 0.15s, opacity 0.15s",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.background = "#3451C7";
          }}
          onMouseLeave={(e) => {
            if (!loading) e.currentTarget.style.background = "#3B5BDB";
          }}
        >
          {loading ? (
            <>
              <span
                style={{
                  width: 15,
                  height: 15,
                  border: "2px solid rgba(255,255,255,0.35)",
                  borderTopColor: "#fff",
                  borderRadius: "50%",
                  display: "inline-block",
                  animation: "spin 0.7s linear infinite",
                  flexShrink: 0,
                }}
              />
              Menghasilkan...
            </>
          ) : (
            <>
              <Sparkles size={25} />
              Generate Ringkasan
            </>
          )}
        </button>
      </div>

      {/* Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Card: Ringkasan */}
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            border: "1px solid #E8E9EC",
            padding: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "25%",
                background: "#EEF2FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Package size={25} color="#3B5BDB" />
            </div>
            <div>
              <div style={{ fontSize: "18px", fontWeight: 500, color: "#1E1F24" }}>
                Ringkasan
              </div>
              <div style={{ fontSize: "15px", color: "#4B5563"}}>
                Data  periode bulan ini
              </div>
            </div>
          </div>
          <p
            style={{
              fontSize: "15px",
              color: "#4B5563",
              margin: 0,
            }}
          >
            {ringkasan.detail}
          </p>
        </div>

        {/* Card: Rekomendasi */}
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            border: "1px solid #E8E9EC",
            padding: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "25%",
                background: "#EEF2FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Info size={25} color="#3B5BDB" />
            </div>
            <div>
              <div style={{ fontSize: "18px", fontWeight: 500, color: "#1E1F24" }}>
                Rekomendasi
              </div>
              <div style={{ fontSize: "15px", color: "#4B5563", marginTop: "2px" }}>
                Insight untuk meningkatkan performa
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {ringkasan.rekomendasi.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  background: "#F4F5F7",
                  borderRadius: "8px",
                  padding: "12px 14px",
                  fontSize: "15px",
                  color: "#4B5563",
                }}
              >
                <span
                  style={{
                    color: "#9DA3AE",
                    fontSize: "14px",
                    flexShrink: 0,
                    marginTop: "1px",
                  }}
                >
                  •
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card: Analisis Tren */}
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            border: "1px solid #E8E9EC",
            padding: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "20%",
                background: "#EEF2FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <TrendingUp size={25} color="#3B5BDB" />
            </div>
            <div>
              <div style={{ fontSize: "18px", fontWeight: 500, color: "#1E1F24" }}>
                Analisis Tren
              </div>
              <div style={{ fontSize: "15px", color: "#4B5563", marginTop: "2px" }}>
                Insight Performa Produk
              </div>
            </div>
          </div>
          <p
            style={{
              fontSize: "15px",
              color: "#4B5563",
              lineHeight: 1.75,
              margin: 0,
            }}
          >
            {ringkasan.analisisTren}
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default GenerateRingkasanPage;