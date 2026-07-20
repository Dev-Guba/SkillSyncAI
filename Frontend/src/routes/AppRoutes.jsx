import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout.jsx'
import DashboardLayout from '../layouts/DashboardLayout.jsx'
import LandingPage from '../pages/LandingPage.jsx'
import AuthPage from "../pages/AuthPage";
import SkillsPage from '../pages/SkillsPage.jsx'
import DashboardPage from '../pages/DashboardPage.jsx'
import SettingsPage from '../pages/SettingsPage.jsx'
import ProfileSetupPage from "../pages/ProfileSetupPage";

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
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}