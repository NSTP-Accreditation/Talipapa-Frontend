import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import SuccessMessage from '@/admin/components/SuccessMessage';
import ErrorMessage from '@/admin/components/ErrorMessage';
import WarningMessage from '@/admin/components/WarningMessage';
import InformationalMessage from '@/admin/components/InformationalMessage';
import Failed from '@/admin/components/Failed';

type ToastType = 'success' | 'error' | 'warning' | 'info' | 'auth';

type Toast = {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration?: number; // ms
};

type ShowToastOpts = {
  type?: ToastType;
  message: string;
  title?: string;
  duration?: number;
};

type ToastContextValue = {
  toasts: Toast[];
  showToast: (opts: ShowToastOpts) => string;
  removeToast: (id: string) => void;
  success: (msg: string, duration?: number) => string;
  error: (msg: string, duration?: number) => string;
  warn: (msg: string, duration?: number) => string;
  info: (msg: string, duration?: number) => string;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type = 'info', message, title, duration }: ShowToastOpts) => {
      // Default duration: 2000ms unless a valid duration is provided
      const computedDuration =
        typeof duration === 'number' && duration > 0 ? duration : 2000;

      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const toast: Toast = {
        id,
        type,
        message,
        title,
        duration: computedDuration,
      };

      // Append so newest toasts appear at the bottom of the stack
      setToasts((t) => [...t, toast]);

      // auto-remove after computed duration
      if (computedDuration && computedDuration > 0) {
        setTimeout(() => removeToast(id), computedDuration);
      }

      return id;
    },
    [removeToast]
  );

  const success = useCallback(
    (msg: string, duration?: number) =>
      showToast({ type: 'success', message: msg, duration }),
    [showToast]
  );
  const error = useCallback(
    (msg: string, duration?: number) =>
      showToast({ type: 'error', message: msg, duration }),
    [showToast]
  );
  const warn = useCallback(
    (msg: string, duration?: number) =>
      showToast({ type: 'warning', message: msg, duration }),
    [showToast]
  );
  const info = useCallback(
    (msg: string, duration?: number) =>
      showToast({ type: 'info', message: msg, duration }),
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{ toasts, showToast, removeToast, success, error, warn, info }}
    >
      {children}

      {/* Toast container - bottom center */}
  <div className="fixed inset-x-0 bottom-6 z-20 flex items-end justify-center pointer-events-none">
        <div className="w-full max-w-xl px-4 flex flex-col space-y-3">
          {toasts.map((t) => (
            <div key={t.id} className="pointer-events-auto">
              {/* Scale wrapper to make toast visually bigger */}
              <div className="transform scale-110">
                {/* Map toast type to existing components */}
                {t.type === 'success' && (
                  <SuccessMessage
                    message={t.message}
                    onClose={() => removeToast(t.id)}
                  />
                )}
                {t.type === 'error' && (
                  <ErrorMessage
                    type="error"
                    message={t.message}
                    onClose={() => removeToast(t.id)}
                  />
                )}
                {t.type === 'warning' && (
                  <WarningMessage
                    type="warning"
                    message={t.message}
                    onClose={() => removeToast(t.id)}
                  />
                )}
                {t.type === 'info' && (
                  <InformationalMessage
                    type="info"
                    message={t.message}
                    onClose={() => removeToast(t.id)}
                  />
                )}
                {t.type === 'auth' && (
                  <Failed
                    type="success"
                    title={t.title || ''}
                    message={t.message}
                    onClose={() => removeToast(t.id)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
};

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}

export default ToastContext;
