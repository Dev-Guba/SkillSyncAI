import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Check,
  Sparkles,
  Compass,
  Heart,
  Sliders,
  ArrowRight,
  Loader2,
} from "lucide-react";

import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/logos/logo.png";
import { API } from "../api/api.js";

const MIN_SELECTION = 3;
const PROFICIENCY_LEVELS = ["Beginner", "Intermediate", "Advanced"];

// Fallback interests in case the backend interest endpoint has no data yet
const FALLBACK_INTERESTS = [
  { interest_id: 1, interest_name: "Web Development" },
  { interest_id: 2, interest_name: "Mobile App Development" },
  { interest_id: 3, interest_name: "Artificial Intelligence & ML" },
  { interest_id: 4, interest_name: "Data Science & Analytics" },
  { interest_id: 5, interest_name: "Cybersecurity" },
  { interest_id: 6, interest_name: "Cloud Computing & DevOps" },
  { interest_id: 7, interest_name: "UI/UX Design" },
  { interest_id: 8, interest_name: "Game Development" },
  { interest_id: 9, interest_name: "Database Administration" },
  { interest_id: 10, interest_name: "Quality Assurance & Testing" },
];

function ChipSection({
  title,
  caption,
  icon: Icon,
  items,
  selected,
  onToggle,
  emptyHint,
  idKey = "skill_set_id",
  nameKey = "skill_set_name",
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
            const itemId = item[idKey];
            const itemName = item[nameKey];
            const isSelected = selected.some(
              (sel) => sel[idKey] === itemId
            );

            return (
              <motion.button
                key={itemId}
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
                {itemName}
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
  const [interests, setInterests] = useState([]);

  // USER SELECTED
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
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
  | GET PROGRAM SKILLS & INTERESTS
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
      setSkills(skillsResponse.data?.data || []);

      // Fetch interests (try program-specific first, then general, then fallback)
      try {
        const interestResponse = await API.getProgramInterests(programId);
        const fetchedInterests = interestResponse.data?.data || [];
        if (fetchedInterests.length > 0) {
          setInterests(fetchedInterests);
        } else {
          throw new Error("Empty program interests");
        }
      } catch {
        try {
          const allInterestsRes = await API.getAllInterests();
          const allInterests = allInterestsRes.data?.data || [];
          setInterests(
            allInterests.length > 0 ? allInterests : FALLBACK_INTERESTS
          );
        } catch {
          setInterests(FALLBACK_INTERESTS);
        }
      }
    } catch (error) {
      console.error("Program loading error:", error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | TOGGLE SKILL & PROFICIENCY LEVEL (#15)
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
      setSelectedSkills([
        ...selectedSkills,
        { ...skill, proficiency_level: "Beginner" },
      ]);
    }
  };

  const updateSkillProficiency = (skillSetId, level) => {
    setSelectedSkills((prev) =>
      prev.map((skill) =>
        skill.skill_set_id === skillSetId
          ? { ...skill, proficiency_level: level }
          : skill
      )
    );
  };

  /*
  |--------------------------------------------------------------------------
  | TOGGLE INTEREST (#14)
  |--------------------------------------------------------------------------
  */
  const toggleInterest = (interest) => {
    const exists = selectedInterests.some(
      (item) => item.interest_id === interest.interest_id
    );

    if (exists) {
      setSelectedInterests(
        selectedInterests.filter(
          (item) => item.interest_id !== interest.interest_id
        )
      );
    } else {
      setSelectedInterests([...selectedInterests, interest]);
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
    (skill.skill_set_name || "").toLowerCase().includes(query)
  );

  const filteredInterests = interests.filter((interest) =>
    (interest.interest_name || "").toLowerCase().includes(query)
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
      // #15: Use the user's chosen proficiency_level instead of hard-coding "Beginner"
      const payloadSkills = selectedSkills.map((skill) => ({
        skill_set_id: skill.skill_set_id,
        proficiency_level: skill.proficiency_level || "Beginner",
      }));

      await API.createUserSkills({
        skills: payloadSkills,
      });

      // #14: Save selected interests if any are chosen
      if (selectedInterests.length > 0) {
        const interestPayload = {
          interests: selectedInterests.map((item) => ({
            interest_id: item.interest_id,
            interestId: item.interest_id,
            interest_name: item.interest_name,
          })),
          interestIds: selectedInterests.map((item) => item.interest_id),
        };

        try {
          await API.createInterestAPI(interestPayload);
        } catch {
          try {
            await API.createUserInterests(interestPayload);
          } catch (interestErr) {
            console.warn("Interest save warning:", interestErr);
          }
        }
      }

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
          <img src={logo} className="h-14 w-14" alt="SkillSync AI Logo" />

          <p className="text-sm font-semibold text-primary">
            Step 3 of 3
          </p>

          <h1 className="mt-5 text-center text-3xl font-bold">
            Select your skills, interests & career
          </h1>

          <p className="mt-3 text-center text-muted">
            We'll recommend careers based on your skills and interests.
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
            placeholder="Search skills or interests..."
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
          idKey="skill_set_id"
          nameKey="skill_set_name"
        />

        {/* #15: PROFICIENCY LEVEL SELECTOR FOR SELECTED SKILLS */}
        {selectedSkills.length > 0 && (
          <div className="mt-8 rounded-2xl border border-border p-5">
            <div className="mb-4 flex items-center gap-2">
              <Sliders className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-ink">
                Skill Proficiency
              </h2>
              <span className="text-sm text-muted">
                — choose your level for each selected skill
              </span>
            </div>

            <div className="space-y-3">
              {selectedSkills.map((skill) => (
                <div
                  key={skill.skill_set_id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 px-4 py-2.5"
                >
                  <span className="text-sm font-medium text-ink">
                    {skill.skill_set_name}
                  </span>

                  <div className="flex gap-1.5">
                    {PROFICIENCY_LEVELS.map((level) => {
                      const active =
                        (skill.proficiency_level || "Beginner") === level;
                      return (
                        <button
                          key={level}
                          type="button"
                          onClick={() =>
                            updateSkillProficiency(
                              skill.skill_set_id,
                              level
                            )
                          }
                          className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                            active
                              ? "bg-primary text-white"
                              : "border border-border text-muted hover:border-primary hover:text-ink"
                          }`}
                        >
                          {level}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* #14: INTERESTS SELECTION */}
        <div className="mt-10">
          <ChipSection
            title="Interests"
            caption="topics & areas you enjoy exploring"
            icon={Heart}
            items={filteredInterests}
            selected={selectedInterests}
            onToggle={toggleInterest}
            emptyHint="No interests found."
            idKey="interest_id"
            nameKey="interest_name"
          />
        </div>

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
      <div className="fixed inset-x-0 bottom-0 border-t bg-white p-4 dark:bg-surface">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <p className="text-sm text-ink">
            {totalSelected} skill{totalSelected === 1 ? "" : "s"}
            {selectedInterests.length > 0
              ? ` • ${selectedInterests.length} interest${
                  selectedInterests.length === 1 ? "" : "s"
                }`
              : ""}{" "}
            selected
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