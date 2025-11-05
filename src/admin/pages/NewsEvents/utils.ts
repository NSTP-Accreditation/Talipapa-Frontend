import { NewsEvent } from './types';

export const getCategoryColor = (category: NewsEvent['category']) => {
  switch (category) {
    case 'Event':
      return 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200';
    case 'Announcement':
      return 'border-green-500 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200';
    case 'Notice':
      return 'border-yellow-500 bg-gradient-to-r from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200';
    case 'Meeting':
      return 'border-purple-500 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200';
    default:
      return 'border-gray-500 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200';
  }
};

export const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case 'HIGH':
      return '🔴';
    case 'MEDIUM':
      return '🟡';
    case 'LOW':
      return '🟢';
    default:
      return '⚪';
  }
};
