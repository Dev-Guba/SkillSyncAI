import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  User,
  Hash,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logos/logo.png";
import { useAuth } from "../../context/AuthContext";

export default function RegisterModal({ open, onClose }) {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role_id: 3,
  });

  const handleCreateAccount = async () => {
    try {
      await register(formData);

      onClose();
      navigate("/user-profile");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to create account."
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (open) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
      window.__lenis?.stop();
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
      window.__lenis?.start();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-md p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="absolute w-130 h-130 rounded-full bg-violet-500/20 blur-[140px]" />

          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 25,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 25,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 22,
            }}
            className="relative w-full max-w-md rounded-[30px] bg-linear-to-b from-white to-violet-50 dark:from-surface dark:to-surface-alt p-10 shadow-[0_30px_80px_rgba(0,0,0,.15)]"
          >
            {/* Close */}

            <button
              onClick={onClose}
              className="absolute right-6 top-6 rounded-full p-2 hover:bg-surface-alt"
            >
              <X className="w-5 h-5 text-muted" />
            </button>

            {/* Logo */}

            <div className="mb-8 flex flex-col items-center">
              <img
                src={logo}
                alt="SkillSyncAI"
                className="mb-5 h-16 w-16 object-contain"
              />

              <h2 className="text-3xl font-bold text-ink">
                Create Account
              </h2>

              <p className="mt-2 text-center text-muted">
                Start your AI-powered career journey today.
              </p>
            </div>

            {/* Name */}
            {/* User ID */}

          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium">
              User Label as: 
            </label>

            <div className="flex h-14 items-center rounded-2xl border border-border bg-surface-alt px-4">
              <Hash className="mr-3 h-5 w-5 text-muted" />

              <input
                type="text"
                value="Student"
                readOnly
                className="w-full bg-transparent text-muted outline-none cursor-not-allowed"
              />
            </div>
          </div>

            {/* Username */}

          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium">
              Username
            </label>

            <div className="flex h-14 items-center rounded-2xl border border-border px-4 transition focus-within:border-[#5B4BFF] focus-within:ring-4 focus-within:ring-violet-100">
              <User className="mr-3 h-5 w-5 text-muted" />

              <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              className="w-full bg-transparent outline-none"
            />
            </div>
          </div>
            {/* Password */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Password
              </label>

              <div className="flex h-14 items-center rounded-2xl border border-border px-4 transition focus-within:border-[#5B4BFF] focus-within:ring-4 focus-within:ring-violet-100">
                <Lock className="mr-3 h-5 w-5 text-muted" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-muted hover:text-primary" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted hover:text-primary" />
                  )}
                </button>
              </div>
            </div>

            {/* Create Button */}

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreateAccount}
              className="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-[#5B4BFF] to-[#7A5CFF] font-semibold text-white shadow-[0_15px_40px_rgba(91,75,255,.35)]"
            >
              Create Account
              <ArrowRight className="h-4 w-4" />
            </motion.button>

            {/* Login */}

            <p className="mt-8 text-center text-sm text-muted">
              Already have an account?{" "}

              <Link
                to="/login"
                onClick={onClose}
                className="font-semibold text-primary hover:underline"
              >
                Log In
              </Link>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}