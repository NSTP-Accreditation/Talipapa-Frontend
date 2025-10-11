import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import GuideTemplate from '../../page/GuideTemplate';
import { guidesData } from './guideData';

const UnifiedGuide: React.FC = () => {
  const { guideId } = useParams<{ guideId: string }>();

  // If no guideId or guide doesn't exist, redirect or show error
  if (!guideId || !guidesData[guideId]) {
    return <Navigate to="/guidelines" replace />;
  }

  const guide = guidesData[guideId];

  return (
    <GuideTemplate
      title={guide.title}
      description={guide.description}
      icon={guide.icon}
      estimatedTime={guide.estimatedTime}
      difficulty={guide.difficulty}
      steps={guide.steps}
      requirements={guide.requirements}
      tips={guide.tips}
    />
  );
};

export default UnifiedGuide;
