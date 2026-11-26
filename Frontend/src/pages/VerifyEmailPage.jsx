import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MailCheck, RefreshCw, ArrowRight, AlertCircle, Mail, Info, Loader2 } from "lucide-react";

import AuthLayout from "@/components/auth/AuthLayout";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { API } from "@/api/api.js";
import { useAuth } from "@/context/AuthContext";

const CODE_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

// Only allow redirects inside the app
function safeNext(value, fallback) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : fallback;
}

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshUser } = useAuth();
  const next = safeNext(searchParams.get("next"), "/dashboard");

  const [status, setStatus] = useState(null); // from /email/status
  const [loading, setLoading] = useState(true);
  const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(""));
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [changing, setChanging] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  const inputs = useRef([]);

  const loadStatus = useCallback(async () => {
    try {
      const res = await API.getEmailStatus();
      setStatus(res.data?.data || null);
      return res.data?.data || null;
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't load your email status.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatus().then((data) => {
      // Already verified and nothing pending: carry on
      if (data?.verified && !data.pending_email) {
        navigate(next, { replace: true });
      }
    });
  }, [loadStatus, navigate, next]);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const id = setInterval(() => setCooldown((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const target = status?.code_sent_to || status?.pending_email || status?.email;

  const setDigit = (index, raw) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    const copy = [...digits];
    copy[index] = digit;
    setDigits(copy);
    setError("");
    if (digit && index < CODE_LENGTH - 1) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const copy = Array(CODE_LENGTH).fill("");
    [...pasted].forEach((d, i) => (copy[i] = d));
    setDigits(copy);
    inputs.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus();
  };

  const sendCode = async (email) => {
    setError("");
    setInfo("");
    setResending(true);
    try {
      const res = await API.sendEmailCode(email);
      setInfo(res.data?.message || "We sent you a new code.");
      setDigits(Array(CODE_LENGTH).fill(""));
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setChanging(false);
      setNewEmail("");
      await loadStatus();
      inputs.current[0]?.focus();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't send the code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < CODE_LENGTH) {
      setError("Enter all 6 digits from the email.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await API.verifyEmailCode(code);
      try {
        await refreshUser();
      } catch {
        // the next page will load the user again
      }
      navigate(next, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "That code didn't work. Please try again.");
      setDigits(Array(CODE_LENGTH).fill(""));
      inputs.current[0]?.focus();
    } finally {
      setSubmitting(false);
    }
  };

  const isEmailChange = Boolean(status?.pending_email);

  // Signing up (no profile yet): show the sign-up steps with "Verify your
  // email" as the current one. Email changes later show the features panel.
  const isSignup = !status || status.has_profile === false;
  const filledCount = digits.filter(Boolean).length;

  return (
    <AuthLayout mode={isSignup ? "register" : "login"} step={1}>
      <div className="w-full max-w-[460px] rounded-[32px] border border-border bg-surface p-6 shadow-soft-lg sm:p-8">
        {/* Icon + heading */}
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-soft"
          style={{ backgroundImage: "linear-gradient(135deg, #3B6FE0, #6E64DB)" }}
        >
          <MailCheck className="h-7 w-7" />
        </div>

        {isSignup && !isEmailChange && (
          <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-primary">
            Step 2 of 4
          </p>
        )}

        <h1 className={`${isSignup && !isEmailChange ? "mt-1" : "mt-5"} text-3xl font-extrabold tracking-tight text-ink`}>
          {isEmailChange ? "Confirm your new email" : "Check your email"}
        </h1>

        {loading ? (
          <p className="mt-3 flex items-center gap-2 text-sm text-muted">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading...
          </p>
        ) : (
          <>
            <p className="mt-2 text-sm text-muted">
              {target
                ? "We sent a 6-digit code to:"
                : "Send a code to your email to continue."}
            </p>

            {target && !changing && (
              <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface-alt px-4 py-3">
                <span className="flex min-w-0 items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-primary" />
                  <span className="truncate text-sm font-semibold text-ink" title={target}>
                    {target}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setChanging(true);
                    setError("");
                    setInfo("");
                  }}
                  className="shrink-0 text-xs font-semibold text-primary hover:underline"
                >
                  Change
                </button>
              </div>
            )}

            {isEmailChange && !changing && (
              <p className="mt-2 text-xs text-muted">Your email changes once it&apos;s confirmed.</p>
            )}
          </>
        )}

        {info && (
          <p className="mt-4 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary" role="status">
            {info}
          </p>
        )}

        {error && (
          <p className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400" role="alert">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </p>
        )}

        {changing ? (
          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              sendCode(newEmail.trim());
            }}
          >
            <Input
              label="Correct email address"
              type="email"
              icon={Mail}
              autoComplete="email"
              placeholder="you@gmail.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              autoFocus
            />
            <div className="flex gap-3">
              <Button type="button" variant="ghost" onClick={() => setChanging(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1 py-3"
                disabled={resending || !newEmail.trim()}
              >
                {resending ? "Sending..." : "Send code"}
              </Button>
            </div>
          </form>
        ) : (
          <form className="mt-6 space-y-5" onSubmit={handleVerify}>
            <div>
              <p className="mb-2 text-sm font-medium text-ink">Enter the code</p>
              <div className="grid grid-cols-6 gap-2 sm:gap-2.5" onPaste={handlePaste}>
                {digits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    maxLength={1}
                    value={digit}
                    onChange={(e) => setDigit(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    aria-label={`Digit ${index + 1}`}
                    className={`h-14 w-full rounded-2xl border-2 text-center text-2xl font-bold text-ink outline-none transition focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/15 ${
                      digit ? "border-primary/60 bg-primary/5" : "border-border bg-surface-alt"
                    }`}
                  />
                ))}
              </div>
              {/* progress: how many digits are in */}
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-border" aria-hidden="true">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(filledCount / CODE_LENGTH) * 100}%`,
                    backgroundImage: "linear-gradient(90deg, #3B6FE0, #6E64DB)",
                  }}
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              icon={submitting ? undefined : ArrowRight}
              className="w-full py-3"
              disabled={submitting || filledCount < CODE_LENGTH}
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Verifying...
                </span>
              ) : (
                "Verify email"
              )}
            </Button>

            <p className="text-center text-sm text-muted">
              Didn&apos;t get it?{" "}
              <button
                type="button"
                onClick={() => sendCode(isEmailChange ? status.pending_email : undefined)}
                disabled={resending || cooldown > 0}
                className="inline-flex items-center gap-1 font-semibold text-primary hover:underline disabled:cursor-not-allowed disabled:text-muted disabled:no-underline"
              >
                {resending && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
              </button>
            </p>

            <div className="flex items-start gap-2.5 rounded-2xl bg-surface-alt px-4 py-3 text-xs text-muted">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                Can&apos;t find it? Check your <span className="font-semibold text-ink">Spam</span> or{" "}
                <span className="font-semibold text-ink">Promotions</span> folder. Codes expire after 15 minutes.
              </span>
            </div>

            {isEmailChange && (
              <p className="text-center text-xs text-muted">
                Changed your mind?{" "}
                <button
                  type="button"
                  onClick={() => navigate(next, { replace: true })}
                  className="font-semibold text-primary hover:underline"
                >
                  Keep {status.email}
                </button>
              </p>
            )}
          </form>
        )}
      </div>
    </AuthLayout>
  );
}
