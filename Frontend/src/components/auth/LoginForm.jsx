import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
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
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.form
      variants={container}
      initial="hidden"
      animate="show"
      className="mt-10 space-y-5"
    >
      <motion.div variants={item}>
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          icon={Mail}
        />
      </motion.div>

      <motion.div variants={item}>

        <div className="relative">

          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            icon={Lock}
          />

          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-4 top-[42px] text-muted hover:text-[#5B4BFF]"
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>

        </div>

      </motion.div>

      <motion.div
        variants={item}
        className="flex justify-end"
      >
        <button
          type="button"
          className="text-sm font-medium text-[#5B4BFF] hover:underline"
        >
          Forgot password?
        </button>
      </motion.div>

      <motion.div variants={item}>

        <Button
          className="w-full py-3"
          icon={ArrowRight}
        >
          Log In
        </Button>

      </motion.div>

    </motion.form>
  );
}