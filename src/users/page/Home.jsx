import Carousel from '../components/Carousel';
import MissionVision from '../components/MissionVision';
import Achievements from '../components/Achievement';
import CalendarEvents from '../components/CalendarEvents';
import { useLoadingState } from '../../hooks/useLoadingState';
import { ResponsiveSkeleton } from '../../components/ResponsiveSkeleton';

const Home = () => {
  // Add loading state with 1 second display
  const { isLoading } = useLoadingState(1000);

  // Show loading skeleton while loading (responsive: mobile compact, desktop page-specific)
  if (isLoading) {
    return <ResponsiveSkeleton page="home" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-blue-50/20 relative">
      {/* Unified background with subtle patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-100/20 via-transparent to-transparent pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent pointer-events-none"></div>

      {/* Content with consistent spacing */}
      <div className="relative">
        <Carousel />
        <MissionVision />
        <CalendarEvents />
        <Achievements />
      </div>
    </div>
  );
};

export default Home;
