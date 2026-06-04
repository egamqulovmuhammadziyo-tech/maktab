import PublicNavbar from "../../components/public/Navbar";
import { AnnouncementsSection, Footer } from "../../components/public/Sections";

export default function AnnouncementsPage() {
  return (
    <div className="min-h-screen">
      <PublicNavbar />
      <AnnouncementsSection />
      <Footer />
    </div>
  );
}
