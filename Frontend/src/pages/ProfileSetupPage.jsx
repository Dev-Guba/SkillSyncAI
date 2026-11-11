import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API } from "../api/api.js";

import Input from "../components/common/Input";
import Select from "../components/common/Select";
import Textarea from "../components/common/Textarea";
import Button from "../components/common/Button";
import logo from "../assets/logos/logo.png";

const GENDER_OPTIONS = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[\d\s\-()]{7,15}$/;

export default function ProfileSetupPage() {
  const navigate = useNavigate();

  const [programs, setPrograms] = useState([]);
  const [programsLoading, setProgramsLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    school: "",
    email: "",
    phone_number: "",
    birth_date: "",
    gender: "",
    program_id: "",
    location: "",
    bio: "",
  });

  useEffect(() => {
    fetchPrograms();
  }, []);

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

    if (!form.school.trim()) {
      nextErrors.school = "Current school is required.";
    }

    const trimmedEmail = form.email.trim();
    if (!trimmedEmail) {
      nextErrors.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      nextErrors.email = "Please enter a valid email address (e.g., student@school.edu).";
    }

    const trimmedPhone = form.phone_number.trim();
    const digitsOnly = trimmedPhone.replace(/\D/g, "");
    if (!trimmedPhone) {
      nextErrors.phone_number = "Phone number is required.";
    } else if (
      !PHONE_REGEX.test(trimmedPhone) ||
      digitsOnly.length < 7 ||
      digitsOnly.length > 15
    ) {
      nextErrors.phone_number = "Please enter a valid phone number (e.g., 09171234567).";
    }

    if (!form.program_id) {
      nextErrors.program_id = "Please select your program.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleContinue = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await API.createUserProfile({
        ...form,
        email: form.email.trim(),
        phone_number: form.phone_number.trim(),
      });

      localStorage.setItem(
        "selectedProgram",
        form.program_id
      );

      navigate("/skills");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to save profile."
      );
    }
  };

  return (
    <section className="min-h-screen bg-white dark:bg-surface">
      <div className="mx-auto max-w-3xl px-6 py-12">

        {/* Logo */}
        <div className="flex justify-center">
          <img
            src={logo}
            alt="SkillSyncAI"
            className="h-14 w-14"
          />
        </div>

        {/* Progress */}
        <div className="mt-8">
          <p className="text-center text-sm font-semibold text-primary">
            Step 2 of 3
          </p>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-border">
            <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-[#5B4BFF] to-[#7A5CFF]" />
          </div>
        </div>

        {/* Heading */}
        <div className="mt-8 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-violet-100">
            <User className="h-10 w-10 text-primary" />
          </div>

          <h1 className="text-4xl font-bold text-ink">
            Complete Your Profile
          </h1>

          <p className="mt-3 text-muted">
            Tell us a little about yourself before we personalize your
            experience.
          </p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 rounded-3xl border border-border bg-surface p-8 shadow-lg"
        >
          {/* Name */}
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="First Name"
              value={form.first_name}
              onChange={handleChange("first_name")}
              error={errors.first_name}
            />

            <Input
              label="Last Name"
              value={form.last_name}
              onChange={handleChange("last_name")}
              error={errors.last_name}
            />
          </div>

          {/* Current School */}
          <div className="mt-5">
            <Input
              label="Current School"
              placeholder="Enter your current school"
              value={form.school}
              onChange={handleChange("school")}
              error={errors.school}
            />
          </div>

          {/* Email */}
          <div className="mt-5">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange("email")}
              error={errors.email}
            />
          </div>

          {/* Phone Number */}
          <div className="mt-5">
            <Input
              label="Phone Number"
              type="tel"
              placeholder="09171234567"
              value={form.phone_number}
              onChange={handleChange("phone_number")}
              error={errors.phone_number}
            />
          </div>

          {/* Birth Date & Gender */}
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Input
              label="Birth Date"
              type="date"
              value={form.birth_date}
              onChange={handleChange("birth_date")}
            />

            <Select
              label="Gender"
              value={form.gender}
              onChange={handleChange("gender")}
              options={GENDER_OPTIONS}
            />
          </div>

          {/* Program */}
          <div className="mt-5">
            <Select
              label="Program"
              value={form.program_id}
              onChange={handleChange("program_id")}
              options={PROGRAM_OPTIONS}
              disabled={programsLoading}
              error={errors.program_id}
              placeholder={
                programsLoading
                  ? "Loading programs..."
                  : "Select your program"
              }
            />
          </div>

          {/* Location */}
          <div className="mt-5">
            <Input
              label="Location"
              value={form.location}
              onChange={handleChange("location")}
            />
          </div>

          {/* Bio */}
          <div className="mt-5">
            <Textarea
              label="Bio"
              placeholder="Tell us about yourself..."
              value={form.bio}
              onChange={handleChange("bio")}
            />
          </div>

          {/* Continue */}
          <Button
            onClick={handleContinue}
            className="mt-8 w-full"
            icon={ArrowRight}
          >
            Continue
          </Button>
        </motion.div>
      </div>
    </section>
  );
}