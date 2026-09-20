import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Check,
  Sparkles,
  Compass,
  ArrowRight,
  Loader2,
} from "lucide-react";

import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/logos/logo.png";
import { API } from "../api/api.js";

const MIN_SELECTION = 3;

function ChipSection({
  title,
  caption,
  icon: Icon,
  items,
  selected,
  onToggle,
  emptyHint,
}) {
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

function getScoreStyle(score) {
  if (score >= 75) {
    return {
      card: "border-green-300 bg-green-50",
      badge: "bg-green-100 text-green-700",
    };
  }

  if (score >= 50) {
    return {
      card: "border-yellow-300 bg-yellow-50",
      badge: "bg-yellow-100 text-yellow-700",
    };
  }

  return {
    card: "border-gray-300 bg-gray-50",
    badge: "bg-gray-200 text-gray-600",
  };
}

export default function SkillsPage() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [search, setSearch] = useState("");

  // PROGRAM DATA
  const [skills, setSkills] = useState([]);

  // USER SELECTED
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedJobTitle, setSelectedJobTitle] = useState(null);

  // AI RECOMMENDATIONS
  const [careerRecommendations, setCareerRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] =
    useState(false);

  useEffect(() => {
    fetchProgramData();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | GET PROGRAM SKILLS
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

      setSkills(skillsResponse.data.data);
    } catch (error) {
      console.error("Program loading error:", error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | TOGGLE SKILL
  |--------------------------------------------------------------------------
  */
  const toggleSkill = (skill) => {
    const exists = selectedSkills.some(
      (item) => item.skill_set_id === skill.skill_set_id
    );

    if (exists) {
      setSelectedSkills(
        selectedSkills.filter(
          (item) => item.skill_set_id !== skill.skill_set_id
        )
      );
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | GET AI CAREER RECOMMENDATIONS
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    if (selectedSkills.length < MIN_SELECTION) {
      setCareerRecommendations([]);
      setSelectedJobTitle(null);
      return;
    }

    const getRecommendations = async () => {
      try {
        setLoadingRecommendations(true);
        setSelectedJobTitle(null);

        const programId = localStorage.getItem("selectedProgram");

        const userSkills = selectedSkills.map(
          (skill) => skill.skill_set_name
        );

        const response = await API.getCareerRecommendations({
          programId,
          userSkills,
        });

        const recommendations = response.data?.data || [];

        // Remove careers with 0% score
        const visibleRecommendations = recommendations.filter(
          (career) => career.match_percentage > 0
        );

        setCareerRecommendations(visibleRecommendations);
      } catch (error) {
        console.error(
          "Career recommendation error:",
          error
        );

        setCareerRecommendations([]);
      } finally {
        setLoadingRecommendations(false);
      }
    };

    getRecommendations();
  }, [selectedSkills]);

  const query = search.toLowerCase();

  const filteredSkills = skills.filter((skill) =>
    skill.skill_set_name.toLowerCase().includes(query)
  );

  const totalSelected = selectedSkills.length;
  const canContinue =
    totalSelected >= MIN_SELECTION && selectedJobTitle;

  /*
  |--------------------------------------------------------------------------
  | FINISH SETUP
  |--------------------------------------------------------------------------
  */
  const handleContinue = async () => {
    if (!canContinue) return;

    try {
      const payloadSkills = selectedSkills.map((skill) => ({
        skill_set_id: skill.skill_set_id,
        proficiency_level: "Beginner",
      }));

      await API.createUserSkills({
        skills: payloadSkills,
      });

      await API.createUserJobTitle({
        job_title_id: selectedJobTitle,
      });

      await refreshUser();

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed setup."
      );
    }
  };

  return (
    <section className="relative min-h-screen bg-white pb-32 dark:bg-surface">
      <div className="mx-auto max-w-3xl px-6 pt-16">
        {/* HEADER */}
        <div className="mb-10 flex flex-col items-center">
          <img src={logo} className="h-14 w-14" />

          <p className="text-sm font-semibold text-primary">
            Step 3 of 3
          </p>

          <h1 className="mt-5 text-center text-3xl font-bold">
            Select your skills & career
          </h1>

          <p className="mt-3 text-center text-muted">
            We'll recommend careers based on your skills.
          </p>
        </div>

        {/* SEARCH */}
        <div className="mb-10 flex h-14 items-center rounded-2xl border px-4">
          <Search className="mr-3" />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search skills..."
            className="w-full bg-transparent outline-none"
          />
        </div>

        {/* SKILLS */}
        <ChipSection
          title="Program Skills"
          caption="skills related to your course"
          icon={Sparkles}
          items={filteredSkills}
          selected={selectedSkills}
          onToggle={toggleSkill}
          emptyHint="No skills found."
        />

        {/* AI CAREER RECOMMENDATIONS */}
        <div className="mt-12">
          <div className="mb-5 flex items-center gap-2">
            <Compass className="h-5 w-5 text-primary" />

            <h2 className="text-lg font-semibold text-ink">
              Recommended Careers
            </h2>
          </div>

          {selectedSkills.length < MIN_SELECTION && (
            <div className="rounded-2xl border border-dashed border-border p-6 text-center">
              <p className="text-sm text-muted">
                Select at least {MIN_SELECTION} skills
                to get career recommendations.
              </p>
            </div>
          )}

          {loadingRecommendations && (
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-border p-6">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />

              <p className="text-sm text-muted">
                Analyzing your skills...
              </p>
            </div>
          )}

          {!loadingRecommendations &&
            selectedSkills.length >= MIN_SELECTION &&
            careerRecommendations.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border p-6 text-center">
                <p className="text-sm text-muted">
                  No matching careers found yet.
                </p>
              </div>
            )}

          {!loadingRecommendations &&
            careerRecommendations.length > 0 && (
              <div className="space-y-3">
                {careerRecommendations.map((career) => {
                  const score =
                    career.match_percentage;

                  const styles =
                    getScoreStyle(score);

                  const selected =
                    selectedJobTitle ===
                    career.job_title_id;

                  return (
                    <motion.button
                      key={career.job_title_id}
                      type="button"
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        setSelectedJobTitle(
                          career.job_title_id
                        )
                      }
                      className={`w-full rounded-2xl border p-4 text-left transition ${styles.card} ${
                        selected
                          ? "ring-2 ring-primary"
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-ink">
                            {career.job_title_name}
                          </h3>

                          <p className="mt-1 text-sm text-muted">
                            {career.matched_skills?.length || 0}{" "}
                            matching skills
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${styles.badge}`}
                        >
                          {score}%
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="fixed inset-x-0 bottom-0 border-t bg-white p-4">
        <div className="mx-auto flex max-w-3xl justify-between">
          <p>
            {totalSelected} selected
          </p>

          <button
            disabled={!canContinue}
            onClick={handleContinue}
            className="rounded-xl bg-primary px-6 py-3 text-white disabled:opacity-40"
          >
            Finish Setup

            <ArrowRight className="ml-2 inline" />
          </button>
        </div>
      </div>
    </section>
  );
}