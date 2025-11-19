import React, { useEffect, useState } from 'react';
import {
  MobileSkeleton,
  PageLoadingSkeleton,
  DashboardSkeleton,
  GreenPagesSkeleton,
  TradingPageSkeleton,
  GuidelinesPageSkeleton,
  HomePageSkeleton,
  AboutUsPageSkeleton,
  AdminAboutUsSkeleton,
  InventoryPageSkeleton,
  NewsEventsPageSkeleton,
  AchievementsPageSkeleton,
  ActivityLogsPageSkeleton,
  SettingsPageSkeleton,
  FormTablePageSkeleton,
} from './LoadingSkeletons';
import type { ComponentType } from 'react';

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= breakpoint;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    try {
      media.addEventListener('change', handler);
    } catch (err) {
      // older browsers
      // @ts-ignore
      media.addListener(handler);
    }
    setIsMobile(media.matches);
    return () => {
      try {
        media.removeEventListener('change', handler);
      } catch (err) {
        // @ts-ignore
        media.removeListener(handler);
      }
    };
  }, [breakpoint]);

  return isMobile;
};

// ResponsiveSkeleton component: renders mobile skeleton on small viewports,
// and page-specific desktop skeletons on larger viewports.
export const ResponsiveSkeleton: React.FC<{ page?: string }> = ({ page }) => {
  const isMobile = useIsMobile();
  const key = (page || '').toLowerCase();

  if (isMobile) return <MobileSkeleton page={page} />;

  switch (key) {
    case 'dashboard':
      return <DashboardSkeleton />;
    case 'greenpages':
    case 'green-pages':
      return <GreenPagesSkeleton />;
    case 'trading':
      return <TradingPageSkeleton />;
    case 'guidelines':
      return <GuidelinesPageSkeleton />;
    case 'home':
    case 'homepage':
      return <HomePageSkeleton />;
    case 'aboutus':
    case 'about-us':
      return <AboutUsPageSkeleton />;
    case 'aboutus-admin':
    case 'about-us-admin':
      return <AdminAboutUsSkeleton />;
    case 'inventory':
      return <InventoryPageSkeleton />;
    case 'news':
    case 'newsandevents':
    case 'news-events':
      return <NewsEventsPageSkeleton />;
    case 'achievements':
      return <AchievementsPageSkeleton />;
    case 'settings':
      return <SettingsPageSkeleton />;
    case 'activitylogs':
    case 'activity-logs':
      return <ActivityLogsPageSkeleton />;
    case 'formtable':
    case 'records':
    case 'earnpoints':
      return <FormTablePageSkeleton />;
    default:
      return <PageLoadingSkeleton />;
  }
};

// hook: simple helper that returns the appropriate skeleton element for a page
export const useResponsiveSkeleton = (page?: string) => {
  return <ResponsiveSkeleton page={page} />;
};

// HOC: withResponsiveSkeleton(pageKey, propName = 'loading')
// Wrap a page component so that when the named prop is truthy, the skeleton is shown.
export function withResponsiveSkeleton<P extends Record<string, any>>(
  pageKey: string,
  propName: string = 'loading'
) {
  return (WrappedComponent: ComponentType<P>): React.FC<P> => {
    const WithSkeleton: React.FC<P> = (props) => {
      // @ts-ignore - dynamic prop access
      const isLoading = !!props[propName];
      if (isLoading) return <ResponsiveSkeleton page={pageKey} />;
      return <WrappedComponent {...props} />;
    };

    // copy displayName for easier debugging
    const wrappedName =
      WrappedComponent.displayName || WrappedComponent.name || 'Component';
    WithSkeleton.displayName = `withResponsiveSkeleton(${wrappedName})`;

    return WithSkeleton;
  };
}

export default ResponsiveSkeleton;
