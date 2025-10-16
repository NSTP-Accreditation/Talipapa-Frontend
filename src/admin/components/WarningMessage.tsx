import { useState } from 'react';
import { X, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

type AlertType = 'success' | 'error' | 'warning';

interface AlertBoxProps {
  type?: AlertType;
  message: string;
  onClose?: () => void;
}

export default function AlertBox({
  type = 'warning',
  message,
  onClose,
}: AlertBoxProps) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  const styles = {
    success: {
      border: 'border-green-300',
      text: 'text-green-700',
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    },
    error: {
      border: 'border-red-300',
      text: 'text-red-700',
      icon: <XCircle className="w-5 h-5 text-red-600" />,
    },
    warning: {
      border: 'border-amber-300',
      text: 'text-amber-700',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
    },
  };

  const style = styles[type];

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  return (
    <div
      className={`flex items-center justify-between w-full max-w-md bg-white border ${style.border} rounded-lg px-4 py-3 shadow-sm`}
    >
      <div className="flex items-center gap-3">
        {style.icon}
        <span className={`font-medium ${style.text}`}>{message}</span>
      </div>
      <button
        onClick={handleClose}
        className="text-gray-400 hover:text-gray-600 transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
