import React from 'react';
import Modal from './Modal';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      ariaLabel={typeof title === 'string' ? title : undefined}
    >
      <div className="space-y-4">
        {description && <p className="text-gray-700">{description}</p>}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => onConfirm()}
            disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold shadow-sm hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Working...
              </>
            ) : (
              <>{confirmLabel}</>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
