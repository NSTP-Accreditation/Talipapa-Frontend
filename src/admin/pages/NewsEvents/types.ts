export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  location?: string;
  category: 'Announcement' | 'Meeting' | 'Event' | 'Notice';
  priority: 'High' | 'Medium' | 'Low';
  createdAt: string;
}

export interface EventModalProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
}

export interface DeleteModalProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
