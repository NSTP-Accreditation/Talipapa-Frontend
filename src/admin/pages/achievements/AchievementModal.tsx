import React from 'react';
import { createPortal } from 'react-dom';
import { Plus, SquarePen, X, ImageIcon, Image, Link, Eye } from 'lucide-react';

type Props = {
  open: boolean;
  onClose: () => void;
  form: any;
  editingIndex: number | null;
  onChange: (k: string, v: any) => void;
  onFile: (file: File | null) => Promise<void> | void;
  onSave: () => Promise<void> | void;
  fileUploading: boolean;
};

export { default } from './components/AchievementModal';
