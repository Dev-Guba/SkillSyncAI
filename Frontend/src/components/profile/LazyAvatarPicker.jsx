import { lazy, Suspense } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

/*
| The character picker (and its drawing library) is only downloaded when a
| student opens it. If that download fails — flaky connection, or the app was
| updated since the page loaded — show a message instead of failing silently.
*/

function Overlay({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 text-center shadow-soft-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function LoadFailed({ onClose }) {
  return (
    <Overlay onClose={onClose}>
      <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
      <h2 className="mt-3 text-base font-bold text-ink">Couldn&apos;t load the characters</h2>
      <p className="mt-1 text-sm text-muted">
        Check your connection, then reload the page and try again.
      </p>
      <div className="mt-5 flex justify-center gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl px-4 py-2 text-sm font-medium text-ink hover:bg-surface-alt"
        >
          Close
        </button>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
        >
          Reload page
        </button>
      </div>
    </Overlay>
  );
}

function Loading({ onClose }) {
  return (
    <Overlay onClose={onClose}>
      <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
      <p className="mt-3 text-sm text-muted">Loading characters...</p>
    </Overlay>
  );
}

const AvatarPicker = lazy(() =>
  import("./AvatarPicker").catch((error) => {
    console.error("Character picker failed to load:", error);
    return { default: LoadFailed };
  })
);

// Same props as AvatarPicker; renders nothing until opened
export default function LazyAvatarPicker(props) {
  if (!props.isOpen) return null;
  return (
    <Suspense fallback={<Loading onClose={props.onClose} />}>
      <AvatarPicker {...props} />
    </Suspense>
  );
}
