import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { XCircle, AlertTriangle, Info, X } from "lucide-react"; // ✅ Hapus CheckCircle2

const ToastContext = createContext(null);

const TOAST_STYLES = {
  success: { icon: null, color: "#3A72D2", bg: "#EAF0FC" }, // ✅ Icon null, warna biru
  error: { icon: XCircle, color: "#D8434E", bg: "#FCEAEB" },
  warning: { icon: AlertTriangle, color: "#C77D1E", bg: "#FDF3E4" },
  info: { icon: Info, color: "#3A72D2", bg: "#EAF0FC" },    // ✅ Warna biru
};

let idCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((type, title, message, duration = 4000) => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, type, title, message, duration }]);
    return id;
  }, []);

  const api = {
    success: (title, message, duration) => push("success", title, message, duration),
    error: (title, message, duration) => push("error", title, message, duration),
    warning: (title, message, duration) => push("warning", title, message, duration),
    info: (title, message, duration) => push("info", title, message, duration),
    remove,
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport toasts={toasts} onClose={remove} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast harus dipakai di dalam <ToastProvider>");
  return ctx;
};

const ToastViewport = ({ toasts, onClose }) => {
  if (toasts.length === 0) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        display: "flex",
        flexDirection: "column-reverse",
        gap: 10,
        zIndex: 100,
        maxWidth: 360,
      }}
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onClose={() => onClose(t.id)} />
      ))}
    </div>
  );
};

const ToastItem = ({ toast, onClose }) => {
  const { type, title, message, duration } = toast;
  const { icon: Icon, color, bg } = TOAST_STYLES[type] ?? TOAST_STYLES.info;

  const [leaving, setLeaving] = useState(false);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);
  const startRef = useRef(Date.now());
  const remainingRef = useRef(duration);

  const close = useCallback(() => {
    setLeaving(true);
    setTimeout(onClose, 180);
  }, [onClose]);

  useEffect(() => {
    if (!duration || leaving) return;
    if (paused) {
      clearTimeout(timerRef.current);
      remainingRef.current -= Date.now() - startRef.current;
    } else {
      startRef.current = Date.now();
      timerRef.current = setTimeout(close, remainingRef.current);
    }
    return () => clearTimeout(timerRef.current);
  }, [paused, leaving, duration, close]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(0,0,0,0.14)",
        padding: "14px 16px",
        minWidth: 300,
        animation: leaving
          ? "toastOut 180ms ease forwards"
          : "toastIn 220ms cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {/* ✅ Icon hanya tampil jika ada (success tidak ada icon) */}
      {Icon && (
        <div
          style={{
            flexShrink: 0,
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={17} color={color} strokeWidth={2.2} />
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: "#1E1F24", lineHeight: 1.3 }}>
          {title}
        </div>
        {message ? (
          <div style={{ fontSize: 13, color: "#5F637B", marginTop: 2, lineHeight: 1.4 }}>
            {message}
          </div>
        ) : null}
      </div>

      <button
        onClick={close}
        aria-label="Tutup notifikasi"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 2,
          color: "#A6AABA",
          display: "flex",
          flexShrink: 0,
        }}
      >
        <X size={16} />
      </button>

      {duration ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            height: 3,
            width: "100%",
            background: color, // ✅ Akan berwarna biru untuk success/info
            opacity: 0.55,
            transformOrigin: "left",
            animationPlayState: paused ? "paused" : "running",
            animation: leaving ? "none" : `toastShrink ${duration}ms linear forwards`,
          }}
        />
      ) : null}

      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(16px) scale(0.98); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes toastOut {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(16px); }
        }
        @keyframes toastShrink {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
};