import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Check, Sparkles, Compass, ArrowRight } from "lucide-react";

import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/logos/logo.png";
import { API } from "../api/api.js";

const MIN_SELECTION = 3;

function ChipSection({ title, caption, icon: Icon, items, selected, onToggle, emptyHint }) {
  return (
    <div>
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
            const isSelected = selected.some(
              (skill) => skill.skill_set_id === item.skill_set_id
            );

            return (
              <motion.button
                key={item.skill_set_id}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => onToggle(item)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isSelected
                    ? "bg-gradient-to-r from-[#5B4BFF] to-[#7A5CFF] text-white border-transparent"
                    : "border-border text-ink hover:border-primary"
                }`}
              >
                {isSelected && <Check className="h-3.5 w-3.5" />}
                {item.skill_set_name}
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
  const { refreshUser } = useAuth();

  const [search, setSearch] = useState("");

  // PROGRAM DATA
  const [skills, setSkills] = useState([]);
  const [programJobs, setProgramJobs] = useState([]);

  // USER SELECTED
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedJobTitle, setSelectedJobTitle] = useState(null);

  useEffect(() => {
    fetchProgramData();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | GET PROGRAM SKILLS + JOB TITLES
  |--------------------------------------------------------------------------
  */
  const fetchProgramData = async () => {
    try {
      const programId = localStorage.getItem("selectedProgram");

      if (!programId) {
        console.log("No program selected");
        return;
      }

      const skillsResponse = await API.getProgramSkills(programId);
      const jobsResponse = await API.getProgramJobTitles(programId);

      setSkills(skillsResponse.data.data);
      setProgramJobs(jobsResponse.data.data);
    } catch (error) {
      console.error("Program loading error:", error);
    }
  };

  const toggleSkill = (skill) => {
    const exists = selectedSkills.some(
      (item) => item.skill_set_id === skill.skill_set_id
    );

    if (exists) {
      setSelectedSkills(
        selectedSkills.filter((item) => item.skill_set_id !== skill.skill_set_id)
      );
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const query = search.toLowerCase();

  const filteredSkills = skills.filter((skill) =>
    skill.skill_set_name.toLowerCase().includes(query)
  );

  const totalSelected = selectedSkills.length;
  const canContinue = totalSelected >= MIN_SELECTION;

  const handleContinue = async () => {
    if (!canContinue) return;

    if (!selectedJobTitle) {
      alert("Please select a target career.");
      return;
    }

    try {
      const payloadSkills = selectedSkills.map((skill) => ({
        skill_set_id: skill.skill_set_id,
        proficiency_level: "Beginner",
      }));

      await API.createUserSkills({ skills: payloadSkills });
      await API.createUserJobTitle({ job_title_id: selectedJobTitle });

      await refreshUser();
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed setup.");
    }
  };

  return (
    <section className="relative min-h-screen bg-white pb-32 dark:bg-surface">
      <div className="mx-auto max-w-3xl px-6 pt-16">
        <div className="flex flex-col items-center mb-10">
          <img src={logo} className="h-14 w-14" />
          <p className="text-sm font-semibold text-primary">Step 3 of 3</p>
          <h1 className="text-center text-3xl font-bold mt-5">
            Select your skills & career
          </h1>
          <p className="text-muted text-center mt-3">
            Based on your selected program.
          </p>
        </div>

        <div className="mb-10 flex h-14 items-center rounded-2xl border px-4">
          <Search className="mr-3" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills..."
            className="w-full bg-transparent outline-none"
          />
        </div>

        <ChipSection
          title="Program Skills"
          caption="skills related to your course"
          icon={Sparkles}
          items={filteredSkills}
          selected={selectedSkills}
          onToggle={toggleSkill}
          emptyHint="No skills found."
        />

        <div className="mt-10">
          <div className="flex items-center gap-2 mb-4">
            <Compass className="text-primary" />
            <h2 className="font-semibold text-lg">Target Career</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {programJobs.map((job) => {
              const selected = selectedJobTitle === job.job_title_id;

              return (
                <motion.button
                  key={job.job_title_id}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedJobTitle(job.job_title_id)}
                  className={`rounded-full border px-4 py-2 text-sm ${
                    selected ? "bg-primary text-white" : "border-border"
                  }`}
                >
                  {job.job_title_name}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 border-t bg-white p-4">
        <div className="mx-auto max-w-3xl flex justify-between">
          <p>{totalSelected} selected</p>
          <button
            disabled={!canContinue}
            onClick={handleContinue}
            className="rounded-xl bg-primary px-6 py-3 text-white disabled:opacity-40"
          >
            Finish Setup
            <ArrowRight className="inline ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
}