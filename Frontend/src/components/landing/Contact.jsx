import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, CheckCircle2, AlertCircle, Clock, MapPin } from "lucide-react";

import Button from "../common/Button.jsx";
import Input from "../common/Input.jsx";
import Textarea from "../common/Textarea.jsx";
import { API } from "../../api/api.js";
import EmailContact, { CONTACT_EMAIL } from "../common/EmailContact.jsx";

const MESSAGE_MAX = 3000;
const EMPTY_FORM = { name: "", email: "", subject: "", message: "", website: "" };

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Please enter your name.";
  if (!form.email.trim()) {
    errors.email = "Please enter your email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Please enter a valid email.";
  }
  if (!form.message.trim()) {
    errors.message = "Please write a message.";
  } else if (form.message.trim().length < 10) {
    errors.message = "Please write a little more (at least 10 characters).";
  }
  return errors;
}

export default function Contact() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | failed
  const [feedback, setFeedback] = useState("");

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (status === "failed") setStatus("idle");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = validate(form);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setStatus("sending");
    setFeedback("");

    try {
      const response = await API.sendContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
        website: form.website, // hidden spam trap
      });

      setStatus("sent");
      setFeedback(
        response.data?.message ||
          "Thanks! Your message has been sent. We'll reply by email."
      );
      setForm(EMPTY_FORM);
    } catch (error) {
      setStatus("failed");
      setErrors(error.response?.data?.errors || {});
      setFeedback(
        error.response?.data?.message ||
          `Your message couldn't be sent. You can email us at ${CONTACT_EMAIL}.`
      );
    }
  };

  return (
    <section id="contact" className="scroll-mt-24 py-20 lg:py-28 bg-surface-alt">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-wide">
              Contact
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-ink mt-3 mb-4 text-balance">
              Get in touch
            </h2>
            <p className="text-lg text-muted">
              Questions about SkillSyncAI, feedback, or partnering with your
              school? Send us a message and we&apos;ll get back to you.
            </p>

            <ul className="mt-8 space-y-5">
              <li className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="mb-1 text-sm font-semibold text-ink">Email</p>
                  {/* Copy / Open in Gmail instead of a mailto: link, which
                      does nothing without an email app */}
                  <EmailContact />
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Clock className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">Response time</p>
                  <p className="text-sm text-muted">Usually within 1–2 business days</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">Based in</p>
                  <p className="text-sm text-muted">Cebu, Philippines</p>
                </div>
              </li>
            </ul>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="rounded-3xl border border-border bg-surface p-6 shadow-soft sm:p-8">
              {status === "sent" ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-600 dark:bg-green-950/40 dark:text-green-400">
                    <CheckCircle2 className="h-7 w-7" />
                  </span>
                  <h3 className="mt-5 text-xl font-bold text-ink">Message sent</h3>
                  <p className="mt-2 max-w-sm text-sm text-muted">{feedback}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus("idle");
                      setFeedback("");
                    }}
                    className="mt-6 text-sm font-semibold text-primary hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                  {status === "failed" && feedback && (
                    <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{feedback}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Input
                      label="Name"
                      name="name"
                      autoComplete="name"
                      placeholder="Juan Dela Cruz"
                      value={form.name}
                      onChange={handleChange("name")}
                      error={errors.name}
                      maxLength={100}
                    />
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@gmail.com"
                      value={form.email}
                      onChange={handleChange("email")}
                      error={errors.email}
                      maxLength={150}
                    />
                  </div>

                  <Input
                    label="Subject (optional)"
                    name="subject"
                    placeholder="What is this about?"
                    value={form.subject}
                    onChange={handleChange("subject")}
                    error={errors.subject}
                    maxLength={150}
                  />

                  <Textarea
                    label="Message"
                    name="message"
                    placeholder="How can we help?"
                    value={form.message}
                    onChange={handleChange("message")}
                    error={errors.message}
                    maxLength={MESSAGE_MAX}
                    className="min-h-36"
                  />

                  {/* Spam trap: hidden from people, often filled in by bots */}
                  <div className="hidden" aria-hidden="true">
                    <label>
                      Website
                      <input
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        value={form.website}
                        onChange={handleChange("website")}
                      />
                    </label>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    icon={Send}
                    className="w-full py-3 sm:w-auto sm:self-end"
                    disabled={status === "sending"}
                  >
                    {status === "sending" ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
