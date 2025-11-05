import React from 'react';
import { Guideline } from '../types';
import GuidelinesCard from './GuidelinesCard';

type Props = {
  guidelines: Guideline[];
  selectedGuidelines: Set<string>;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

const GuidelinesList = ({
  guidelines,
  selectedGuidelines,
  onSelect,
  onEdit,
  onDelete,
}: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
      {guidelines.map((g) => (
        <GuidelinesCard
          key={g._id}
          guideline={g}
          selected={selectedGuidelines.has(g._id)}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default GuidelinesList;
