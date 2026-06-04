import PublicNavbar from '../../components/public/Navbar';
import HeroSection from '../../components/public/HeroSection';
import {
  StatsSection,
  AboutSection,
  TeachersSection,
  NewsSection,
  AnnouncementsSection,
  AchievementsSection,
  GallerySection,
  ContactSection,
  Footer,
} from '../../components/public/Sections';

export default function PublicHome() {
  return (
    <div className="min-h-screen">
      <PublicNavbar />
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <TeachersSection />
      <NewsSection />
      <AnnouncementsSection />
      <AchievementsSection />
      <GallerySection />
      <ContactSection />
      <Footer />
    </div>
  );
}
