import { forwardRef, useId } from "react";
import { ChevronDown } from "lucide-react";

const Select = forwardRef(function Select(
  { label, id, error, options = [], className = "", ...props },
  ref
) {
  const generatedId = useId();
  const selectId = id || generatedId;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}

      <div className="relative">
        <select
          id={selectId}
          ref={ref}
          className={`w-full appearance-none rounded-xl border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 ${
            error ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : "border-border"
          } ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
});

export default Select;