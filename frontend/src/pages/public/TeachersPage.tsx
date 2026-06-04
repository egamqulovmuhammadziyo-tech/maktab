import PublicNavbar from "../../components/public/Navbar";
import { TeachersSection, Footer } from "../../components/public/Sections";

export default function TeachersPage() {
  return (
    <div className="min-h-screen">
      <PublicNavbar />
      <TeachersSection />
      <Footer />
    </div>
  );
}
