export interface NewsEvent {
  _id?: string;
  title: string;
  description: string;
  dateTime: string;
  location?: string;
  category: 'Announcement' | 'Meeting' | 'Event' | 'Notice';
  priority: 'High' | 'Medium' | 'Low';
  createdAt: string;
}

export interface EventModalProps {
  event: NewsEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: NewsEvent) => void;
}

export interface DeleteModalProps {
  event: NewsEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
