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
    <div className="bg-white rounded-2xl p-3.5 flex flex-col shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-150 ease-in-out">
      {/* Background container gambar diubah ke bg-white */}
      <div className="bg-white aspect-video rounded-lg flex items-center justify-center overflow-hidden mb-4 p-2">
        {!imgError ? (
          <img
            src={item.gambar}
            alt={item.nama}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain object-center"
          />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24">
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="3"
                className="stroke-gray-400"
                strokeWidth="1.5"
              />
              <circle cx="8.5" cy="8.5" r="1.5" className="fill-gray-400" />
              <path
                d="M3 15l5-5 4 4 3-3 6 6"
                className="stroke-gray-400"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>

      <p className="text-base font-medium text-gray-900 mb-1 leading-snug">
        {item.nama}
      </p>

      <p className="text-sm font-normal text-gray-500 mb-4 leading-snug line-clamp-1">
        {item.deskripsi}
      </p>

      <button
        onClick={handleBeli}
        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white border-none rounded-lg text-xs font-semibold cursor-pointer transition-colors duration-150 ease-in-out mt-auto"
      >
        Beli Sekarang
      </button>
    </div>
  );
};

export default BarangCard;