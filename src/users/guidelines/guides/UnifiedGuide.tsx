import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import GuideTemplate from '../../page/GuideTemplate';
import { guidesData } from './guideData';
import useFetchData from '@/admin/hooks/useFetchData';
import { Building2 } from 'lucide-react';
import NotFound from '@/components/NotFound';
import { ResponsiveSkeleton } from '@/components/ResponsiveSkeleton';

// Define types for your guide data
interface GuideStep {
  stepNumber: number;
  title: string;
  description: string;
  location: string;
  requiredDocuments: string[];
  estimatedTime: string;
  tips: string[];
  _id: string;
}

interface Guide {
  _id: string;
  category: string;
  title: string;
  description: string;
  totalEstimatedTime: string;
  difficulty: string;
  lastUpdated: string;
  steps: GuideStep[];
  createdAt: string;
  __v: number;
  updatedAt: string;
}

const UnifiedGuide: React.FC = () => {
  const { guideId } = useParams<{ guideId: string }>();

  // If no guideId or guide doesn't exist, redirect or show error
  if (!guideId) {
    return <Navigate to="/guidelines" replace />;
  }

  const {
    data: guide,
    loading,
    error,
  } = useFetchData<Guide>(`/guidelines/${guideId}`);

  const getUniqueRequiredDocuments = (): string[] => {
    if (!guide?.steps) return [];

    const allDocuments = guide.steps.flatMap((step) =>
      Array.isArray(step.requiredDocuments) ? step.requiredDocuments : []
    );

    // Remove duplicates using Set and ensure they are strings
    return [...new Set(allDocuments)].filter(
      (doc): doc is string => typeof doc === 'string'
    );
  };

  const uniqueRequirements = getUniqueRequiredDocuments();

  if (error) return <NotFound />;

  // Show responsive skeleton while loading or if guide is not yet available
  if (loading || !guide) {
    return <ResponsiveSkeleton page="guidelines" />;
  }

  return (
    <GuideTemplate
      title={guide?.title}
      description={guide?.description}
      icon={Building2}
      estimatedTime={guide?.totalEstimatedTime}
      difficulty={guide?.difficulty as 'Easy' | 'Medium' | 'Hard'}
      steps={guide?.steps}
      requirements={uniqueRequirements}
      tips={guide?.steps?.flatMap((step) => step.tips || [])}
    />
  );
};

export default UnifiedGuide;
