import React from 'react';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { DeleteModalProps } from './types';

const DeleteModal: React.FC<DeleteModalProps> = ({
  event,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !event) return null;

  return (
    <ConfirmModal
      isOpen={isOpen}
      title={`Delete event "${event.title}"?`}
      description={
        <div>
          <p className="text-sm text-gray-700 mb-2">{event.description}</p>
          <p className="text-xs text-gray-600">Date: {event.dateTime}</p>
          {event.location && (
            <p className="text-xs text-gray-600">Location: {event.location}</p>
          )}
          <p className="text-xs text-red-700 mt-2">
            This action cannot be undone.
          </p>
        </div>
      }
      confirmLabel="Delete Event"
      cancelLabel="Cancel"
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
};

export default DeleteModal;
