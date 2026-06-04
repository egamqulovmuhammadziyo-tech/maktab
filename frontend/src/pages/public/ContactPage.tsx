import PublicNavbar from "../../components/public/Navbar";
import { ContactSection, Footer } from "../../components/public/Sections";

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <PublicNavbar />
      <ContactSection />
      <Footer />
    </div>
  );
}
