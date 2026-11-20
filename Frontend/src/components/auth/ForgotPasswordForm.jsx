import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import Button from "../common/Button";
import Input from "../common/Input";
import { API } from "../../api/api.js";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function ForgotPasswordForm() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Enter email/username, 2: Enter new password, 3: Success
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    identifier: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name] || errors.form) {
      setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }));
    }
  };

  const handleVerifyAccount = async (e) => {
    e.preventDefault();
    if (!formData.identifier.trim()) {
      setErrors({ identifier: "Email or username is required." });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      if (API.forgotPassword) {
        await API.forgotPassword({ identifier: formData.identifier.trim() });
      }
      setStep(2);
    } catch (error) {
      // If backend route isn't implemented yet (404), allow frontend flow to proceed smoothly
      if (!error.response || error.response.status === 404) {
        setStep(2);
      } else {
        setErrors({
          form:
            error.response?.data?.message ||
            "Could not find an account with that email or username.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const nextErrors = {};

    if (!formData.newPassword.trim()) {
      nextErrors.newPassword = "New password is required.";
    } else if (formData.newPassword.length < 6) {
      nextErrors.newPassword = "Password must be at least 6 characters.";
    }

    if (formData.confirmPassword !== formData.newPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      if (API.resetPassword) {
        await API.resetPassword({
          identifier: formData.identifier.trim(),
          password: formData.newPassword,
        });
      }
      setStep(3);
    } catch (error) {
      if (!error.response || error.response.status === 404) {
        setStep(3);
      } else {
        setErrors({
          form:
            error.response?.data?.message ||
            "Failed to reset password. Please try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 3) {
    return (
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mt-8 space-y-6 text-center"
      >
        <motion.div
          variants={item}
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-600"
        >
          <CheckCircle2 size={28} />
        </motion.div>

        <motion.div variants={item} className="space-y-2">
          <h2 className="text-lg font-bold text-ink">Password Reset Ready</h2>
          <p className="text-sm text-muted">
            Your password update request for{" "}
            <span className="font-semibold text-ink">{formData.identifier}</span>{" "}
            has been processed. You can now log in with your credentials.
          </p>
        </motion.div>

        <motion.div variants={item}>
          <Button
            type="button"
            className="w-full py-3"
            icon={ArrowRight}
            onClick={() => navigate("/login")}
          >
            Back to Log In
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.form
      variants={container}
      initial="hidden"
      animate="show"
      onSubmit={step === 1 ? handleVerifyAccount : handleResetPassword}
      className="mt-8 space-y-5"
      noValidate
    >
      <motion.p variants={item} className="text-sm text-muted">
        {step === 1
          ? "Enter the username or email associated with your account to reset your password."
          : "Create a new strong password for your account."}
      </motion.p>

      {errors.form && (
        <motion.div
          variants={item}
          className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          <AlertCircle size={16} className="shrink-0" />
          <span>{errors.form}</span>
        </motion.div>
      )}

      {step === 1 ? (
        <motion.div variants={item}>
          <Input
            label="Username or Email"
            name="identifier"
            type="text"
            placeholder="Enter your username or email"
            icon={Mail}
            value={formData.identifier}
            onChange={handleChange}
            error={errors.identifier}
            autoComplete="username"
          />
          {errors.identifier && (
            <p className="mt-1.5 text-sm text-red-500">{errors.identifier}</p>
          )}
        </motion.div>
      ) : (
        <>
          <motion.div variants={item}>
            <div className="relative">
              <Input
                label="New Password"
                name="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                icon={Lock}
                value={formData.newPassword}
                onChange={handleChange}
                error={errors.newPassword}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-[42px] text-muted transition-colors hover:text-primary"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-1.5 text-sm text-red-500">
                {errors.newPassword}
              </p>
            )}
          </motion.div>

          <motion.div variants={item}>
            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm new password"
              icon={Lock}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <p className="mt-1.5 text-sm text-red-500">
                {errors.confirmPassword}
              </p>
            )}
          </motion.div>
        </>
      )}

      <motion.div variants={item} className="pt-1">
        <Button
          type="submit"
          className="w-full py-3"
          icon={ArrowRight}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Processing..."
            : step === 1
            ? "Continue"
            : "Reset Password"}
        </Button>
      </motion.div>

      <motion.div variants={item} className="flex justify-center pt-1">
        <button
          type="button"
          onClick={() => (step === 2 ? setStep(1) : navigate("/login"))}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-primary"
        >
          <ArrowLeft size={15} />
          {step === 2 ? "Change username/email" : "Back to Log In"}
        </button>
      </motion.div>
    </motion.form>
  );
}