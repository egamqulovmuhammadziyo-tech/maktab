import PublicNavbar from "../../components/public/Navbar";
import { AchievementsSection, Footer } from "../../components/public/Sections";

export default function AchievementsPage() {
  return (
    <div className="min-h-screen">
      <PublicNavbar />
      <AchievementsSection />
      <Footer />
    </div>
  );
}
