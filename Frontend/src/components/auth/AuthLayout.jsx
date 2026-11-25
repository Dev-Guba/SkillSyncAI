import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import AuthLeftPanel from "./AuthLeftPanel";
import AuthCard from "./AuthCard";
import BrandLogo from "@/components/common/BrandLogo";

/*
| Log in / Register / Forgot password shell.
| - Large screens: brand panel on the left, form card on the right.
| - Small screens: logo + form only.
| The page scrolls (it used to be fixed to the screen height with scrolling
| off, which cut off the Register form on shorter laptop screens).
*/
// children: a custom card (e.g. Verify Email) instead of the Log in /
// Register card. step: current sign-up step shown on the brand panel.
export default function AuthLayout({ mode, step = 0, children }) {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen overflow-x-hidden bg-[#F8F8FF] dark:bg-[#0F172A]">
      {/* Soft background glow in the logo's lavender */}
      <div className="pointer-events-none absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-[#A9A2F0]/20 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-[#C9C4F8]/30 blur-[160px]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl gap-8 p-4 sm:p-6 lg:p-8">
        {/* LEFT: brand panel (large screens) */}
        {/* Stays in view while a long form (e.g. profile setup) scrolls */}
        <div className="sticky top-8 hidden h-[calc(100vh-4rem)] w-[46%] shrink-0 self-start lg:flex">
          <AuthLeftPanel mode={mode} step={step} />
        </div>

        {/* RIGHT: form */}
        <div className="flex w-full flex-col lg:w-[54%]">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-muted transition hover:bg-surface hover:text-primary"
            >
              <ArrowLeft size={18} />
              Back to home
            </button>

            {/* Logo on small screens, where the brand panel is hidden */}
            <div className="lg:hidden">
              <BrandLogo className="h-9 w-auto max-w-[150px] object-contain" />
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center py-8">
            {children || <AuthCard mode={mode} />}
          </div>
        </div>
      </div>
    </section>
  );
}
