import { Outlet } from "react-router-dom";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardMobileNav from "@/components/dashboard/DashboardMobileNav";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-surface text-ink">
      <DashboardSidebar />

      <div className="flex flex-1 flex-col">
        <DashboardMobileNav />
        <main className="flex-1 overflow-x-hidden">
          <div className="mx-auto w-full max-w-7xl">
    <Outlet />
</div>
        </main>
      </div>
    </div>
  );
}