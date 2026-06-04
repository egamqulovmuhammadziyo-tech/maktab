import PublicNavbar from "../../components/public/Navbar";
import { GallerySection, Footer } from "../../components/public/Sections";

export default function GalleryPage() {
  return (
    <div className="min-h-screen">
      <PublicNavbar />
      <GallerySection />
      <Footer />
    </div>
  );
}
