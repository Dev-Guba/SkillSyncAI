import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

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

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    username: "",
    password: "",
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
    }

    if (!formData.password.trim()) {
      nextErrors.password = "Password is required.";
    }

    return nextErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await login(formData);
      const user = response.user;
      console.log(user);
      if (!user.UserProfile) {
        navigate("/profile-setup");
        return;
      }

      if (!user.SkillSets || user.SkillSets.length === 0) {
        navigate("/skills");
        return;
      }
      navigate("/dashboard");
    } catch (error) {
      setErrors({
        form:
          error.response?.data?.message ||
          "Invalid username or password.",
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
      onSubmit={handleSubmit}
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
            placeholder="Enter your password"
            icon={Lock}
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="current-password"
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
        {errors.password && (
          <p className="mt-1.5 text-sm text-red-500">{errors.password}</p>
        )}
      </motion.div>

      <motion.div variants={item} className="flex justify-end">
        <button
          type="button"
          onClick={() => navigate("/forgot-password")}
          className="text-sm font-medium text-primary hover:underline"
        >
          Forgot password?
        </button>
      </motion.div>

      <motion.div variants={item}>
        <Button
          type="submit"
          className="w-full py-3"
          icon={ArrowRight}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Log In"}
        </Button>
      </motion.div>
    </motion.form>
  );
}