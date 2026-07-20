import { Outlet } from "react-router-dom";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardMobileNav from "@/components/dashboard/DashboardMobileNav";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-surface text-ink">
      <DashboardSidebar />

      <div className="flex flex-1 flex-col">
        <DashboardMobileNav />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}