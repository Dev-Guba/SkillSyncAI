import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Check,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Button from "../common/Button";
import Input from "../common/Input";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  show: {
    opacity: 1,
    y: 0,
  },
};

/*
| Password guidance. Only the 8-character minimum is required (the server
| enforces it); the rest raise the strength score.
*/
const STRENGTH_LABELS = ["Too short", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = ["bg-red-500", "bg-red-500", "bg-amber-500", "bg-lime-500", "bg-green-500"];

function passwordStrength(password) {
  const checks = [
    { label: "At least 8 characters", met: password.length >= 8, required: true },
    { label: "Upper & lowercase letters", met: /[a-z]/.test(password) && /[A-Z]/.test(password) },
    { label: "A number", met: /\d/.test(password) },
    { label: "A symbol (e.g. ! @ #)", met: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks[0].met ? checks.filter((c) => c.met).length : 0;
  return { score, checks };
}

export default function RegisterForm() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // (The role is decided by the server; sign-up always creates a student.)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name] || errors.form) {
      setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }));
    }
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.username.trim()) {
      nextErrors.username = "Username is required.";
    } else if (formData.username.trim().length < 3) {
      nextErrors.username = "Username must be at least 3 characters.";
    }

    if (!formData.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password.trim()) {
      nextErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    if (!formData.confirmPassword.trim()) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    return nextErrors;
  };

  const handleContinue = async (e) => {
    e.preventDefault();

    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const { confirmPassword: _confirm, ...payload } = formData;

      await register({ ...payload, email: payload.email.trim() });

      // A code was just emailed; confirm it before profile setup
      navigate("/verify-email?next=%2Fprofile-setup");
    } catch (error) {
      setErrors({
        form:
          error.response?.data?.message || "Failed to create account.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const strength = passwordStrength(formData.password);
  const passwordsMatch =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  return (
    <motion.form
      variants={container}
      initial="hidden"
      animate="show"
      onSubmit={handleContinue}
      className="mt-6 space-y-5"
      noValidate
    >
      {errors.form && (
        <motion.div
          variants={item}
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
        >
          <AlertCircle size={16} className="shrink-0" />
          <span>{errors.form}</span>
        </motion.div>
      )}

      {/* Username */}
      <motion.div variants={item}>
        <Input
          label="Username"
          name="username"
          type="text"
          placeholder="e.g. juan.delacruz"
          icon={User}
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          autoComplete="username"
          maxLength={50}
        />
      </motion.div>

      {/* Email */}
      <motion.div variants={item}>
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="you@gmail.com"
          icon={Mail}
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
        />
        {!errors.email && (
          <p className="mt-1.5 text-xs text-muted">
            We&apos;ll send a 6-digit code to confirm it.
          </p>
        )}
      </motion.div>

      {/* Password */}
      <motion.div variants={item}>
        <div className="relative">
          <Input
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            icon={Lock}
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="new-password"
            aria-describedby="password-strength"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-[42px] text-muted transition-colors hover:text-primary"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* One simple line: a thin strength bar once they start typing */}
        <div id="password-strength" className="mt-2" aria-live="polite">
          {formData.password ? (
            <div className="flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border" aria-hidden="true">
                <div
                  className={`h-full rounded-full transition-all ${STRENGTH_COLORS[strength.score]}`}
                  style={{ width: `${Math.max(strength.score, 1) * 25}%` }}
                />
              </div>
              <span className="text-xs font-medium text-muted">
                {STRENGTH_LABELS[strength.score]}
              </span>
            </div>
          ) : (
            <p className="text-xs text-muted">At least 8 characters.</p>
          )}
        </div>
      </motion.div>

      {/* Confirm Password */}
      <motion.div variants={item}>
        <div className="relative">
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Type it again"
            icon={Lock}
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-[42px] text-muted transition-colors hover:text-primary"
            aria-label={
              showConfirmPassword ? "Hide password" : "Show password"
            }
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {!errors.confirmPassword && passwordsMatch && (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400" aria-live="polite">
            <Check size={13} />
            Passwords match
          </p>
        )}
      </motion.div>

      {/* Continue */}
      <motion.div variants={item} className="pt-1">
        <Button
          type="submit"
          className="w-full py-3"
          icon={isSubmitting ? undefined : ArrowRight}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              Creating account...
            </span>
          ) : (
            "Create account"
          )}
        </Button>
      </motion.div>

      <motion.p variants={item} className="text-center text-sm text-muted">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="font-semibold text-primary hover:underline"
        >
          Log in
        </button>
      </motion.p>
    </motion.form>
  );
}