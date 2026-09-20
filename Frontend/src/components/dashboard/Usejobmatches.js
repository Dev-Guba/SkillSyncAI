import { useCallback, useEffect, useState } from "react";
import { API } from "../../api/api.js";

/**
 * Loads the job listings saved for the user's target job title.
 * Used once on the dashboard so JobPreview and StatsCards share one request.
 *
 * status: "loading" | "ready" | "error"
 */
export function useJobMatches(jobTitleId) {
  const [jobs, setJobs] = useState([]);
  const [status, setStatus] = useState("loading");
  const [reloadKey, setReloadKey] = useState(0);
  const [importing, setImporting] = useState(false);
  const [importFailed, setImportFailed] = useState(false);

  useEffect(() => {
    if (!jobTitleId) return;

    let cancelled = false;

    setStatus("loading");

    API.getJobsByJobTitle(jobTitleId)
      .then((response) => {
        if (cancelled) return;

        const payload = response.data?.data;
        const list = Array.isArray(payload)
          ? payload
          : payload?.jobs || payload?.rows || [];

        setJobs(list);
        setStatus("ready");
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("Job matches error:", error);
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [jobTitleId, reloadKey]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  // Pulls fresh listings for this job title, then reloads the list
  const importJobs = useCallback(async () => {
    if (!jobTitleId) return;

    try {
      setImporting(true);
      setImportFailed(false);
      await API.importJobsByJobTitle(jobTitleId);
      setReloadKey((k) => k + 1);
    } catch (error) {
      console.error("Job import error:", error);
      setImportFailed(true);
    } finally {
      setImporting(false);
    }
  }, [jobTitleId]);

  return { jobs, status, reload, importJobs, importing, importFailed };
}