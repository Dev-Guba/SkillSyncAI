import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Lock,
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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleContinue = (e) => {
    e.preventDefault();

    // TODO: Register API here

    navigate("/profile-setup");
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
          placeholder="Choose a username"
          icon={User}
        />
      </motion.div>

      {/* Password */}

      <motion.div variants={item}>
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            icon={Lock}
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
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            icon={Lock}
          />

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