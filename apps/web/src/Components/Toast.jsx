import { useEffect } from "react";

export default function Toast({ show, type = "success", message, onClose, duration = 2200 }) {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(t);
  }, [show, duration, onClose]);

  if (!show) return null;

  const base =
    "fixed top-5 right-5 z-[9999] w-[320px] rounded-2xl border px-4 py-3 shadow-xl font-bold text-sm flex items-start gap-3";

  const styles = {
    success: "bg-emerald-50 border-emerald-200 text-emerald-800",
    error: "bg-rose-50 border-rose-200 text-rose-800",
    info: "bg-slate-50 border-slate-200 text-slate-800",
    warning: "bg-amber-50 border-amber-200 text-amber-900",
  };

  return (
    <div className={`${base} ${styles[type] || styles.info}`}>
      <div className="flex-1">{message}</div>

      <button
        onClick={onClose}
        className="ml-2 rounded-xl px-2 py-1 text-xs font-black bg-black/10 hover:bg-black/20"
      >
        ✕
      </button>
    </div>
  );
}
