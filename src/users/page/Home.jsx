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
    <div className="min-h-screen bg-gradient-professional gradient-mesh relative">
      <Carousel />
      <MissionVision />
      <CalendarEvents />
      <Achievements />
    </div>
  );
};

export default Home;
