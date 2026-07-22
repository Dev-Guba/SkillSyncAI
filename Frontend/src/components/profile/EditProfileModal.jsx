import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import Textarea from "@/components/common/Textarea";
import Button from "@/components/common/Button";

const GENDER_OPTIONS = [
  { value: "Female", label: "Female" },
  { value: "Male", label: "Male" },
  { value: "Non-binary", label: "Non-binary" },
  { value: "Prefer not to say", label: "Prefer not to say" },
];

export default function EditProfileModal({ profile, isOpen, onClose, onSave, isSaving }) {
  const [formData, setFormData] = useState(profile);
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!formData.first_name?.trim()) next.first_name = "First name is required";
    if (!formData.last_name?.trim()) next.last_name = "Last name is required";
    if (!formData.email?.trim()) next.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) next.email = "Enter a valid email";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const success = await onSave(formData);
    if (success) onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-surface p-6 shadow-soft-lg sm:p-8"
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">Edit Profile</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface-alt hover:text-ink"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="First Name"
                value={formData.first_name}
                onChange={handleChange("first_name")}
                error={errors.first_name}
              />
              <Input
                label="Last Name"
                value={formData.last_name}
                onChange={handleChange("last_name")}
                error={errors.last_name}
              />
            </div>

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange("email")}
              error={errors.email}
            />

            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone_number}
              onChange={handleChange("phone_number")}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Birth Date"
                type="date"
                value={formData.birth_date?.slice(0, 10) || ""}
                onChange={handleChange("birth_date")}
              />
              <Select
                label="Gender"
                value={formData.gender}
                onChange={handleChange("gender")}
                options={GENDER_OPTIONS}
              />
            </div>

            <Input label="Location" value={formData.location} onChange={handleChange("location")} />

            <Textarea
              label="Bio"
              value={formData.bio || ""}
              onChange={handleChange("bio")}
              maxLength={240}
              placeholder="Tell others a bit about yourself..."
            />

            <div className="mt-2 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}