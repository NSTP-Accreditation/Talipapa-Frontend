import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '../utils';

// Toast Types
export type ToastType = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastState {
  toasts: Toast[];
}

type ToastAction =
  | { type: 'ADD_TOAST'; payload: Toast }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'UPDATE_TOAST'; payload: Toast }
  | { type: 'CLEAR_ALL' };

// Toast Context
interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearAll: () => void;
  success: (
    message: string,
    options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>
  ) => string;
  error: (
    message: string,
    options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>
  ) => string;
  warning: (
    message: string,
    options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>
  ) => string;
  info: (
    message: string,
    options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>
  ) => string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Toast Reducer
const toastReducer = (state: ToastState, action: ToastAction): ToastState => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, action.payload],
      };
    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.payload),
      };
    case 'CLEAR_ALL':
      return {
        ...state,
        toasts: [],
      };
    default:
      return state;
  }
};

// Toast Provider
interface ToastProviderProps {
  children: React.ReactNode;
  position?: ToastPosition;
  maxToasts?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = 'top-right',
  maxToasts = 5,
}) => {
  const [state, dispatch] = useReducer(toastReducer, { toasts: [] });

  const generateId = useCallback(() => {
    return Math.random().toString(36).substr(2, 9);
  }, []);

  const addToast = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      // If a toast with same type+title+message exists, update it in-place (resets duration)
      const duplicate = state.toasts.find(
        (t) =>
          t.type === toast.type &&
          t.message === toast.message &&
          t.title === toast.title
      );

      if (duplicate) {
        const updated: Toast = {
          ...duplicate,
          duration: toast.duration ?? 4000,
          persistent: toast.persistent ?? duplicate.persistent,
          title: toast.title ?? duplicate.title,
          message: toast.message ?? duplicate.message,
        };

        dispatch({ type: 'UPDATE_TOAST', payload: updated });
        return duplicate.id;
      }

      const id = generateId();
      const newToast: Toast = {
        id,
        duration: 4000,
        ...toast,
      };

      dispatch({ type: 'ADD_TOAST', payload: newToast });

      return id;
    },
    [generateId, state.toasts]
  );

  const removeToast = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  }, []);

  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
  }, []);

  // Helper methods
  const success = useCallback(
    (
      message: string,
      options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>
    ) => {
      return addToast({ type: 'success', message, ...options });
    },
    [addToast]
  );

  const error = useCallback(
    (
      message: string,
      options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>
    ) => {
      return addToast({ type: 'error', message, ...options });
    },
    [addToast]
  );

  const warning = useCallback(
    (
      message: string,
      options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>
    ) => {
      return addToast({ type: 'warning', message, ...options });
    },
    [addToast]
  );

  const info = useCallback(
    (
      message: string,
      options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>
    ) => {
      return addToast({ type: 'info', message, ...options });
    },
    [addToast]
  );

  // Limit number of toasts
  const limitedToasts = state.toasts.slice(-maxToasts);

  const value: ToastContextType = {
    toasts: limitedToasts,
    addToast,
    removeToast,
    clearAll,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer
        position={position}
        toasts={limitedToasts}
        removeToast={removeToast}
      />
    </ToastContext.Provider>
  );
};

// Toast Hook
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast Item Component
interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const [progress, setProgress] = React.useState(100);
  const [isVisible, setIsVisible] = React.useState(false);
  const [isExiting, setIsExiting] = React.useState(false);

  useEffect(() => {
    // Entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!toast.persistent && toast.duration && toast.duration > 0) {
      // reset progress when toast changes
      setProgress(100);

      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - 100 / (toast.duration! / 50);
          return Math.max(0, newProgress);
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [toast]);

  // Reset visibility and progress when the toast object updates (in-place refresh)
  useEffect(() => {
    setIsExiting(false);
    setIsVisible(true);
    setProgress(100);
  }, [toast]);

  // Auto-remove timer handled here so updates to the same toast can reset the timer
  useEffect(() => {
    if (!toast.persistent && toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        onRemove(toast.id);
      }, toast.duration);
      return () => clearTimeout(timer);
    }

    return;
  }, [toast, onRemove]);

  const handleRemove = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'info':
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          container: 'bg-white border-green-200 shadow-lg',
          icon: 'text-green-600 bg-green-50',
          title: 'text-green-800',
          message: 'text-green-700',
          progress: 'bg-green-500',
        };
      case 'error':
        return {
          container: 'bg-white border-red-200 shadow-lg',
          icon: 'text-red-600 bg-red-50',
          title: 'text-red-800',
          message: 'text-red-700',
          progress: 'bg-red-500',
        };
      case 'warning':
        return {
          container: 'bg-white border-yellow-200 shadow-lg',
          icon: 'text-yellow-600 bg-yellow-50',
          title: 'text-yellow-800',
          message: 'text-yellow-700',
          progress: 'bg-yellow-500',
        };
      case 'info':
      default:
        return {
          container: 'bg-white border-blue-200 shadow-lg',
          icon: 'text-blue-600 bg-blue-50',
          title: 'text-blue-800',
          message: 'text-blue-700',
          progress: 'bg-blue-500',
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      className={cn(
        'relative w-full max-w-sm mx-auto mb-4 rounded-xl border-2 overflow-hidden transition-all duration-300 ease-in-out transform',
        styles.container,
        isVisible && !isExiting
          ? 'translate-x-0 translate-y-0 opacity-100 scale-100'
          : 'sm:translate-x-full translate-y-[-20px] opacity-0 scale-95',
        isExiting &&
          'sm:-translate-x-full translate-y-[-20px] opacity-0 scale-95'
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start p-4">
        <div className={cn('flex-shrink-0 rounded-full p-2 mr-3', styles.icon)}>
          {getIcon()}
        </div>

        <div className="flex-1 min-w-0">
          {toast.title && (
            <p className={cn('text-sm font-semibold mb-1', styles.title)}>
              {toast.title}
            </p>
          )}
          <p className={cn('text-sm break-words', styles.message)}>
            {toast.message}
          </p>

          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className={cn(
                'mt-2 text-xs font-medium underline hover:no-underline transition-all',
                styles.title
              )}
            >
              {toast.action.label}
            </button>
          )}
        </div>

        <button
          onClick={handleRemove}
          className="ml-3 p-1 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Progress bar */}
      {!toast.persistent && toast.duration && toast.duration > 0 && (
        <div className="h-1 bg-gray-200">
          <div
            className={cn(
              'h-full transition-all duration-75 ease-linear',
              styles.progress
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

// Toast Container
interface ToastContainerProps {
  position: ToastPosition;
  toasts: Toast[];
  removeToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  position,
  toasts,
  removeToast,
}) => {
  const getPositionStyles = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 sm:top-6 left-1/2 transform -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0';
      case 'top-left':
        return 'top-4 sm:top-6 left-1/2 transform -translate-x-1/2 sm:right-auto sm:left-6 sm:translate-x-0';
      case 'bottom-right':
        return 'bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0';
      case 'bottom-left':
        return 'bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 sm:right-auto sm:left-6 sm:translate-x-0';
      case 'top-center':
        return 'top-4 sm:top-6 left-1/2 transform -translate-x-1/2';
      case 'bottom-center':
        return 'bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2';
      default:
        return 'top-4 sm:top-6 left-1/2 transform -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0';
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div
      className={cn(
        'fixed z-[9999] flex flex-col gap-2 pointer-events-none px-4 sm:px-0',
        getPositionStyles()
      )}
      style={{
        maxWidth: '420px',
        width: '100%',
      }}
    >
      <div className="pointer-events-auto">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </div>
  );
};

// Export components
export { ToastItem, ToastContainer };
