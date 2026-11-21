import { useEffect, useRef, useState } from "react";
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
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

import Button from "../common/Button";
import Input from "../common/Input";
import { API } from "../../api/api.js";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

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

  // 1: Enter email, 2: Enter 6-digit OTP, 3: Set new password, 4: Success
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [infoMessage, setInfoMessage] = useState("");
  const [errors, setErrors] = useState({});

  const otpInputRefs = useRef([]);

  // Countdown timer for Resend OTP button
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Auto-focus first OTP box when entering step 2
  useEffect(() => {
    if (step === 2) {
      otpInputRefs.current[0]?.focus();
    }
  }, [step]);

  const clearFieldError = (field) => {
    if (errors[field] || errors.form) {
      setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }));
    }
  };

  /* -------------------------------------------------------------------------- */
  /* STEP 1: REQUEST 6-DIGIT OTP TO EMAIL                                       */
  /* -------------------------------------------------------------------------- */
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setErrors({ email: "Email address is required." });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrors({ email: "Enter a valid email address." });
      return;
    }

    setErrors({});
    setInfoMessage("");
    setIsSubmitting(true);

    try {
      const response = await API.forgotPassword({ email: trimmedEmail });
      setInfoMessage(
        response.data?.message ||
          "If the email is registered, a 6-digit verification code has been sent."
      );
      setOtpDigits(Array(OTP_LENGTH).fill(""));
      setResendTimer(RESEND_COOLDOWN_SECONDS);
      setStep(2);
    } catch (error) {
      setErrors({
        form:
          error.response?.data?.message ||
          "Unable to send verification code. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* STEP 2: 6-DIGIT OTP INPUT HANDLERS & VERIFICATION                          */
  /* -------------------------------------------------------------------------- */
  const handleOtpChange = (index, rawValue) => {
    const digit = rawValue.replace(/\D/g, "").slice(-1);
    const nextDigits = [...otpDigits];
    nextDigits[index] = digit;
    setOtpDigits(nextDigits);
    clearFieldError("otp");

    if (digit && index < OTP_LENGTH - 1) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (otpDigits[index]) {
        const nextDigits = [...otpDigits];
        nextDigits[index] = "";
        setOtpDigits(nextDigits);
      } else if (index > 0) {
        otpInputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pasted) return;

    const nextDigits = Array(OTP_LENGTH).fill("");
    for (let i = 0; i < pasted.length; i += 1) {
      nextDigits[i] = pasted[i];
    }

    setOtpDigits(nextDigits);
    clearFieldError("otp");

    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    otpInputRefs.current[focusIndex]?.focus();
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0 || isResending) return;

    setErrors({});
    setInfoMessage("");
    setIsResending(true);

    try {
      const response = await API.forgotPassword({ email: email.trim() });
      setOtpDigits(Array(OTP_LENGTH).fill(""));
      setResendTimer(RESEND_COOLDOWN_SECONDS);
      setInfoMessage(
        response.data?.message || "A new 6-digit code has been sent to your email."
      );
      otpInputRefs.current[0]?.focus();
    } catch (error) {
      setErrors({
        form:
          error.response?.data?.message ||
          "Failed to resend code. Please try again.",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpCode = otpDigits.join("");

    if (otpCode.length < OTP_LENGTH) {
      setErrors({ otp: "Please enter the complete 6-digit verification code." });
      return;
    }

    setErrors({});
    setInfoMessage("");
    setIsSubmitting(true);

    try {
      const response = await API.verifyOTP({
        email: email.trim(),
        otp: otpCode,
      });

      const token = response.data?.resetToken;
      if (!token) {
        setErrors({
          form: "Verification succeeded, but no reset token was returned.",
        });
        return;
      }

      setResetToken(token);
      setStep(3);
    } catch (error) {
      setErrors({
        form:
          error.response?.data?.message ||
          "Invalid or expired verification code.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* STEP 3: RESET PASSWORD WITH RESET TOKEN                                    */
  /* -------------------------------------------------------------------------- */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const nextErrors = {};

    if (!newPassword.trim()) {
      nextErrors.newPassword = "New password is required.";
    } else if (newPassword.length < 8) {
      nextErrors.newPassword = "Password must be at least 8 characters.";
    }

    if (!confirmPassword.trim()) {
      nextErrors.confirmPassword = "Please confirm your new password.";
    } else if (confirmPassword !== newPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await API.resetPassword({
        resetToken,
        newPassword,
        confirmPassword,
      });
      setStep(4);
    } catch (error) {
      setErrors({
        form:
          error.response?.data?.message ||
          "Unable to reset password. Your reset session may have expired.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* STEP 4: SUCCESS VIEW                                                       */
  /* -------------------------------------------------------------------------- */
  if (step === 4) {
    return (
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mt-8 space-y-6 text-center"
      >
        <motion.div
          variants={item}
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-600 dark:bg-green-950/40 dark:text-green-400"
        >
          <CheckCircle2 size={28} />
        </motion.div>

        <motion.div variants={item} className="space-y-2">
          <h2 className="text-lg font-bold text-ink">Password Updated</h2>
          <p className="text-sm text-muted">
            Your password for{" "}
            <span className="font-semibold text-ink">{email.trim()}</span> has
            been reset successfully. You can now log in with your new password.
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

  const submitHandler =
    step === 1
      ? handleRequestOTP
      : step === 2
      ? handleVerifyOTP
      : handleResetPassword;

  const submitLabel = isSubmitting
    ? step === 1
      ? "Sending code..."
      : step === 2
      ? "Verifying..."
      : "Resetting password..."
    : step === 1
    ? "Send Verification Code"
    : step === 2
    ? "Verify Code"
    : "Reset Password";

  return (
    <motion.form
      key={`forgot-step-${step}`}
      variants={container}
      initial="hidden"
      animate="show"
      onSubmit={submitHandler}
      className="mt-6 space-y-5"
      noValidate
    >
      {/* Step Progress Indicator */}
      <motion.div variants={item} className="flex items-center gap-2">
        {[1, 2, 3].map((idx) => (
          <div
            key={idx}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              idx <= step ? "bg-primary" : "bg-surface-alt"
            }`}
          />
        ))}
      </motion.div>

      {/* Step Description */}
      <motion.p variants={item} className="text-sm text-muted">
        {step === 1 &&
          "Enter the email address registered to your account and we'll send a 6-digit verification code."}
        {step === 2 && (
          <>
            Enter the 6-digit code sent to{" "}
            <span className="font-semibold text-ink">{email.trim()}</span>. The
            code expires in 10 minutes.
          </>
        )}
        {step === 3 &&
          "Identity verified. Create a new password (at least 8 characters)."}
      </motion.p>

      {/* Info Banner */}
      {infoMessage && (
        <motion.div
          variants={item}
          className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary"
        >
          <ShieldCheck size={16} className="shrink-0" />
          <span>{infoMessage}</span>
        </motion.div>
      )}

      {/* Error Banner */}
      {errors.form && (
        <motion.div
          variants={item}
          className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
        >
          <AlertCircle size={16} className="shrink-0" />
          <span>{errors.form}</span>
        </motion.div>
      )}

      {/* STEP 1 FIELDS */}
      {step === 1 && (
        <motion.div variants={item}>
          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="you@gmail.com"
            icon={Mail}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearFieldError("email");
            }}
            error={errors.email}
            autoComplete="email"
          />
          {errors.email && (
            <p className="mt-1.5 text-sm text-red-500">{errors.email}</p>
          )}
        </motion.div>
      )}

      {/* STEP 2 FIELDS (6-DIGIT OTP) */}
      {step === 2 && (
        <motion.div variants={item} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-ink">
              6-Digit Verification Code
            </label>
            <div
              className="grid grid-cols-6 gap-2 sm:gap-2.5"
              onPaste={handleOtpPaste}
            >
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    otpInputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  aria-label={`Verification code digit ${index + 1}`}
                  className={`h-13 w-full rounded-xl border bg-surface-alt/60 text-center text-xl font-bold text-ink outline-none transition focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20 ${
                    errors.otp ? "border-red-400" : "border-border"
                  }`}
                />
              ))}
            </div>
            {errors.otp && (
              <p className="mt-2 text-sm text-red-500">{errors.otp}</p>
            )}
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted">Didn&apos;t receive the email?</span>
            <button
              type="button"
              disabled={resendTimer > 0 || isResending}
              onClick={handleResendOTP}
              className="inline-flex items-center gap-1.5 font-semibold text-primary transition hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={13}
                className={isResending ? "animate-spin" : ""}
              />
              {isResending
                ? "Resending..."
                : resendTimer > 0
                ? `Resend in ${resendTimer}s`
                : "Resend Code"}
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 3 FIELDS (NEW PASSWORD) */}
      {step === 3 && (
        <>
          <motion.div variants={item}>
            <div className="relative">
              <Input
                label="New Password"
                name="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                icon={Lock}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  clearFieldError("newPassword");
                }}
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
            <div className="relative">
              <Input
                label="Confirm New Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your new password"
                icon={Lock}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  clearFieldError("confirmPassword");
                }}
                error={errors.confirmPassword}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
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
        </>
      )}

      {/* Submit Button */}
      <motion.div variants={item} className="pt-1">
        <Button
          type="submit"
          className="w-full py-3"
          icon={ArrowRight}
          disabled={
            isSubmitting ||
            (step === 2 && otpDigits.join("").length < OTP_LENGTH)
          }
        >
          {submitLabel}
        </Button>
      </motion.div>

      {/* Back Link */}
      <motion.div variants={item} className="flex justify-center pt-1">
        <button
          type="button"
          onClick={() => {
            setErrors({});
            setInfoMessage("");
            if (step === 2) {
              setStep(1);
            } else if (step === 3) {
              setStep(1);
              setResetToken("");
            } else {
              navigate("/login");
            }
          }}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-primary"
        >
          <ArrowLeft size={15} />
          {step === 1 ? "Back to Log In" : "Use a different email"}
        </button>
      </motion.div>
    </motion.form>
  );
}