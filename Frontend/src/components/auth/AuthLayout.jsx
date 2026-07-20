import AuthLeftPanel from "./AuthLeftPanel";
import AuthCard from "./AuthCard";

export default function AuthLayout({ mode }) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-white dark:bg-[#0F172A]">

      {/* Background Glow */}
      <div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-[160px]" />
      <div className="absolute right-0 bottom-0 h-[450px] w-[450px] rounded-full bg-indigo-500/10 blur-[180px]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl">

        {/* LEFT */}
        <div className="hidden lg:flex w-1/2">
          <AuthLeftPanel />
        </div>

        {/* RIGHT */}
        <div className="flex w-full lg:w-1/2 items-center justify-center px-8 py-12">
          <AuthCard mode={mode} />
        </div>

      </div>
    </section>
  );
}