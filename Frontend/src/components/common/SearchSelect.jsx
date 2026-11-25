import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

/*
| Searchable dropdown. Type to filter, arrow keys to move, Enter to pick,
| Esc to close.
|
| groups: [{ label, options: [string] }]
| allowCustom: also accept typed text that isn't in the list (shown as
|   'Use "..."'; typed text is also kept if the user clicks away).
| onChange is called like an input's: onChange({ target: { value } }), so it
| works with existing handleChange("field") helpers.
| A saved value that isn't in the list is shown under "Current".
*/
export default function SearchSelect({
  label,
  value = "",
  onChange,
  groups = [],
  allowCustom = false,
  icon: Icon = null,
  placeholder = "Search...",
  emptyText = "No matches.",
  maxLength = 150, // matches the database column for typed-in values
  error,
}) {
  const id = useId();
  const listId = `${id}-list`;
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const allOptions = useMemo(() => groups.flatMap((g) => g.options), [groups]);
  const legacyValue = value && !allOptions.includes(value) ? value : null;

  const { shownGroups, flat, customOption } = useMemo(() => {
    const q = query.trim().toLowerCase();
    const source = legacyValue
      ? [{ label: "Current", options: [legacyValue] }, ...groups]
      : groups;

    const filtered = source
      .map((g) => ({
        label: g.label,
        options: g.options.filter((o) => !q || o.toLowerCase().includes(q)),
      }))
      .filter((g) => g.options.length > 0);

    const typed = query.trim();
    const exact = allOptions.some((o) => o.toLowerCase() === typed.toLowerCase());
    const custom = allowCustom && typed && !exact ? typed : null;

    return {
      shownGroups: filtered,
      customOption: custom,
      flat: [...(custom ? [custom] : []), ...filtered.flatMap((g) => g.options)],
    };
  }, [query, legacyValue, groups, allOptions, allowCustom]);

  const close = (commitTyped = false) => {
    if (commitTyped && allowCustom && query.trim()) {
      onChange?.({ target: { value: query.trim() } });
    }
    setOpen(false);
    setQuery("");
  };

  // Close when clicking outside (keeping typed text when allowed)
  useEffect(() => {
    if (!open) return undefined;
    const handle = (e) => {
      if (!wrapperRef.current?.contains(e.target)) close(true);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  });

  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const choose = (option) => {
    onChange?.({ target: { value: option } });
    setOpen(false);
    setQuery("");
    inputRef.current?.blur();
  };

  const openList = () => {
    setOpen(true);
    const index = flat.indexOf(value);
    setActive(index >= 0 ? index : 0);
  };

  const handleKeyDown = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      e.preventDefault();
      openList();
      return;
    }
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (flat[active]) choose(flat[active]);
    } else if (e.key === "Escape") {
      close(false);
    } else if (e.key === "Tab") {
      close(true);
    }
  };

  const optionRow = (option, i, text = option) => {
    const selected = option === value;
    return (
      <li
        key={`${i}-${option}`}
        id={`${id}-opt-${i}`}
        data-index={i}
        role="option"
        aria-selected={selected}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => choose(option)}
        onMouseEnter={() => setActive(i)}
        className={`flex cursor-pointer items-center justify-between gap-3 px-3.5 py-2 text-sm ${
          i === active ? "bg-primary/10 text-primary" : "text-ink"
        }`}
      >
        <span className="min-w-0">{text}</span>
        {selected && <Check className="h-4 w-4 shrink-0 text-primary" />}
      </li>
    );
  };

  let index = customOption ? 0 : -1;

  return (
    <div ref={wrapperRef} className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        )}
        <input
          id={id}
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && flat[active] ? `${id}-opt-${active}` : undefined}
          autoComplete="off"
          maxLength={maxLength}
          placeholder={value || placeholder}
          value={open ? query : value}
          onFocus={openList}
          onClick={() => !open && openList()}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            if (!open) setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className={`w-full rounded-xl border bg-surface py-2.5 pr-9 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 ${
            Icon ? "pl-10" : "pl-3.5"
          } ${open && value ? "placeholder:text-ink/70" : ""} ${
            error ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : "border-border"
          }`}
        />
        <ChevronDown
          className={`pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />

        {open && (
          <ul
            id={listId}
            ref={listRef}
            role="listbox"
            className="absolute z-30 mt-1.5 max-h-64 w-full overflow-y-auto rounded-xl border border-border bg-surface py-1 shadow-soft-lg"
          >
            {customOption && optionRow(customOption, 0, <>Use &quot;{customOption}&quot;</>)}

            {flat.length === 0 && (
              <li className="px-3.5 py-2.5 text-sm text-muted">{emptyText}</li>
            )}

            {shownGroups.map((group) => (
              <li key={group.label} role="presentation">
                <p className="px-3.5 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
                  {group.label}
                </p>
                <ul role="group" aria-label={group.label}>
                  {group.options.map((option) => {
                    index += 1;
                    return optionRow(option, index);
                  })}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
