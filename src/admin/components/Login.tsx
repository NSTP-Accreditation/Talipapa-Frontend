import { useState, useEffect } from 'react';
import { X, LogIn, LogOut, XCircle } from 'lucide-react';

type ToastType = 'success' | 'logout' | 'error';

interface Toast {
  id: number;
  type: ToastType;
  title: string;
  message: string;
}

interface ToastProps {
  toasts: Toast[];
  removeToast: (id: number) => void;
}

const ToastMessage: React.FC<ToastProps> = ({ toasts, removeToast }) => {
  useEffect(() => {
    const timers = toasts.map((toast) =>
      setTimeout(() => removeToast(toast.id), 4000)
    );
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [toasts, removeToast]);

  const styles = {
    success: {
      border: 'border-green-300',
      bg: 'bg-green-50',
      textTitle: 'text-green-700',
      textMsg: 'text-green-600',
      icon: <LogIn className="w-6 h-6 text-green-600" />,
    },
    logout: {
      border: 'border-green-300',
      bg: 'bg-green-50',
      textTitle: 'text-green-700',
      textMsg: 'text-green-600',
      icon: <LogOut className="w-6 h-6 text-green-600" />,
    },
    error: {
      border: 'border-red-300',
      bg: 'bg-red-50',
      textTitle: 'text-red-700',
      textMsg: 'text-red-600',
      icon: <XCircle className="w-6 h-6 text-red-600" />,
    },
  };

  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 space-y-2 w-full flex flex-col items-center z-50">
      {toasts.map((toast) => {
        const style = styles[toast.type];
        return (
          <div
            key={toast.id}
            className={`flex items-start justify-between w-full max-w-md ${style.bg} border ${style.border} rounded-lg px-4 py-3 shadow-sm`}
          >
            <div className="flex gap-3">
              {style.icon}
              <div className="flex flex-col">
                <span className={`font-semibold ${style.textTitle}`}>{toast.title}</span>
                <span className={`text-sm ${style.textMsg}`}>{toast.message}</span>
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

// Example Usage Component
export default function ExampleAuthForm() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (type: ToastType, title: string, message: string) => {
    const newToast = { id: Date.now(), type, title, message };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleLogin = (isValid: boolean) => {
    if (isValid) {
      addToast('success', 'Login Successful', 'Welcome back!');
    } else {
      addToast('error', 'Login Failed', 'Wrong credentials!');
    }
  };

  return (
    <div className="flex flex-col items-center mt-12 space-y-4">
      <button
        onClick={() => handleLogin(true)}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Simulate Success Login
      </button>
      <button
        onClick={() => handleLogin(false)}
        className="px-4 py-2 bg-red-600 text-white rounded"
      >
        Simulate Failed Login
      </button>

      <ToastMessage toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
