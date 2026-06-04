import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import PublicHome from "./pages/public/PublicHome";
import StatsPage from "./pages/public/StatsPage";
import AboutPage from "./pages/public/AboutPage";
import TeachersPage from "./pages/public/TeachersPage";
import NewsPage from "./pages/public/NewsPage";
import AnnouncementsPage from "./pages/public/AnnouncementsPage";
import AchievementsPage from "./pages/public/AchievementsPage";
import GalleryPage from "./pages/public/GalleryPage";
import ContactPage from "./pages/public/ContactPage";
import LoginPage from "./pages/admin/LoginPage";
import AdminLayout from "./pages/admin/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import { TeachersAdminPage } from "./pages/admin/TeachersAdminPage";
import { NewsAdminPage } from "./pages/admin/NewsAdminPage";
import {
  AnnouncementsAdminPage,
  AchievementsAdminPage,
  GalleryAdminPage,
} from "./pages/admin/OtherAdminPages";
import { ContactsAdminPage } from "./pages/admin/ContactsAdminPage";
import { ScheduleAdminPage } from "./pages/admin/ScheduleAdminPage";
import { UsersAdminPage } from "./pages/admin/UsersAdminPage";
import { SettingsAdminPage } from "./pages/admin/SettingsAdminPage";
import { RequireAuth } from "./components/RequireAuth";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Ommaviy sayt */}
          <Route path="/" element={<PublicHome />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/teachers" element={<TeachersPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Admin */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="teachers" element={<TeachersAdminPage />} />
            <Route path="news" element={<NewsAdminPage />} />
            <Route path="announcements" element={<AnnouncementsAdminPage />} />
            <Route path="contacts" element={<ContactsAdminPage />} />
            <Route path="schedule" element={<ScheduleAdminPage />} />
            <Route path="achievements" element={<AchievementsAdminPage />} />
            <Route path="gallery" element={<GalleryAdminPage />} />
            <Route path="users" element={<UsersAdminPage />} />
            <Route path="settings" element={<SettingsAdminPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
