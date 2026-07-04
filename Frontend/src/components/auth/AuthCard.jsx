import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthCard({ mode }) {
  const navigate = useNavigate();
  const isLogin = mode === "login";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        layout: {
          type: "spring",
          stiffness: 250,
          damping: 26,
        },
      }}
      className="w-full max-w-md overflow-hidden rounded-[32px] border border-gray-200/80 bg-white p-8 shadow-[0_30px_80px_rgba(0,0,0,.08)] dark:border-white/10 dark:bg-slate-900"
    >
      {/* ---------- Login / Register Switch ---------- */}

      <div className="mb-8">
        <div className="relative flex rounded-2xl bg-slate-100 p-1 dark:bg-slate-800">
          {/* Sliding Indicator */}
          <motion.div
            layoutId="auth-switch"
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 30,
            }}
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl bg-white shadow-md dark:bg-slate-700 ${
              isLogin ? "left-1" : "left-[calc(50%+2px)]"
            }`}
          />

          <button
            onClick={() => navigate("/login")}
            className={`relative z-10 flex-1 rounded-xl py-3 text-sm font-semibold transition-colors ${
              isLogin ? "text-[#5B4BFF]" : "text-muted"
            }`}
          >
            Log In
          </button>

          <button
            onClick={() => navigate("/register")}
            className={`relative z-10 flex-1 rounded-xl py-3 text-sm font-semibold transition-colors ${
              !isLogin ? "text-[#5B4BFF]" : "text-muted"
            }`}
          >
            Register
          </button>
        </div>
      </div>

      {/* ---------- Heading ---------- */}

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          <h2 className="text-3xl font-bold text-ink">
            {isLogin ? "Welcome Back" : "Create Your Account"}
          </h2>

          <p className="mt-3 text-muted">
            {isLogin
              ? "Sign in to continue your SkillSyncAI journey."
              : "Join SkillSyncAI and let AI guide your career path."}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* ---------- Form ---------- */}

      <motion.div
        layout
        transition={{
          type: "spring",
          stiffness: 280,
          damping: 30,
        }}
      >
        {isLogin ? <LoginForm /> : <RegisterForm />}
      </motion.div>
    </motion.div>
  );
}