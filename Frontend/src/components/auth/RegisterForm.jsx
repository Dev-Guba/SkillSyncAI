import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext.jsx"
import {
  User,
  Lock,
  Hash,
  Eye,
  EyeOff,
  ArrowRight,
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

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
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
};

  const handleContinue = async (e) => {
    e.preventDefault();

    setErrors({});

    if (!formData.username.trim()) {
        return setErrors({
            username: "Username is required.",
        });
    }

    if (!formData.password.trim()) {
        return setErrors({
            password: "Password is required.",
        });
    }

    if (formData.password !== formData.confirmPassword) {
        return setErrors({
            confirmPassword: "Passwords do not match.",
        });
    }

    try {
        const { confirmPassword, ...payload } = formData;

        await register(payload);

        navigate("/profile-setup");
    } catch (error) {
        alert(
            error.response?.data?.message ||
            "Failed to create account."
        );
    }
};

  return (
    <motion.form
      variants={container}
      initial="hidden"
      animate="show"
      onSubmit={handleContinue}
      className="mt-10 space-y-5"
    >
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
        />
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
        />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-[42px] text-muted hover:text-[#5B4BFF]"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
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
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirmPassword}
            </p>
          )}
          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
            className="absolute right-4 top-[42px] text-muted hover:text-[#5B4BFF]"
          >
            {showConfirmPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>
      </motion.div>

      {/* Continue */}

      <motion.div variants={item}>
        <Button
          type="submit"
          className="w-full py-3"
          icon={ArrowRight}
        >
          Continue
        </Button>
      </motion.div>
    </motion.form>
  );
}