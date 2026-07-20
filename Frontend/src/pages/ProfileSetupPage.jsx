import { useState } from "react";
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

export default function ProfileSetupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    birth_date: "",
    gender: "",
    location: "",
    bio: "",
  });

  const handleChange = (field) => (e) =>
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));

  const handleContinue = async () => {
    if (!form.first_name.trim()) {
      return alert("First name is required.");
    }

    if (!form.last_name.trim()) {
      return alert("Last name is required.");
    }

    if (!form.email.trim()) {
      return alert("Email is required.");
    }

    try {
      console.log(form);
      await API.createUserProfile(form);

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

          <div className="mt-3 h-2 rounded-full bg-border overflow-hidden">

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

            Tell us a little about yourself before we personalize your experience.

          </p>

        </div>

        {/* Form */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 rounded-3xl border border-border bg-surface p-8 shadow-lg"
        >

          <div className="grid gap-5 sm:grid-cols-2">

            <Input
              label="First Name"
              value={form.first_name}
              onChange={handleChange("first_name")}
            />

            <Input
              label="Last Name"
              value={form.last_name}
              onChange={handleChange("last_name")}
            />

          </div>

          <div className="mt-5">

            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={handleChange("email")}
            />

          </div>

          <div className="mt-5">

            <Input
              label="Phone Number"
              value={form.phone_number}
              onChange={handleChange("phone_number")}
            />

          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">

            <Input
              label="Birth Date"
              name="birth_date"
              type="date"
              value={form.birth_date}
              onChange={handleChange("birth_date")}
            />

            <Select
              label="Gender"
              value={form.gender}
              onChange={(e) => {
                console.log("Gender selected:", e.target.value);

                setForm((prev) => ({
                  ...prev,
                  gender: e.target.value,
                }));
              }}
              options={GENDER_OPTIONS}
            />

          </div>

          <div className="mt-5">

            <Input
              label="Location"
              value={form.location}
              onChange={handleChange("location")}
            />

          </div>

          <div className="mt-5">

            <Textarea
              label="Bio"
              placeholder="Tell us about yourself..."
              value={form.bio}
              onChange={handleChange("bio")}
            />

          </div>

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