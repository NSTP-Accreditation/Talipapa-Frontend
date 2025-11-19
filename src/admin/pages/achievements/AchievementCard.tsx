import React from 'react';
import { Trophy } from 'lucide-react';

type Props = {
  item: any;
  index: number;
  onEdit: (index: number) => void;
  onDelete: (id: string) => void;
};

export { default } from './components/AchievementCard';
