import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, AlertCircle, IdCard, Loader2, Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API } from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx";

import Input from "../components/common/Input";
import Select from "../components/common/Select";
import Textarea from "../components/common/Textarea";
import Button from "../components/common/Button";
import EmailVerifiedBadge from "../components/common/EmailVerifiedBadge";
import LocationSelect from "../components/common/LocationSelect";
import ProfilePhotoField from "../components/profile/ProfilePhotoField";
import SchoolSelect from "../components/common/SchoolSelect";
import { RESEARCH_SCHOOL } from "../data/cebuSchools";
import {
  normalizePhPhone,
  formatPhPhone,
  PHONE_EXAMPLE,
  PHONE_ERROR,
} from "../utils/phone";
import AuthLayout from "../components/auth/AuthLayout";

const GENDER_OPTIONS = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [programs, setPrograms] = useState([]);
  const [programsLoading, setProgramsLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    school: RESEARCH_SCHOOL, // fixed: the study runs only at UCLM
    email: "",
    phone_number: "",
    birth_date: "",
    gender: "",
    program_id: "",
    location: "",
    bio: "",
  });

  // Optional photo or character (data URL), uploaded after the profile is created
  const [picture, setPicture] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // The email confirmed at sign-up (null for older accounts made before
  // sign-up asked for an email).
  const [verifiedEmail, setVerifiedEmail] = useState(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  useEffect(() => {
    let active = true;

    API.getEmailStatus()
      .then((res) => {
        if (!active) return;
        const status = res.data?.data;
        if (!status || status.has_profile) return;

        if (status.email && !status.verified) {
          // Signed up but hasn't entered the code yet
          navigate("/verify-email?next=%2Fprofile-setup", { replace: true });
          return;
        }

        if (status.verified && status.email) {
          setVerifiedEmail(status.email);
          setForm((prev) => (prev.email ? prev : { ...prev, email: status.email }));
        }
      })
      .catch(() => {
        // older accounts: just type the email as before
      });

    return () => {
      active = false;
    };
  }, [navigate]);

  const emailIsVerified =
    Boolean(verifiedEmail) &&
    form.email.trim().toLowerCase() === verifiedEmail;

  const fetchPrograms = async () => {
    try {
      setProgramsLoading(true);

      const response = await API.getAllPrograms();

      setPrograms(response.data.data);
    } catch (error) {
      console.error("Failed to fetch programs:", error);
    } finally {
      setProgramsLoading(false);
    }
  };

  const PROGRAM_OPTIONS = programs.map((program) => ({
    value: program.program_id,
    label: `${program.program_code} - ${program.program_name}`,
  }));

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  // #18: Basic email and phone validation
  const validateForm = () => {
    const nextErrors = {};

    if (!form.first_name.trim()) {
      nextErrors.first_name = "First name is required.";
    }

    if (!form.last_name.trim()) {
      nextErrors.last_name = "Last name is required.";
    }

    const trimmedEmail = form.email.trim();
    if (!trimmedEmail) {
      nextErrors.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      nextErrors.email = "Please enter a valid email address (e.g., student@school.edu).";
    }

    if (!form.phone_number.trim()) {
      nextErrors.phone_number = "Phone number is required.";
    } else if (!normalizePhPhone(form.phone_number)) {
      nextErrors.phone_number = PHONE_ERROR;
    }

    if (!form.program_id) {
      nextErrors.program_id = "Please select your program.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleContinue = async (e) => {
    e?.preventDefault();
    setFormError("");

    if (!validateForm()) {
      setFormError("Please check the highlighted fields.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await API.createUserProfile({
        ...form,
        email: form.email.trim(),
        phone_number: normalizePhPhone(form.phone_number),
      });
      const alreadyVerified = Boolean(response.data?.email_verified);

      localStorage.setItem(
        "selectedProgram",
        form.program_id
      );

      // Optional photo/character: uploaded now that the profile exists.
      // A failed upload doesn't stop setup; it can be added on My Profile.
      if (picture) {
        try {
          await API.updateProfilePicture(picture);
        } catch (uploadError) {
          console.error("Profile picture upload failed:", uploadError);
        }
      }

      // Load the new profile so the email check applies everywhere
      try {
        await refreshUser();
      } catch {
        // the verify page loads its own status
      }

      // Email confirmed at sign-up: straight on. Otherwise a code was just
      // sent to the address typed here.
      navigate(alreadyVerified ? "/skills" : "/verify-email?next=%2Fskills");
    } catch (error) {
      setFormError(
        error.response?.data?.message ||
          "Couldn't save your profile. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout mode="register" step={2}>
      <motion.form
        onSubmit={handleContinue}
        noValidate
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[640px] rounded-[32px] border border-border bg-surface p-6 shadow-soft-lg sm:p-8"
      >
        {/* Heading */}
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-soft"
          style={{ backgroundImage: "linear-gradient(135deg, #3B6FE0, #6E64DB)" }}
        >
          <IdCard className="h-7 w-7" />
        </div>
        <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-primary">
          Step 3 of 4
        </p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-ink">
          Complete your profile
        </h1>
        <p className="mt-2 text-sm text-muted">
          This helps us match you with the right careers and skills.
          Fields marked <span className="text-red-500">*</span> are required.
        </p>

        {formError && (
          <p
            role="alert"
            className="mt-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{formError}</span>
          </p>
        )}

        {/* Photo (optional) — the field has its own title and "Optional" note */}
        <div className="mt-6 rounded-2xl bg-surface-alt px-4 py-5">
          <ProfilePhotoField
            value={picture}
            onChange={setPicture}
            firstName={form.first_name}
            lastName={form.last_name}
          />
        </div>

        {/* About you */}
        <FormSection title="About you">
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label={<Req>First name</Req>}
              value={form.first_name}
              onChange={handleChange("first_name")}
              error={errors.first_name}
              autoComplete="given-name"
            />
            <Input
              label={<Req>Last name</Req>}
              value={form.last_name}
              onChange={handleChange("last_name")}
              error={errors.last_name}
              autoComplete="family-name"
            />
            <Input
              label="Birth date"
              type="date"
              value={form.birth_date}
              onChange={handleChange("birth_date")}
            />
            <Select
              label="Gender"
              value={form.gender}
              onChange={handleChange("gender")}
              options={GENDER_OPTIONS}
              placeholder="Select gender"
            />
          </div>
        </FormSection>

        {/* School & program */}
        <FormSection title="School & program">
          <div className="space-y-5">
            <SchoolSelect label="Current school" />
            <Select
              label={<Req>Program</Req>}
              value={form.program_id}
              onChange={handleChange("program_id")}
              options={PROGRAM_OPTIONS}
              disabled={programsLoading}
              error={errors.program_id}
              placeholder={programsLoading ? "Loading programs..." : "Select your program"}
            />
          </div>
        </FormSection>

        {/* Contact */}
        <FormSection title="Contact & location">
          <div className="space-y-5">
            <div>
              <Input
                label={<Req>Email</Req>}
                type="email"
                icon={Mail}
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange("email")}
                error={errors.email}
                autoComplete="email"
              />
              {verifiedEmail && !errors.email && (
                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted">
                  <EmailVerifiedBadge verified={emailIsVerified} />
                  <span>
                    {emailIsVerified
                      ? "Confirmed when you signed up."
                      : "A different email needs a new code after you continue."}
                  </span>
                </div>
              )}
            </div>

            <div>
              <Input
                label={<Req>Mobile number</Req>}
                type="tel"
                icon={Phone}
                inputMode="tel"
                autoComplete="tel-national"
                placeholder={PHONE_EXAMPLE}
                maxLength={20}
                value={form.phone_number}
                onChange={handleChange("phone_number")}
                onBlur={() => {
                  // Tidy a valid number into 0917 123 4567
                  const normalized = normalizePhPhone(form.phone_number);
                  if (normalized) {
                    setForm((prev) => ({ ...prev, phone_number: formatPhPhone(normalized) }));
                  }
                }}
                error={errors.phone_number}
              />
              {!errors.phone_number && (
                <p className="mt-1.5 text-xs text-muted">
                  Philippine mobile number (Globe, Smart, DITO, etc.).
                </p>
              )}
            </div>

            <LocationSelect value={form.location} onChange={handleChange("location")} />
          </div>
        </FormSection>

        {/* Bio */}
        <FormSection title="Short bio" hint="Optional">
          <Textarea
            placeholder="e.g. 3rd-year BSIT student who enjoys building web apps."
            value={form.bio}
            onChange={handleChange("bio")}
            maxLength={240}
          />
        </FormSection>

        {/* Continue */}
        <Button
          type="submit"
          className="mt-8 w-full py-3"
          icon={submitting ? undefined : ArrowRight}
          disabled={submitting}
        >
          {submitting ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Saving your profile...
            </span>
          ) : (
            "Continue"
          )}
        </Button>
        <p className="mt-3 text-center text-xs text-muted">
          Next: choose your skills. You can edit all of this later on My Profile.
        </p>
      </motion.form>
    </AuthLayout>
  );
}

// A titled group of fields, separated by a thin line
function FormSection({ title, hint, children }) {
  return (
    <section className="mt-7 border-t border-border pt-6">
      <div className="mb-4 flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wider text-ink">{title}</h2>
        {hint && <span className="text-xs text-muted">{hint}</span>}
      </div>
      {children}
    </section>
  );
}

// Field label with a red required marker
function Req({ children }) {
  return (
    <>
      {children} <span className="text-red-500" aria-hidden="true">*</span>
    </>
  );
}