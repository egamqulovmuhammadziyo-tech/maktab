import PublicNavbar from "../../components/public/Navbar";
import { NewsSection, Footer } from "../../components/public/Sections";

export default function NewsPage() {
  return (
    <div className="min-h-screen">
      <PublicNavbar />
      <NewsSection />
      <Footer />
    </div>
  );
}
