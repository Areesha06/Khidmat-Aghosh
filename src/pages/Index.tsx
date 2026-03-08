import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import HeroSlider from "@/components/sections/HeroSlider";
import StatsSection from "@/components/sections/StatsSection";
import AboutSection from "@/components/sections/AboutSection";
import ProgramsSection from "@/components/sections/ProgramsSection";
import DonateSection from "@/components/sections/DonateSection";
import EventsSection from "@/components/sections/EventsSection";

import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const slides = [
  {
    image: hero1,
    title: "Every Child Deserves a Future",
    subtitle: "Nurturing dreams, building tomorrow",
  },
  {
    image: hero2,
    title: "Where Love Finds a Home",
    subtitle: "Creating a sanctuary for growth",
  },
  {
    image: hero3,
    title: "Together We Rise",
    subtitle: "Join us in making a difference",
  },
];

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSlider slides={slides} />
      <StatsSection />
      <AboutSection />
      <ProgramsSection />
      <DonateSection />
      <EventsSection />
      <Footer />
    </main>
  );
};

export default Index;
