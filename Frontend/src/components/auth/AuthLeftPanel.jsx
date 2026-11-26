import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Target,
  Briefcase,
  TrendingUp,
  UserPlus,
  MailCheck,
  IdCard,
  Sparkles,
  Check,
} from "lucide-react";
import logo from "../../assets/logos/logo.png";

/*
| Brand panel in the logo's colors: light lavender → periwinkle gradient,
| the logo's dark navy for text and its violet for accents.
| Register: the real sign-up steps. Log in: what SkillSyncAI does.
*/
const C = {
  navy: "#1F1D3D",
  navySoft: "#1F1D3DB3", // ~70%
  violet: "#6E64DB",
};

// What a new account leads to (matches the real sign-up flow)
const SIGNUP_STEPS = [
  { icon: UserPlus, title: "Create your account", text: "Username, email and password." },
  { icon: MailCheck, title: "Verify your email", text: "Enter the 6-digit code we send you." },
  { icon: IdCard, title: "Build your profile", text: "Your name, program and contact details." },
  { icon: Sparkles, title: "Choose your skills", text: "Pick your skills and a target career, then see your plan." },
];

const FEATURES = [
  { icon: Target, title: "Skill-gap analysis", text: "See which skills your target career needs that you don't have yet." },
  { icon: Briefcase, title: "Cebu job matches", text: "Real job postings from Cebu, matched to your skills." },
  { icon: TrendingUp, title: "In-demand skills", text: "Forecasts of the skills employers will be looking for." },
];

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.25 },
};

// step: index of the current sign-up step (0 = create account, 1 = verify email)
export default function AuthLeftPanel({ mode, step = 0 }) {
  const isRegister = mode === "register";

  return (
    <div className="relative flex w-full flex-col overflow-hidden rounded-[32px] bg-gradient-to-br from-[#CFE0FF] via-[#DAD4FC] to-[#C6B3F7] p-10 shadow-soft xl:p-12">
      {/* Subtle grid + soft shapes echoing the logo's lavender cube */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse at top left, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at top left, black 30%, transparent 75%)",
        }}
      />
      {/* Blue on the left, purple on the right, blending in the middle */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-[#7FA6F5]/45 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-[#A98BF2]/50 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-[#8FB4FA]/35 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-10 top-10 h-56 w-56 rounded-full bg-[#B9A2F5]/35 blur-3xl" />

      {/* Brand */}
      <div className="relative flex items-center justify-between">
        <img src={logo} alt="SkillSyncAI" className="h-10 w-auto max-w-[170px] object-contain" />
        <span
          className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold shadow-soft"
          style={{ color: C.violet }}
        >
          <GraduationCap className="h-3.5 w-3.5" />
          For UCLM students
        </span>
      </div>

      {/* Content */}
      <div className="relative flex flex-1 flex-col justify-center py-10">
        <AnimatePresence mode="wait">
          {isRegister ? (
            <motion.div key="register" {...fade}>
              <h2 className="text-4xl font-black leading-[1.1] tracking-tight xl:text-5xl" style={{ color: C.navy }}>
                Start mapping
                <br />
                <span className="bg-gradient-to-r from-[#3B6FE0] via-[#6E64DB] to-[#9A8FF0] bg-clip-text text-transparent">
                  your career path.
                </span>
              </h2>
              <p className="mt-4 max-w-md text-base" style={{ color: C.navySoft }}>
                {step === 0
                  ? "Setup takes about two minutes. Here's what happens next:"
                  : "Your account is created. Just a few more steps:"}
              </p>

              <ol className="mt-8 space-y-1">
                {SIGNUP_STEPS.map(({ icon: StepIcon, title, text }, i) => {
                  const current = i === step;
                  const done = i < step;
                  const Icon = done ? Check : StepIcon;
                  return (
                  <li key={title} className="relative flex gap-4 pb-5 last:pb-0" aria-current={current ? "step" : undefined}>
                    {/* connector line */}
                    {i < SIGNUP_STEPS.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="absolute left-5 top-11 h-[calc(100%-2.75rem)] w-px"
                        style={{ backgroundColor: done ? C.violet : `${C.violet}55` }}
                      />
                    )}
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-soft ${
                        current || done ? "text-white" : "bg-white/70"
                      }`}
                      style={
                        current
                          ? { backgroundImage: "linear-gradient(135deg, #3B6FE0, #6E64DB)" }
                          : done
                          ? { backgroundColor: "#22A06B" }
                          : { color: C.violet }
                      }
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="pt-0.5">
                      <p className="font-semibold" style={{ color: C.navy }}>
                        {title}
                        {done && <span className="sr-only"> (done)</span>}
                        {current && (
                          <span
                            className="ml-2 rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-semibold"
                            style={{ color: C.violet }}
                          >
                            You&apos;re here
                          </span>
                        )}
                      </p>
                      <p className="text-sm" style={{ color: C.navySoft }}>{text}</p>
                    </div>
                  </li>
                  );
                })}
              </ol>
            </motion.div>
          ) : (
            <motion.div key="login" {...fade}>
              <h2 className="text-4xl font-black leading-[1.1] tracking-tight xl:text-5xl" style={{ color: C.navy }}>
                AI that connects your skills to{" "}
                <span className="bg-gradient-to-r from-[#3B6FE0] via-[#6E64DB] to-[#9A8FF0] bg-clip-text text-transparent">
                  better opportunities.
                </span>
              </h2>

              <ul className="mt-10 space-y-5">
                {FEATURES.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex gap-4">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/70 shadow-soft"
                      style={{ color: C.violet }}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold" style={{ color: C.navy }}>{title}</p>
                      <p className="text-sm" style={{ color: C.navySoft }}>{text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <p className="relative text-xs" style={{ color: C.navySoft }}>
        © {new Date().getFullYear()} SkillSyncAI · University of Cebu – Lapu-Lapu and Mandaue
      </p>
    </div>
  );
}
