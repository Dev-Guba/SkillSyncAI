import { useEffect, useState } from "react";

import SkillGapScore from "../components/dashboard/SkillGapScore";
import MissingSkills from "../components/dashboard/MissingSkills";
import AIRecommendation from "../components/dashboard/AIRecommendation";

import { API } from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function SkillGapPage() {
  const { user } = useAuth();

  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAIAnalysis();
    }
  }, [user]);

  const fetchAIAnalysis = async () => {
    try {
      console.log("CURRENT USER:", user);

      /*
      Expected:
      user.user_id
      user.JobTitles[0].job_title_id
      */
      const jobTitle = user.JobTitles?.[0];

      if (!jobTitle) {
        console.error("No target job title found");
        setLoading(false);
        return;
      }

      const payload = {
        user_id: user.user_id,
        job_title_id: jobTitle.job_title_id,
      };

      console.log("AI REQUEST:", payload);

      const response = await API.getAIRecommendation(payload);

      console.log("AI RESPONSE:", response.data);

      setAiData(response.data.data);
    } catch (error) {
      console.error("AI loading error:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <section className="p-6">Loading AI analysis...</section>;
  }

  if (!aiData) {
    return (
      <section className="p-6 space-y-4">
        <h1 className="text-3xl font-bold">Skill Gap Analyzer</h1>
        <p className="text-muted">
          No AI analysis available yet. Please complete your profile and
          select a target career.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">Skill Gap Analyzer</h1>
        <p className="mt-2 text-muted">
          Understand your current skills and what you need to improve for
          your career goal.
        </p>
      </div>

      <SkillGapScore score={aiData.analysis?.match_percentage || 0} />

      <div className="grid gap-6 lg:grid-cols-2">
        <MissingSkills skills={aiData.analysis?.missing_skills || []} />
        <AIRecommendation recommendation={aiData.recommendation || null} />
      </div>
    </section>
  );
}