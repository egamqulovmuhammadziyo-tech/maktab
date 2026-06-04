import PublicNavbar from "../../components/public/Navbar";
import { StatsSection, Footer } from "../../components/public/Sections";

export default function StatsPage() {
  return (
    <div className="min-h-screen">
      <PublicNavbar />
      <StatsSection />
      <Footer />
    </div>
  );
}
