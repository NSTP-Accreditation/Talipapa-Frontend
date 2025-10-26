import Carousel from '../components/Carousel';
import MissionVision from '../components/MissionVision';
import Achievements from '../components/Achievement';
import CalendarEvents from '../components/CalendarEvents';
import { useLoadingState } from '../../hooks/useLoadingState';
import { HomePageSkeleton } from '../../components/LoadingSkeletons';

const Home = () => {
  // Add loading state with 1 second display
  const { isLoading } = useLoadingState(1000);

  // Show loading skeleton while loading
  if (isLoading) {
    return <HomePageSkeleton />;
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
