import { useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

interface AlertMessageProps {
  type?: "success" | "error";
  message?: string;
}

export default function AlertMessage({ type = "success", message = "Message" }: AlertMessageProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  // ✅ Define color themes based on type
  const colors = {
    success: {
      border: "border-green-500",
      bg: "bg-green-50",
      text: "text-green-700",
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    },
    error: {
      border: "border-red-500",
      bg: "bg-red-50",
      text: "text-red-700",
      icon: <XCircle className="w-5 h-5 text-red-600" />,
    },
  };

  const theme = colors[type] || colors.success;

  return (
    <div
      className={`flex items-center justify-between w-full max-w-md mx-auto ${theme.border} ${theme.bg} ${theme.text} rounded-lg px-4 py-3 shadow-sm animate-fade-in`}
      role="alert"
    >
      {/* Left: Icon + Message */}
      <div className="flex items-center gap-2">
        {theme.icon}
        <span className="font-medium">{message}</span>
      </div>

      {/* Close Button */}
      <button
        onClick={() => setVisible(false)}
        className="text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Close alert"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
