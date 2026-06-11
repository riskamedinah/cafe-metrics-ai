import { useState } from "react";

const BarangCard = ({ item, onBeli }) => {
  const [imgError, setImgError] = useState(false);

  const handleBeli = () => {
    if (onBeli) {
      onBeli(item);
    } else {
      alert(`Beli: ${item.nama}`);
    }
  };

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "12px",
        border: "1px solid #E8E9EC",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)";
      }}
    >
      {/* Image Area */}
      <div
        style={{
          background: "#F4F5F7",
          height: "160px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {!imgError ? (
          <img
            src={item.gambar}
            alt={item.nama}
            onError={() => setImgError(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 8,
              background: "#DDE1E7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="3" stroke="#9DA3AE" strokeWidth="1.5" />
              <circle cx="8.5" cy="8.5" r="1.5" fill="#9DA3AE" />
              <path d="M3 15l5-5 4 4 3-3 6 6" stroke="#9DA3AE" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>

      {/* Info & Button */}
      <div style={{ padding: "14px 16px 16px" }}>
        <p
          style={{
            fontFamily: "'Geist Variable', 'Inter', sans-serif",
            fontSize: "14px",
            fontWeight: 600,
            color: "#1E1F24",
            margin: 0,
            marginBottom: "2px",
            lineHeight: 1.4,
          }}
        >
          {item.nama}
        </p>
        <p
          style={{
            fontFamily: "'Geist Variable', 'Inter', sans-serif",
            fontSize: "12px",
            fontWeight: 400,
            color: "#9DA3AE",
            margin: 0,
            marginBottom: "14px",
            lineHeight: 1.4,
          }}
        >
          {item.deskripsi}
        </p>

        <button
          onClick={handleBeli}
          style={{
            width: "100%",
            padding: "9px 0",
            background: "#3B5BDB",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            fontFamily: "'Geist Variable', 'Inter', sans-serif",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#3451C7")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#3B5BDB")}
        >
          Beli Sekarang
        </button>
      </div>
    </div>
  );
};

export default BarangCard;