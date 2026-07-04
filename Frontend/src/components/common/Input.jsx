import { forwardRef, useId } from "react";

const Input = forwardRef(function Input(
  { label, id, error, icon: Icon, className = "", ...props },
  ref
) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        )}
        <input
          id={inputId}
          ref={ref}
          className={`w-full rounded-xl border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 ${
            Icon ? "pl-10" : ""
          } ${error ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : "border-border"} ${className}`}
          {...props}
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
});

export default Input;