import Carousel from '../components/Carousel';
import MissionVision from '../components/MissionVision';
import Achievements from '../components/Achievement';
import CalendarEvents from '../components/CalendarEvents';
import { useLoadingState } from '../../hooks/useLoadingState';
import { ResponsiveSkeleton } from '../../components/ResponsiveSkeleton';

const Home = () => {
  const { isLoading } = useLoadingState(1000);

  if (isLoading) {
    return <ResponsiveSkeleton page="home" />;
  }

  return (
    <div className="min-h-screen bg-gradient-professional gradient-mesh relative">
      <Carousel />
      <MissionVision />
      <CalendarEvents />
      <Achievements />

export default Home;
