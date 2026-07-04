import { forwardRef, useId } from "react";

const Textarea = forwardRef(function Textarea(
  { label, id, error, maxLength, value = "", className = "", ...props },
  ref
) {
  const generatedId = useId();
  const textareaId = id || generatedId;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={textareaId} className="text-sm font-medium text-ink">
            {label}
          </label>
          {maxLength && (
            <span className="text-xs text-muted">
              {value.length}/{maxLength}
            </span>
          )}
        </div>
      )}

      <textarea
        id={textareaId}
        ref={ref}
        value={value}
        maxLength={maxLength}
        rows={4}
        className={`w-full resize-none rounded-xl border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 ${
          error ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : "border-border"
        } ${className}`}
        {...props}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
});

export default Textarea;