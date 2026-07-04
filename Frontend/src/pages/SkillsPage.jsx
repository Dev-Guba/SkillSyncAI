import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Check, Sparkles, Compass, ArrowRight } from "lucide-react";
import logo from "../assets/logos/logo.png";
import {
  FloatingGlobe,
  GlobeOverlay,
} from "../components/globe";

const SKILLS = [
  "JavaScript", "Python", "Java", "C++", "React", "Node.js",
  "HTML & CSS", "SQL", "Data Analysis", "UI/UX Design", "Figma", "Excel",
  "Communication", "Leadership", "Project Management", "Problem Solving",
  "Teamwork", "Public Speaking", "Writing", "Video Editing", "Digital Marketing",
];

const INTERESTS = [
  "Software Development", "Web Development", "Mobile Development",
  "Data Science", "AI & Machine Learning", "Cybersecurity",
  "Cloud Computing", "DevOps", "Game Development", "Product Management",
  "Business Analysis", "IT Support", "Network Administration",
  "Digital Marketing", "UI/UX Design",
];

const MIN_SELECTION = 3;

function ChipSection({ title, caption, icon: Icon, items, selected, onToggle, emptyHint, className = "" }) {
  return (
    <div className={className}>
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-ink">{title}</h2>
        <span className="text-sm text-muted">— {caption}</span>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted">{emptyHint}</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {items.map((item) => {
            const isSelected = selected.includes(item);
            return (
              <motion.button
                key={item}
                type="button"
                whileTap={{ scale: 0.95 }}
                aria-pressed={isSelected}
                onClick={() => onToggle(item)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-[#5B4BFF] focus-visible:ring-offset-2 ${
                  isSelected
                    ? "border-transparent bg-linear-to-r from-[#5B4BFF] to-[#7A5CFF] text-white shadow-[0_8px_20px_rgba(91,75,255,.3)]"
                    : "border-border text-ink hover:border-[#5B4BFF]"
                }`}
              >
                {isSelected && <Check className="h-3.5 w-3.5" />}
                {item}
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function SkillsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [showGlobe, setShowGlobe] = useState(false);

  const toggle = (value, list, setList) => {
    setList(
      list.includes(value)
        ? list.filter((entry) => entry !== value)
        : [...list, value]
    );
  };

  const query = search.toLowerCase();
  const filteredSkills = SKILLS.filter((s) => s.toLowerCase().includes(query));
  const filteredInterests = INTERESTS.filter((i) => i.toLowerCase().includes(query));

  const totalSelected = selectedSkills.length + selectedInterests.length;
  const canContinue = totalSelected >= MIN_SELECTION;

  const handleContinue = () => {
    if (!canContinue) return;
    // TODO: replace with the real "save onboarding selections" API call
    console.log("Selected skills:", selectedSkills);
    console.log("Selected interests:", selectedInterests);
    navigate("/dashboard");
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-white pb-32 dark:bg-surface">
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-violet-500/20 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-violet-500/20 blur-[140px]" />

      <div className="relative mx-auto max-w-3xl px-6 pt-16">
        <div className="mb-10 flex flex-col items-center">
          <img src={logo} alt="SkillSyncAI" className="mb-4 h-14 w-14 object-contain" />

<p className="text-sm font-semibold text-primary">
  Step 3 of 3
</p>

<div className="mt-3 h-2 overflow-hidden rounded-full bg-border">
  <div className="h-full w-full rounded-full bg-gradient-to-r from-[#5B4BFF] to-[#7A5CFF]" />
</div>

          <h1 className="text-center text-3xl font-bold text-ink sm:text-4xl">
            What are your skills & interests?
          </h1>
          <p className="mt-3 max-w-md text-center text-muted">
            Pick at least {MIN_SELECTION} so SkillSyncAI can start tailoring opportunities to you. You can always update this later.
          </p>
        </div>

        <div className="mb-10 flex h-14 items-center rounded-2xl border border-border px-4 transition focus-within:border-[#5B4BFF] focus-within:ring-4 focus-within:ring-violet-100">
          <Search className="mr-3 h-5 w-5 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills or interests..."
            aria-label="Search skills or interests"
            className="w-full bg-transparent outline-none"
          />
        </div>

        <ChipSection
          title="Skills"
          caption="things you're already good at"
          icon={Sparkles}
          items={filteredSkills}
          selected={selectedSkills}
          onToggle={(value) => toggle(value, selectedSkills, setSelectedSkills)}
          emptyHint={`No skills match "${search}". Try a different term.`}
        />

        <ChipSection
          title="Interests"
          caption="fields you'd like to explore or grow in"
          icon={Compass}
          items={filteredInterests}
          selected={selectedInterests}
          onToggle={(value) => toggle(value, selectedInterests, setSelectedInterests)}
          emptyHint={`No interests match "${search}". Try a different term.`}
          className="mt-10"
        />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/80 backdrop-blur-md dark:bg-surface/80">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <p className="text-sm text-muted">
            {totalSelected} selected
            {!canContinue && <span> · pick {MIN_SELECTION - totalSelected} more</span>}
          </p>

          <div className="flex items-center gap-4">

            <motion.button
              type="button"
              whileHover={canContinue ? { scale: 1.02 } : {}}
              whileTap={canContinue ? { scale: 0.98 } : {}}
              disabled={!canContinue}
              onClick={handleContinue}
              className="flex h-12 items-center gap-2 rounded-2xl bg-linear-to-r from-[#5B4BFF] to-[#7A5CFF] px-6 font-semibold text-white shadow-[0_15px_40px_rgba(91,75,255,.35)] outline-none transition focus-visible:ring-2 focus-visible:ring-[#5B4BFF] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Finish Setup
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </div>

      <FloatingGlobe onClick={() => setShowGlobe(true)} />
      <GlobeOverlay open={showGlobe} onClose={() => setShowGlobe(false)} />
    </section>
  );
}