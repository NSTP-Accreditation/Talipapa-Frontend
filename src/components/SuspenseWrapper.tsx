import React, { Suspense } from 'react';
import { FullPageSpinner } from './LoadingSkeletons';

interface SuspenseWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const SuspenseWrapper: React.FC<SuspenseWrapperProps> = ({
  children,
  fallback = <FullPageSpinner />,
}) => {
  return <Suspense fallback={fallback}>{children}</Suspense>;
};

export default SuspenseWrapper;
