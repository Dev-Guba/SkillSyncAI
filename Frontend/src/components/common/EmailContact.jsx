import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";

export const CONTACT_EMAIL = "officialskillsyncai@gmail.com";

// Gmail's web compose window, already addressed. A plain "mailto:" link does
// nothing on computers without an email app set up (most students use Gmail
// in the browser), so this is the reliable option.
export const GMAIL_COMPOSE_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
  CONTACT_EMAIL
)}&su=${encodeURIComponent("SkillSyncAI inquiry")}`;

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Older browsers / non-secure pages
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  }
}

/*
| The contact address with "Copy" and "Open in Gmail" buttons.
| compact: smaller text/buttons (footer).
*/
export default function EmailContact({ compact = false, showAddress = true }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (await copyText(CONTACT_EMAIL)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const btn = compact
    ? "inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs font-medium text-ink transition hover:border-primary hover:text-primary"
    : "inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-ink transition hover:border-primary hover:text-primary";

  return (
    <div className="flex flex-col gap-2">
      {showAddress && (
        <span className={`break-all ${compact ? "text-muted" : "text-sm text-muted"}`}>
          {CONTACT_EMAIL}
        </span>
      )}
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={handleCopy} className={btn} aria-live="polite">
          {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied!" : "Copy"}
        </button>
        <a href={GMAIL_COMPOSE_URL} target="_blank" rel="noopener noreferrer" className={btn}>
          <ExternalLink className="h-3.5 w-3.5" />
          Open in Gmail
        </a>
      </div>
    </div>
  );
}
