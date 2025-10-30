import React from 'react';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { Guideline } from '../types';

type Props = {
  guideline: Guideline | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
};

const DeleteModal: React.FC<Props> = ({
  guideline,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !guideline) return null;

  return (
    <ConfirmModal
      isOpen={isOpen}
      title={`Delete guideline "${guideline.title}"?`}
      description={
        <div>
          <p className="text-sm text-gray-700 mb-2">{guideline.description}</p>
          <p className="text-xs text-gray-600">
            Category: {guideline.category}
          </p>
          <p className="text-xs text-gray-600">
            Steps: {guideline.steps.length}
          </p>
        </div>
      }
      confirmLabel="Delete"
      cancelLabel="Cancel"
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
};

export default DeleteModal;
