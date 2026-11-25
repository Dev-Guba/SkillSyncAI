import { useEffect, useMemo, useState } from "react";
import { X, Shuffle, Check, Loader2 } from "lucide-react";
import Button from "@/components/common/Button";
import {
  AVATAR_STYLES,
  avatarDataUri,
  avatarToPngDataUrl,
  makeSeeds,
} from "@/utils/avatars";

/*
| Modal grid of cartoon characters. onSelect(pngDataUrl) is called with the
| chosen one (256x256 PNG); it may return a promise.
*/
export default function AvatarPicker({ isOpen, onClose, onSelect }) {
  const [styleId, setStyleId] = useState(AVATAR_STYLES[0].id);
  const [seeds, setSeeds] = useState(() => makeSeeds());
  const [chosen, setChosen] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setChosen(null);
      setError("");
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => e.key === "Escape" && !saving && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, saving, onClose]);

  const images = useMemo(
    () => seeds.map((seed) => ({ seed, src: avatarDataUri(styleId, seed) })),
    [styleId, seeds]
  );

  if (!isOpen) return null;

  const handleUse = async () => {
    if (!chosen) return;
    setSaving(true);
    setError("");
    try {
      const png = await avatarToPngDataUrl(styleId, chosen);
      await onSelect(png);
      onClose();
    } catch (err) {
      setError(err.message || "Couldn't use that character. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={() => !saving && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="avatar-picker-title"
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-border bg-surface p-6 shadow-soft-lg sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 id="avatar-picker-title" className="text-lg font-bold text-ink">
              Choose a character
            </h2>
            <p className="text-sm text-muted">
              Use a cartoon instead of a personal photo.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface-alt hover:text-ink"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Styles */}
        <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="Character style">
          {AVATAR_STYLES.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={styleId === s.id}
              onClick={() => {
                setStyleId(s.id);
                setChosen(null);
              }}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                styleId === s.id
                  ? "bg-primary text-white"
                  : "border border-border text-ink hover:border-primary"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map(({ seed, src }) => {
            const selected = chosen === seed;
            return (
              <button
                key={seed}
                type="button"
                onClick={() => setChosen(seed)}
                aria-pressed={selected}
                aria-label="Character option"
                className={`relative aspect-square overflow-hidden rounded-full border-2 transition ${
                  selected
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-transparent hover:border-primary/40"
                }`}
              >
                <img src={src} alt="" className="h-full w-full" draggable="false" />
                {selected && (
                  <span className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={() => {
              setSeeds(makeSeeds());
              setChosen(null);
            }}
            disabled={saving}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            <Shuffle className="h-4 w-4" />
            Show more
          </button>

          <div className="flex gap-3">
            <Button type="button" variant="ghost" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="button" variant="primary" onClick={handleUse} disabled={!chosen || saving}>
              {saving ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                </span>
              ) : (
                "Use this character"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
