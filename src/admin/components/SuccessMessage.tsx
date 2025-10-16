import { useState } from 'react';
import { CheckCircle, X } from 'lucide-react';

type Props = {
  message?: string;
  onClose?: () => void;
};

export default function SuccessMessage({
  message = 'Success Message',
  onClose,
}: Props) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  return (
    <div
      className="flex items-center justify-between w-full max-w-md mx-auto border border-green-600 bg-green-50 text-green-800 rounded-lg px-4 py-3 shadow-sm animate-fade-in"
      role="alert"
    >
      <div className="flex items-center gap-2">
        <CheckCircle className="w-5 h-5 text-green-700" />
        <span className="font-medium">{message}</span>
      </div>

      <button
        onClick={handleClose}
        className="text-green-800 hover:text-green-600 transition-colors"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
