import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout.jsx'
import DashboardLayout from '../layouts/DashboardLayout.jsx'
import LandingPage from '../pages/LandingPage.jsx'
import AuthPage from "../pages/AuthPage";
import SkillsPage from '../pages/SkillsPage.jsx'
import DashboardPage from '../pages/DashboardPage.jsx'
import SettingsPage from '../pages/SettingsPage.jsx'
import ProfileSetupPage from "../pages/ProfileSetupPage";
import ProfilePage from "../pages/ProfilePage";
import SkillGapPage from "../pages/SkillGapPage";
import RecommendedSkillsPage from "../pages/RecommendedSkillsPage";
import JobsPage from "../pages/JobsPage";
import JobDetailsPage from "../pages/JobDetailsPage";
import CareerRoadmapPage from "../pages/CareerRoadmapPage";
import CurriculumAlignmentPage from "../pages/CurriculumAlignmentPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      <Route
  path="/login"
  element={<AuthPage mode="login" />}
/>

<Route
  path="/register"
  element={<AuthPage mode="register" />}
/>
      <Route path="/profile-setup" element={<ProfileSetupPage />} />
      <Route path="/skills" element={<SkillsPage />} />

<Route element={<DashboardLayout />}>
  <Route
    path="/dashboard"
    element={<DashboardPage />}
  />

  <Route
    path="/dashboard/profile"
    element={<ProfilePage />}
  />

  <Route
    path="/dashboard/skill-gap"
    element={<SkillGapPage />}
  />

  <Route
    path="/dashboard/recommendations"
    element={<RecommendedSkillsPage />}
  />

  <Route
    path="/dashboard/jobs"
    element={<JobsPage />}
  />

  <Route
    path="/dashboard/jobs/:id"
    element={<JobDetailsPage />}
  />

  <Route
    path="/dashboard/roadmap"
    element={<CareerRoadmapPage />}
  />

  <Route
    path="/dashboard/curriculum"
    element={<CurriculumAlignmentPage />}
  />

  <Route
    path="/dashboard/settings"
    element={<SettingsPage />}
  />
</Route>
    </Routes>
  )
}