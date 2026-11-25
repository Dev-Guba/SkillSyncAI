import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import MainLayout from "../layouts/MainLayout.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import LandingPage from "../pages/LandingPage.jsx";
import AuthPage from "../pages/AuthPage";
import SkillsPage from "../pages/SkillsPage.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";
import SettingsPage from "../pages/SettingsPage.jsx";
import ProfileSetupPage from "../pages/ProfileSetupPage";
import ProfilePage from "../pages/ProfilePage";
import SkillGapPage from "../pages/SkillGapPage";
import RecommendedSkillsPage from "../pages/RecommendedSkillsPage";
import JobsPage from "../pages/JobsPage";
import JobDetailsPage from "../pages/JobDetailsPage";
import CareerRoadmapPage from "../pages/CareerRoadmapPage";
import CurriculumAlignmentPage from "../pages/CurriculumAlignmentPage";
import VerifyEmailPage from "../pages/VerifyEmailPage";

// Admin Pages
import AdminDashboardPage from "../pages/AdminDashboardPage.jsx";
import AdminUsersPage from "../pages/AdminUsersPage.jsx";
import AdminSkillsPage from "../pages/AdminSkillsPage.jsx";
import AdminInterestsPage from "../pages/AdminInterestsPage.jsx";
import AdminMappingsPage from "../pages/AdminMappingsPage.jsx";
import AdminJobsPage from "../pages/AdminJobsPage.jsx";
import AdminCatalogPage from "../pages/AdminCatalogPage.jsx";
import AdminSettingsPage from "../pages/AdminSettingsPage.jsx";
import AdminCurriculumPage from "../pages/AdminCurriculumPage.jsx";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Admin pages: only role 1. Others are sent to their dashboard (the pages
// used to open for anyone logged in, and every data request then failed
// with "Admins only").
const ADMIN_ROLE_ID = 1;

function RequireAdmin({ children }) {
  const { user } = useAuth();

  if (Number(user?.role_id) !== ADMIN_ROLE_ID) {
    return <Navigate to="/dashboard" replace state={{ adminOnly: true }} />;
  }

  return children;
}

// Users who have a profile but haven't confirmed its email are sent to
// /verify-email first, then back to where they were going.
function RequireVerifiedEmail({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  const profile = user?.UserProfile;

  if (profile && !profile.email_verified_at) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/verify-email?next=${next}`} replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route
        path="/forgot-password"
        element={<AuthPage mode="forgot-password" />}
      />

      <Route
        path="/profile-setup"
        element={
          <ProtectedRoute>
            <ProfileSetupPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/verify-email"
        element={
          <ProtectedRoute>
            <VerifyEmailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/skills"
        element={
          <ProtectedRoute>
            <RequireVerifiedEmail>
              <SkillsPage />
            </RequireVerifiedEmail>
          </ProtectedRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <RequireVerifiedEmail>
              <DashboardLayout />
            </RequireVerifiedEmail>
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/profile" element={<ProfilePage />} />
        <Route path="/dashboard/skill-gap" element={<SkillGapPage />} />
        <Route
          path="/dashboard/recommendations"
          element={<RecommendedSkillsPage />}
        />
        <Route path="/dashboard/jobs" element={<JobsPage />} />
        <Route path="/dashboard/jobs/:id" element={<JobDetailsPage />} />
        <Route path="/dashboard/roadmap" element={<CareerRoadmapPage />} />
        <Route
          path="/dashboard/curriculum"
          element={<CurriculumAlignmentPage />}
        />
        <Route path="/dashboard/settings" element={<SettingsPage />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/skills" element={<AdminSkillsPage />} />
        <Route path="/admin/interests" element={<AdminInterestsPage />} />
        <Route path="/admin/mappings" element={<AdminMappingsPage />} />
        <Route path="/admin/jobs" element={<AdminJobsPage />} />
        <Route path="/admin/catalog" element={<AdminCatalogPage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />
        <Route path="/admin/curriculum" element={<AdminCurriculumPage />} />
      </Route>
    </Routes>
  );
}