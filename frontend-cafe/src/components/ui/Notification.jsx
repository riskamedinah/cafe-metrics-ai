import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const TOAST_STYLES = {
  success: { icon: CheckCircle, colorClass: "text-blue-600", bgClass: "bg-blue-50", barClass: "bg-blue-600" },
  error: { icon: XCircle, colorClass: "text-red-500", bgClass: "bg-red-50", barClass: "bg-red-500" },
  warning: { icon: AlertTriangle, colorClass: "text-amber-600", bgClass: "bg-amber-50", barClass: "bg-amber-600" },
  info: { icon: Info, colorClass: "text-blue-600", bgClass: "bg-blue-50", barClass: "bg-blue-600" },
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
    <div className="fixed bottom-6 right-6 flex flex-col-reverse gap-2.5 z-50 w-full max-w-xs pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onClose={() => onClose(t.id)} />
      ))}
    </div>
  );
};

const ToastItem = ({ toast, onClose }) => {
  const { type, title, message, duration } = toast;
  const { icon: Icon, colorClass, bgClass, barClass } = TOAST_STYLES[type] ?? TOAST_STYLES.info;

  const [leaving, setLeaving] = useState(false);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);
  const startRef = useRef(Date.now());
  const remainingRef = useRef(duration);

  const close = useCallback(() => {
    setLeaving(true);
    setTimeout(onClose, 200);
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
      className={`pointer-events-auto relative overflow-hidden flex gap-3 items-start bg-white rounded-xl shadow-lg p-3.5 transition-all duration-200 ease-in-out ${
        leaving
          ? "opacity-0 translate-x-4 scale-95"
          : "opacity-100 translate-x-0 scale-100"
      }`}
    >


      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm text-gray-900 leading-snug">
          {title}
        </div>
        {message ? (
          <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">
            {message}
          </div>
        ) : null}
      </div>

      <button
        onClick={close}
        aria-label="Tutup notifikasi"
        className="bg-transparent border-0 cursor-pointer p-0.5 text-gray-400 hover:text-gray-600 flex shrink-0 transition-colors"
      >
        <X size={16} />
      </button>

      {duration ? (
        <div
          className={`absolute left-0 bottom-0 h-0.5 w-full origin-left opacity-60 ${barClass}`}
          style={{
            transitionProperty: "transform",
            transitionDuration: `${duration}ms`,
            transitionTimingFunction: "linear",
            transform: paused || leaving ? "scaleX(0)" : "scaleX(1)",
          }}
        />
      ) : null}
    </div>
  );
};