import { useEffect, useRef, useState } from "react";
import {
  KeyRound,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { useAuth } from "@/context/AuthContext";
import { API } from "@/api/api.js";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

export default function ResetPasswordSettings() {
  const { user } = useAuth();
  const defaultEmail = user?.UserProfile?.email || user?.email || "";

  const [isOpen, setIsOpen] = useState(false);
  // 1: Enter email, 2: Enter 6-digit OTP, 3: New password, 4: Success
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState(defaultEmail);
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

  useEffect(() => {
    if (defaultEmail && !email) {
      setEmail(defaultEmail);
    }
  }, [defaultEmail, email]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  useEffect(() => {
    if (isOpen && step === 2) {
      otpInputRefs.current[0]?.focus();
    }
  }, [isOpen, step]);

  const clearFieldError = (field) => {
    if (errors[field] || errors.form) {
      setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }));
    }
  };

  const resetFlow = (closePanel = false) => {
    setStep(1);
    setEmail(defaultEmail);
    setOtpDigits(Array(OTP_LENGTH).fill(""));
    setResetToken("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({});
    setInfoMessage("");
    setResendTimer(0);
    if (closePanel) setIsOpen(false);
  };

  /* STEP 1: SEND 6-DIGIT OTP */
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

  /* STEP 2: OTP INPUTS & VERIFY */
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
        response.data?.message ||
          "A new 6-digit code has been sent to your email."
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

  /* STEP 3: SAVE NEW PASSWORD */
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

  const submitHandler =
    step === 1
      ? handleRequestOTP
      : step === 2
      ? handleVerifyOTP
      : handleResetPassword;

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
      {/* Header Row */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-ink">
              Password &amp; Recovery
            </h2>
            <p className="mt-0.5 text-sm text-muted">
              Forgot or want to reset your password? Verify via a 6-digit Gmail
              code.
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant={isOpen ? "ghost" : "secondary"}
          icon={isOpen ? ChevronUp : ChevronDown}
          onClick={() => {
            if (isOpen) {
              resetFlow(true);
            } else {
              setIsOpen(true);
            }
          }}
          className="shrink-0"
        >
          {isOpen ? "Close" : "Reset Password"}
        </Button>
      </div>

      {/* Expandable 6-Digit OTP Flow */}
      {isOpen && (
        <div className="mt-6 border-t border-border pt-6">
          {step === 4 ? (
            <div className="flex flex-col items-center space-y-4 py-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-600 dark:bg-green-950/40 dark:text-green-400">
                <CheckCircle2 size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-ink">
                  Password Updated
                </h3>
                <p className="text-sm text-muted">
                  Your password for{" "}
                  <span className="font-semibold text-ink">{email.trim()}</span>{" "}
                  has been reset successfully.
                </p>
              </div>
              <Button
                type="button"
                variant="primary"
                onClick={() => resetFlow(true)}
              >
                Done
              </Button>
            </div>
          ) : (
            <form
              onSubmit={submitHandler}
              className="max-w-md space-y-4"
              noValidate
            >
              {/* Step Indicator */}
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      idx <= step ? "bg-primary" : "bg-surface-alt"
                    }`}
                  />
                ))}
              </div>

              <p className="text-xs text-muted">
                {step === 1 &&
                  "Step 1 of 3 — Enter your registered email to receive a 6-digit verification code."}
                {step === 2 && (
                  <>
                    Step 2 of 3 — Enter the 6-digit code sent to{" "}
                    <span className="font-semibold text-ink">
                      {email.trim()}
                    </span>{" "}
                    (expires in 10 minutes).
                  </>
                )}
                {step === 3 &&
                  "Step 3 of 3 — Create your new password (minimum 8 characters)."}
              </p>

              {infoMessage && (
                <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
                  <ShieldCheck size={16} className="shrink-0" />
                  <span>{infoMessage}</span>
                </div>
              )}

              {errors.form && (
                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errors.form}</span>
                </div>
              )}

              {/* STEP 1 */}
              {step === 1 && (
                <div>
                  <Input
                    label="Registered Email"
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
                    <p className="mt-1.5 text-sm text-red-500">
                      {errors.email}
                    </p>
                  )}
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="space-y-3">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-ink">
                      6-Digit Verification Code
                    </label>
                    <div
                      className="grid grid-cols-6 gap-2"
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
                          onChange={(e) =>
                            handleOtpChange(index, e.target.value)
                          }
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          aria-label={`Verification code digit ${index + 1}`}
                          className={`h-12 w-full rounded-xl border bg-surface-alt/60 text-center text-lg font-bold text-ink outline-none transition focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20 ${
                            errors.otp ? "border-red-400" : "border-border"
                          }`}
                        />
                      ))}
                    </div>
                    {errors.otp && (
                      <p className="mt-1.5 text-sm text-red-500">
                        {errors.otp}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted">
                      Didn&apos;t receive the code?
                    </span>
                    <button
                      type="button"
                      disabled={resendTimer > 0 || isResending}
                      onClick={handleResendOTP}
                      className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-50"
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
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
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
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="mt-1.5 text-sm text-red-500">
                        {errors.newPassword}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="relative">
                      <Input
                        label="Confirm New Password"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter new password"
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
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1.5 text-sm text-red-500">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button
                  type="submit"
                  variant="primary"
                  icon={ArrowRight}
                  disabled={
                    isSubmitting ||
                    (step === 2 && otpDigits.join("").length < OTP_LENGTH)
                  }
                >
                  {isSubmitting
                    ? "Processing..."
                    : step === 1
                    ? "Send 6-Digit Code"
                    : step === 2
                    ? "Verify Code"
                    : "Update Password"}
                </Button>

                {step > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => resetFlow(false)}
                  >
                    Start Over
                  </Button>
                )}
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}