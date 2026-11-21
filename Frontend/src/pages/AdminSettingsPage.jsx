import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Palette,
  RotateCcw,
  LogOut,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import ThemeToggle from "@/components/common/ThemeToggle";
import Button from "@/components/common/Button";
import ResetPasswordSettings from "@/components/settings/ResetPasswordSettings";
import { useAuth } from "@/context/AuthContext";

const ADMIN_LOCAL_KEYS = [
  "skillsync_admin_users",
  "skillsync_admin_custom_skills",
  "skillsync_admin_custom_interests",
  "skillsync_admin_program_mappings",
];

export default function AdminSettingsPage() {
  const navigate = useNavigate();
  const { user, logout, setAdminMode } = useAuth();
  const [cleared, setCleared] = useState(false);

  const handleResetOverrides = () => {
    ADMIN_LOCAL_KEYS.forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch {
        // ignore storage errors
      }
    });
    setCleared(true);
    setTimeout(() => setCleared(false), 3500);
  };

  const handleLogout = () => {
    setAdminMode?.(false);
    logout();
    navigate("/login");
  };

  return (
    <section className="space-y-6 p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Admin • Preferences
        </p>
        <h1 className="mt-1 text-3xl font-bold text-ink">Admin Settings</h1>
        <p className="mt-1 text-sm text-muted">
          Manage appearance, password recovery, frontend workspace overrides,
          and your active session.
        </p>
      </div>

      {/* Appearance */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-surface p-6 shadow-soft sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
            <Palette className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-ink">Appearance</h2>
            <p className="mt-0.5 text-sm text-muted">
              Switch between light and dark mode across the Admin Console.
            </p>
          </div>
        </div>

        <ThemeToggle />
      </div>

      {/* Password & Recovery (6-Digit Gmail OTP) */}
      <ResetPasswordSettings />

      {/* Local Overrides Reset */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-surface p-6 shadow-soft sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
            <RotateCcw className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-ink">
              Reset Frontend Workspace Overrides
            </h2>
            <p className="mt-0.5 max-w-xl text-sm text-muted">
              Clears locally saved admin edits (users, custom skills, interests,
              and program mappings) so pages reload fresh from the backend APIs.
            </p>
            {cleared && (
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
                Local overrides cleared successfully.
              </p>
            )}
          </div>
        </div>

        <Button
          type="button"
          variant="secondary"
          icon={RotateCcw}
          onClick={handleResetOverrides}
          className="shrink-0"
        >
          Reset Overrides
        </Button>
      </div>

      {/* Session */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-surface p-6 shadow-soft sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-ink">Admin Session</h2>
            <p className="mt-0.5 text-sm text-muted">
              Signed in as{" "}
              <span className="font-semibold text-ink">
                @{user?.username || "admin"}
              </span>
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          icon={LogOut}
          onClick={handleLogout}
          className="shrink-0 text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          Log Out
        </Button>
      </div>
    </section>
  );
}