import { Link } from "react-router-dom";
import { BadgeCheck, AlertCircle } from "lucide-react";

// Small pill next to an email address. When not verified it can link to the
// Verify Email page (pass `verifyHref`).
export default function EmailVerifiedBadge({ verified, verifyHref = null, className = "" }) {
  if (verified) {
    return (
      <span
        className={`inline-flex shrink-0 items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-400 ${className}`}
        title="This email has been confirmed with a code"
      >
        <BadgeCheck className="h-3.5 w-3.5" />
        Verified
      </span>
    );
  }

  const classes = `inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 ${className}`;
  const content = (
    <>
      <AlertCircle className="h-3.5 w-3.5" />
      Not verified
    </>
  );

  return verifyHref ? (
    <Link to={verifyHref} className={`${classes} hover:underline`} title="Verify this email">
      {content}
    </Link>
  ) : (
    <span className={classes}>{content}</span>
  );
}
