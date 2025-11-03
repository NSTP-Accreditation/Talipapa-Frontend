import Carousel from '../components/Carousel';
import MissionVision from '../components/MissionVision';
import Achievements from '../components/Achievement';
import CalendarEvents from '../components/CalendarEvents';
import { useLoadingState } from '../../hooks/useLoadingState';
import { ResponsiveSkeleton } from '../../components/ResponsiveSkeleton';
import { useEffect } from "react";

const Home = () => {
  const { isLoading } = useLoadingState(1000);

  // ✅ Load AdSense script only on this page
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6522127776748676";
    script.crossOrigin = "anonymous";
    document.body.appendChild(script);

    // optional cleanup when leaving page
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // ✅ Trigger ad rendering when script loads
  useEffect(() => {
    if (window.adsbygoogle) {
      try {
        window.adsbygoogle.push({});
      } catch (e) {
        console.error("Adsbygoogle push error:", e);
      }
    }
  }, []);

  if (isLoading) {
    return <ResponsiveSkeleton page="home" />;
  }

  return (
    <div className="min-h-screen bg-gradient-professional gradient-mesh relative">
      <Carousel />
      <MissionVision />
      <CalendarEvents />
      <Achievements />

      {/* ✅ Place your AdSense ad container below (change slot ID to yours) */}
      <div className="flex justify-center my-6">
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-6522127776748676"
          data-ad-slot="4640713503"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>
    </div>
  );
};

export default Home;
