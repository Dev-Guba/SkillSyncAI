import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
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

export default function RegisterForm() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role_id: 3,
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
      const { confirmPassword, ...payload } = formData;

      await register(payload);

      navigate("/profile-setup");
    } catch (error) {
      setErrors({
        form:
          error.response?.data?.message || "Failed to create account.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      variants={container}
      initial="hidden"
      animate="show"
      onSubmit={handleContinue}
      className="mt-10 space-y-5"
      noValidate
    >
      {errors.form && (
        <motion.div
          variants={item}
          className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
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
          placeholder="Enter your username"
          icon={User}
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          autoComplete="username"
        />
        {errors.username && (
          <p className="mt-1.5 text-sm text-red-500">{errors.username}</p>
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
        {errors.password ? (
          <p className="mt-1.5 text-sm text-red-500">{errors.password}</p>
        ) : (
          <p className="mt-1.5 text-sm text-muted">
            Must be at least 8 characters.
          </p>
        )}
      </motion.div>

      {/* Confirm Password */}
      <motion.div variants={item}>
        <div className="relative">
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
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
        {errors.confirmPassword && (
          <p className="mt-1.5 text-sm text-red-500">
            {errors.confirmPassword}
          </p>
        )}
      </motion.div>

      {/* Continue */}
      <motion.div variants={item}>
        <Button
          type="submit"
          className="w-full py-3"
          icon={ArrowRight}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating account..." : "Continue"}
        </Button>
      </motion.div>
    </motion.form>
  );
}