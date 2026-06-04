import PublicNavbar from "../../components/public/Navbar";
import { AboutSection, Footer } from "../../components/public/Sections";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <PublicNavbar />
      <AboutSection />
      <Footer />
    </div>
  );
}
