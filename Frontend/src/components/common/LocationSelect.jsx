import { useState } from "react";
import { MapPin, LocateFixed, Loader2 } from "lucide-react";
import SearchSelect from "./SearchSelect";
import { LOCATION_GROUPS } from "@/data/cebuLocations";
import { nearestCebuLocation } from "@/utils/nearestLocation";

const GEO_ERRORS = {
  1: "Location access was blocked. Allow it in your browser settings, or pick from the list.",
  2: "Your location couldn't be found right now. Please pick from the list.",
  3: "Finding your location took too long. Please try again or pick from the list.",
};

// Cebu cities/municipalities only. Only list values can be picked, so
// locations stay consistent for "jobs near you".
// "Use my current location" suggests the nearest one; the position is worked
// out on the device and never sent anywhere — only the chosen name is saved.
export default function LocationSelect({
  label = "City / Municipality in Cebu",
  onChange,
  ...props
}) {
  const [locating, setLocating] = useState(false);
  const [note, setNote] = useState(null); // { tone: "info" | "error", text }

  const canLocate =
    typeof navigator !== "undefined" &&
    "geolocation" in navigator &&
    (typeof window === "undefined" || window.isSecureContext);

  const useCurrentLocation = () => {
    setNote(null);
    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { name } = nearestCebuLocation(coords.latitude, coords.longitude);
        if (name) {
          onChange?.({ target: { value: name } });
          setNote({
            tone: "info",
            text: `Set to ${name} from your current location. Change it if that's not right.`,
          });
        } else {
          // Nothing filled in: pick where they live or study in Cebu
          setNote({
            tone: "error",
            text: "You seem to be outside Cebu right now. Please pick the city or municipality where you live or study in Cebu.",
          });
        }
        setLocating(false);
      },
      (error) => {
        setNote({
          tone: "error",
          text: GEO_ERRORS[error.code] || GEO_ERRORS[2],
        });
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5 * 60 * 1000 }
    );
  };

  return (
    <div className="flex flex-col gap-1.5">
      <SearchSelect
        label={label}
        groups={LOCATION_GROUPS}
        icon={MapPin}
        placeholder="Search your city or municipality"
        emptyText="No match. Try another spelling, e.g. Lapu-Lapu or Liloan."
        onChange={(e) => {
          setNote(null);
          onChange?.(e);
        }}
        {...props}
      />

      {!note && (
        <p className="text-xs text-muted">
          Where you live or want to work in Cebu. Jobs there are shown first.
        </p>
      )}

      {canLocate && (
        <button
          type="button"
          onClick={useCurrentLocation}
          disabled={locating}
          className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-primary hover:underline disabled:cursor-wait disabled:opacity-70"
        >
          {locating ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <LocateFixed className="h-3.5 w-3.5" />
          )}
          {locating ? "Finding your location..." : "Use my current location"}
        </button>
      )}

      {note && (
        <p
          className={`text-xs ${
            note.tone === "error" ? "text-red-500" : "text-muted"
          }`}
          role="status"
        >
          {note.text}
        </p>
      )}
    </div>
  );
}
