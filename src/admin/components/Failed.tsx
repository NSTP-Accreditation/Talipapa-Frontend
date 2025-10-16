import { useState } from 'react';
import { X, LogIn, LogOut, XCircle } from 'lucide-react';

type AlertType = 'success' | 'logout' | 'error';

interface AuthAlertProps {
  type: AlertType;
  title: string;
  message: string;
}

export default function AuthAlert({ type, title, message }: AuthAlertProps) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

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

  const style = styles[type];

  return (
    <div
      className={`flex items-start justify-between w-full max-w-md ${style.bg} border ${style.border} rounded-lg px-4 py-3 shadow-sm`}
    >
      <div className="flex gap-3">
        {style.icon}
        <div className="flex flex-col">
          <span className={`font-semibold ${style.textTitle}`}>{title}</span>
          <span className={`text-sm ${style.textMsg}`}>{message}</span>
        </div>
      </div>

      <button
        onClick={() => setVisible(false)}
        className="text-gray-400 hover:text-gray-600 transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
