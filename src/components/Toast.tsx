import React, { useEffect } from 'react';
import { CheckCircle2, Info, RotateCcw, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'undo';
  onUndo?: () => void;
  duration?: number;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div 
      aria-live="polite" 
      className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss
}) => {
  const duration = toast.duration || (toast.onUndo ? 5500 : 3500);

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, duration);
    return () => clearTimeout(timer);
  }, [toast, duration, onDismiss]);

  return (
    <div
      role="status"
      className="pointer-events-auto flex items-center justify-between gap-3 p-3.5 bg-gray-900 text-white rounded-xl shadow-xl border border-gray-800 text-xs sm:text-sm animate-in slide-in-from-bottom-3 duration-200"
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {toast.type === 'undo' ? (
          <RotateCcw className="w-4 h-4 text-indigo-400 shrink-0" />
        ) : toast.type === 'info' ? (
          <Info className="w-4 h-4 text-blue-400 shrink-0" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        )}
        <span className="truncate font-medium">{toast.message}</span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {toast.onUndo && (
          <button
            onClick={() => {
              toast.onUndo?.();
              onDismiss(toast.id);
            }}
            className="px-2.5 py-1 bg-white text-slate-900 hover:bg-slate-100 active:scale-95 text-xs font-bold rounded-lg shadow-xs transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus:outline-none"
          >
            Undo
          </button>
        )}

        <button
          onClick={() => onDismiss(toast.id)}
          className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-slate-400 focus:outline-none"
          aria-label="Close notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
