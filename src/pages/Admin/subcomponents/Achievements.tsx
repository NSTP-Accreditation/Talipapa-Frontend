import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '../../../components/ui/card';
import './css/Guidelines.css';

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  icon: string;
  category: 'Environmental' | 'Community' | 'Innovation' | 'Recognition';
  color: 'yellow' | 'green' | 'blue' | 'purple' | 'red' | 'indigo';
  link?: string;
  createdAt: string;
}

interface AchievementModalProps {
  achievement: Achievement | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (achievement: Achievement) => void;
}

interface DeleteModalProps {
  item: Achievement | null;
  itemType: 'achievement';
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const AchievementModal: React.FC<AchievementModalProps> = ({
  achievement,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Achievement>({
    id: achievement?.id || '',
    title: achievement?.title || '',
    description: achievement?.description || '',
    date: achievement?.date || '',
    icon: achievement?.icon || '🏆',
    category: achievement?.category || 'Environmental',
    color: achievement?.color || 'yellow',
    link: achievement?.link || '',
    createdAt: achievement?.createdAt || new Date().toISOString(),
  });

  React.useEffect(() => {
    if (achievement) {
      setFormData(achievement);
    } else {
      const newAchievement = {
        id: '',
        title: '',
        description: '',
        date: '',
        icon: '🏆',
        category: 'Environmental' as const,
        color: 'yellow' as const,
        link: '',
        createdAt: new Date().toISOString(),
      };
      setFormData(newAchievement);
    }
  }, [achievement]);

  const handleSave = () => {
    // Validation
    const errors = [];

    if (!formData.title.trim()) {
      errors.push('Title is required');
    }

    if (!formData.description.trim()) {
      errors.push('Description is required');
    }

    if (!formData.date.trim()) {
      errors.push('Date is required');
    }

    if (errors.length > 0) {
      alert('Please fix the following errors:\n\n• ' + errors.join('\n• '));
      return;
    }

    const updatedAchievement = {
      ...formData,
      id: formData.id || Date.now().toString(),
      createdAt: formData.createdAt || new Date().toISOString(),
    };

    onSave(updatedAchievement);
  };

  if (!isOpen) return null;

  return (
    <div
      className="guidelines-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="guidelines-modal-content">
        {/* Header */}
        <div className="guidelines-modal-header">
          <h2 className="guidelines-modal-title">
            {achievement?.id ? 'Edit Achievement' : 'Add New Achievement'}
          </h2>
          <button onClick={onClose} className="guidelines-modal-close-btn">
            ✕
          </button>
        </div>

        {/* Form Content */}
        <div className="guidelines-modal-body">
          <div className="guidelines-form-container">
            <div className="guidelines-section">
              <h3 className="guidelines-section-title">Achievement Information</h3>

              <div className="guidelines-form-group">
                <label className="guidelines-form-label">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="guidelines-form-input"
                  placeholder="e.g., Most Eco-Friendly Barangay 2024"
                />
              </div>

              <div className="guidelines-form-group">
                <label className="guidelines-form-label">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="guidelines-form-textarea"
                  placeholder="Describe the achievement and its significance..."
                />
              </div>

              <div className="guidelines-form-group">
                <label className="guidelines-form-label">Link (Optional)</label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  className="guidelines-form-input"
                  placeholder="e.g., https://example.com/article-about-award"
                />
                <p className="text-sm text-gray-700 mt-1 font-medium">
                  Add a link for more information about this achievement (website, article, certificate, etc.)
                </p>
              </div>

              <div className="guidelines-form-row">
                <div className="guidelines-form-group">
                  <label className="guidelines-form-label">Date *</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="guidelines-form-input"
                    placeholder="e.g., December 2024"
                  />
                </div>

                <div className="guidelines-form-group">
                  <label className="guidelines-form-label">Icon</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value })
                    }
                    className="guidelines-form-input"
                    placeholder="e.g., 🏆 🌱 ♻️ 🎖️"
                  />
                </div>
              </div>

              <div className="guidelines-form-row">
                <div className="guidelines-form-group">
                  <label className="guidelines-form-label">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as Achievement['category'],
                      })
                    }
                    className="guidelines-form-select"
                  >
                    <option value="Environmental">Environmental</option>
                    <option value="Community">Community</option>
                    <option value="Innovation">Innovation</option>
                    <option value="Recognition">Recognition</option>
                  </select>
                </div>

                <div className="guidelines-form-group">
                  <label className="guidelines-form-label">Color Theme</label>
                  <select
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        color: e.target.value as Achievement['color'],
                      })
                    }
                    className="guidelines-form-select"
                  >
                    <option value="yellow">Yellow</option>
                    <option value="green">Green</option>
                    <option value="blue">Blue</option>
                    <option value="purple">Purple</option>
                    <option value="red">Red</option>
                    <option value="indigo">Indigo</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="guidelines-modal-footer">
          <button
            onClick={onClose}
            className="guidelines-btn guidelines-btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="guidelines-btn guidelines-btn-primary"
          >
            {achievement?.id ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

const DeleteModal: React.FC<DeleteModalProps> = ({
  item,
  itemType,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !item) return null;

  const itemTitle = item ? item.title : '';

  return (
    <div
      className="guidelines-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="guidelines-delete-modal">
        {/* Header */}
        <div className="guidelines-delete-header">
          <div className="guidelines-delete-header-content">
            <div className="guidelines-delete-icon">
              <svg
                className="guidelines-delete-icon-svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <h2 className="guidelines-delete-title">Delete Achievement</h2>
              <p className="guidelines-delete-subtitle">
                This action cannot be undone
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="guidelines-delete-body">
          <p className="guidelines-delete-message">
            Are you sure you want to delete the achievement{' '}
            <strong>"{itemTitle}"</strong>?
          </p>

          <div className="guidelines-delete-details">
            <h4 className="guidelines-delete-details-title">Achievement Details:</h4>
            <p className="guidelines-delete-detail">
              <strong>Description:</strong> {item?.description}
            </p>
            <p className="guidelines-delete-detail">
              <strong>Date:</strong> {item?.date}
            </p>
            <p className="guidelines-delete-detail">
              <strong>Category:</strong> {item?.category}
            </p>
            {item?.link && (
              <p className="guidelines-delete-detail">
                <strong>Link:</strong> {item.link}
              </p>
            )}
          </div>

          <div className="guidelines-delete-warning">
            <div className="guidelines-delete-warning-content">
              <svg
                className="guidelines-delete-warning-icon"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <p className="guidelines-delete-warning-text">
                Warning: This will permanently remove this achievement from the system.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="guidelines-modal-footer">
          <button
            onClick={onClose}
            className="guidelines-btn guidelines-btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="guidelines-btn guidelines-btn-danger"
          >
            Delete Achievement
          </button>
        </div>
      </div>
    </div>
  );
};

const Achievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'Most Eco-Friendly Barangay 2024',
      description: 'Awarded by Quezon City LGU for outstanding environmental programs',
      date: 'December 2024',
      icon: '🏆',
      category: 'Environmental',
      color: 'yellow',
      link: 'https://quezoncity.gov.ph/environmental-awards',
      createdAt: '2024-12-01T10:00:00.000Z',
    },
    {
      id: '2',
      title: 'Zero Waste Community Recognition',
      description: 'Achieved 95% waste diversion rate through recycling programs',
      date: 'September 2024',
      icon: '🌱',
      category: 'Environmental',
      color: 'green',
      link: 'https://example.com/zero-waste-certificate',
      createdAt: '2024-09-01T10:00:00.000Z',
    },
    {
      id: '3',
      title: 'Best Recycling Program 2024',
      description: 'Innovation award for the Eco-Cycle Trading Program implementation',
      date: 'June 2024',
      icon: '♻️',
      category: 'Innovation',
      color: 'blue',
      createdAt: '2024-06-01T10:00:00.000Z',
    },
  ]);



  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [deletingItem, setDeletingItem] = useState<{ item: Achievement; type: 'achievement' } | null>(null);
  const [isAddAchievementModalOpen, setIsAddAchievementModalOpen] = useState(false);

  const handleSaveAchievement = (achievement: Achievement) => {
    if (achievement.id && achievements.find((a) => a.id === achievement.id)) {
      // Update existing achievement
      setAchievements(achievements.map((a) => (a.id === achievement.id ? achievement : a)));
    } else {
      // Add new achievement
      const newAchievement = {
        ...achievement,
        id: Date.now().toString(),
      };
      setAchievements([newAchievement, ...achievements]);
    }
    setEditingAchievement(null);
    setIsAddAchievementModalOpen(false);
  };



  const handleDeleteItem = () => {
    if (deletingItem) {
      setAchievements(achievements.filter((a) => a.id !== deletingItem.item.id));
      setDeletingItem(null);
    }
  };

  const getAchievementClasses = (color: Achievement['color']) => {
    const colorMap = {
      yellow: { bg: 'bg-yellow-50', border: 'border-yellow-500', iconBg: 'bg-yellow-500' },
      green: { bg: 'bg-green-50', border: 'border-green-500', iconBg: 'bg-green-500' },
      blue: { bg: 'bg-blue-50', border: 'border-blue-500', iconBg: 'bg-blue-500' },
      purple: { bg: 'bg-purple-50', border: 'border-purple-500', iconBg: 'bg-purple-500' },
      red: { bg: 'bg-red-50', border: 'border-red-500', iconBg: 'bg-red-500' },
      indigo: { bg: 'bg-indigo-50', border: 'border-indigo-500', iconBg: 'bg-indigo-500' },
    };
    return colorMap[color] || colorMap.yellow;
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <span className="text-4xl">🏆</span>
            Barangay Achievements
          </h1>
          <p className="text-lg text-gray-700 mt-3 font-medium">
            Manage accomplishments and recognition in environmental initiatives
          </p>
        </div>
        <button
          onClick={() => setIsAddAchievementModalOpen(true)}
          className="guidelines-btn guidelines-btn-primary"
        >
          Add New Achievement
        </button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-6">
        {/* Achievements Card */}
        <Card>
          <CardHeader>
            <CardTitle>Environmental Awards & Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {achievements.length > 0 ? (
                achievements.map((achievement) => {
                  const classes = getAchievementClasses(achievement.color);
                  return (
                    <div
                      key={achievement.id}
                      className={`flex items-center space-x-4 p-6 ${classes.bg} border-l-4 ${classes.border} rounded-lg shadow-sm mb-4`}
                    >
                      <div className={`w-16 h-16 ${classes.iconBg} rounded-full flex items-center justify-center text-white text-2xl`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{achievement.title}</h4>
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                            {achievement.category}
                          </span>
                          {achievement.link && (
                            <a
                              href={achievement.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                              title="View more details"
                            >
                              🔗 Link
                            </a>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {achievement.description}
                        </p>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-700 font-medium">{achievement.date}</span>
                          {achievement.link && (
                            <a
                              href={achievement.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                              title="Click to view more information"
                            >
                              Learn more →
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingAchievement(achievement)}
                          className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 rounded"
                          title="Edit Achievement"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => setDeletingItem({ item: achievement, type: 'achievement' })}
                          className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded"
                          title="Delete Achievement"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-700">
                  <p className="text-lg font-bold">No achievements found.</p>
                  <p className="text-base font-medium">Click "Add Achievement" to create your first achievement.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <AchievementModal
        achievement={editingAchievement}
        isOpen={!!editingAchievement || isAddAchievementModalOpen}
        onClose={() => {
          setEditingAchievement(null);
          setIsAddAchievementModalOpen(false);
        }}
        onSave={handleSaveAchievement}
      />

      <DeleteModal
        item={deletingItem?.item || null}
        itemType="achievement"
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleDeleteItem}
      />
    </div>
  );
};

export default Achievements;
