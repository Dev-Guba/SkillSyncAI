import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import AuthLeftPanel from "./AuthLeftPanel";
import AuthCard from "./AuthCard";

export default function AuthLayout({ mode }) {
  const navigate = useNavigate();

  return (
    <section
      className="
        relative
        h-screen
        overflow-hidden
        bg-white
        dark:bg-[#0F172A]
      "
    >

      {/* Background glow */}
      <div
        className="
          pointer-events-none
          absolute
          -left-40
          top-20
          h-[500px]
          w-[500px]
          rounded-full
          bg-primary/10
          blur-[140px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          right-0
          h-[450px]
          w-[450px]
          rounded-full
          bg-violet-500/10
          blur-[160px]
        "
      />


      {/* Back */}

      <button
        onClick={() => navigate("/")}
        className="
          absolute
          left-6
          top-6
          z-20
          flex
          items-center
          gap-2
          rounded-xl
          px-4
          py-2
          text-sm
          font-medium
          text-muted
          transition
          hover:bg-surface-alt
          hover:text-primary
        "
      >
        <ArrowLeft size={18}/>
        Back
      </button>



      <div
        className="
          relative
          mx-auto
          flex
          h-full
          max-w-7xl
          items-center
        "
      >

        {/* LEFT */}
        <div
          className="
            hidden
            lg:flex
            h-full
            w-1/2
          "
        >
          <AuthLeftPanel />
        </div>


        {/* RIGHT */}

        <div
          className="
            flex
            h-full
            w-full
            items-center
            justify-center
            px-5
            lg:w-1/2
          "
        >
          <AuthCard mode={mode}/>
        </div>


      </div>

    </section>
  );
}