import Carousel from '../components/Carousel';
import MissionVision from '../components/MissionVision';
import Achievements from '../components/Achievement';
import CalendarEvents from '../components/CalendarEvents';
import { useLoadingState } from '../../hooks/useLoadingState';
import { PageLoadingSkeleton } from '../../components/LoadingSkeletons';

const Home = () => {
  // Add loading state with minimum 2 second display
  const { isLoading } = useLoadingState(2000);

  // Show loading skeleton while loading
  if (isLoading) {
    return <PageLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Breadcrumb */}
      <div className="bg-white px-6 py-4 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm font-semibold text-green-700">
            <span className="flex items-center gap-2">🏠 Home</span>
          </nav>
        </div>
      </div>

      <Carousel />
      <MissionVision />
      <CalendarEvents />
      <Achievements />
    </div>
  );
};

export default Home;
