import { useRef, useState } from "react";
import { Camera, Smile, Trash2 } from "lucide-react";
import Avatar from "@/components/common/Avatar";
// Loaded only when opened, so the character library isn't in the main download
import AvatarPicker from "@/components/profile/LazyAvatarPicker";
import { resizeImageToDataUrl } from "@/utils/resizeImage";

const MAX_FILE_MB = 10;

/*
| Optional photo picker for profile setup. Holds the picture as a data URL
| (value / onChange); the page uploads it once the profile exists.
*/
export default function ProfilePhotoField({ value, onChange, firstName, lastName }) {
  const fileRef = useRef(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError("");
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setError(`Please choose an image under ${MAX_FILE_MB} MB.`);
      return;
    }
    try {
      onChange(await resizeImageToDataUrl(file));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <Avatar firstName={firstName} lastName={lastName} src={value} size="lg" />

      <div>
        <p className="text-sm font-medium text-ink">Profile photo</p>
        <p className="text-xs text-muted">
          Optional. Use a photo, pick a character, or skip it for now.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold text-ink transition hover:border-primary hover:text-primary"
        >
          <Camera className="h-3.5 w-3.5" />
          {value ? "Change photo" : "Upload photo"}
        </button>

        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold text-ink transition hover:border-primary hover:text-primary"
        >
          <Smile className="h-3.5 w-3.5" />
          Choose a character
        </button>

        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-muted transition hover:text-red-500"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Remove
          </button>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFile}
      />

      <AvatarPicker
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(png) => onChange(png)}
      />
    </div>
  );
}
