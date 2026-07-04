import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logos/logo.png";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    // TODO: replace with the real login API call
    navigate("/dashboard");
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center p-5">
      {/* Glow */}
      <div className="absolute w-125 h-125 rounded-full bg-violet-500/20 blur-[140px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="relative w-full max-w-md rounded-[30px] bg-linear-to-b from-white to-violet-50 dark:from-surface dark:to-surface-alt p-10 shadow-[0_30px_80px_rgba(0,0,0,.15)]"
      >
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <Link to="/">
            <img
              src={logo}
              alt="SkillSyncAI"
              className="mb-5 h-16 w-16 object-contain"
            />
          </Link>

          <h2 className="text-3xl font-bold text-ink">Welcome Back</h2>

          <p className="mt-2 text-center text-muted">
            Sign in to continue using SkillSyncAI
          </p>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="mb-2 block text-sm font-medium text-ink">Email</label>

          <div className="flex h-14 items-center rounded-2xl border border-border px-4 transition focus-within:border-[#5B4BFF] focus-within:ring-4 focus-within:ring-violet-100">
            <Mail className="mr-3 h-5 w-5 text-muted" />
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-transparent outline-none"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="mb-2 block text-sm font-medium text-ink">Password</label>

          <div className="flex h-14 items-center rounded-2xl border border-border px-4 transition focus-within:border-[#5B4BFF] focus-within:ring-4 focus-within:ring-violet-100">
            <Lock className="mr-3 h-5 w-5 text-muted" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full bg-transparent outline-none"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-muted hover:text-primary" />
              ) : (
                <Eye className="h-5 w-5 text-muted hover:text-primary" />
              )}
            </button>
          </div>
        </div>

        {/* Forgot Password */}
        <div className="mt-3 text-right">
          <button type="button" className="text-sm font-medium text-primary hover:underline">
            Forgot Password?
          </button>
        </div>

        {/* Login Button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogin}
          className="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-[#5B4BFF] to-[#7A5CFF] text-white font-semibold shadow-[0_15px_40px_rgba(91,75,255,.35)]"
        >
          Log In
          <ArrowRight className="w-4 h-4" />
        </motion.button>

        {/* Register */}
        <p className="mt-8 text-center text-sm text-muted">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </section>
  );
}