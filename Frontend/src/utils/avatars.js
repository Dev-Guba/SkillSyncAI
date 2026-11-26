import { createAvatar } from "@dicebear/core";
// Individual style packages (not @dicebear/collection) keep the download small
import * as lorelei from "@dicebear/lorelei";
import * as notionists from "@dicebear/notionists";
import * as openPeeps from "@dicebear/open-peeps";
import * as thumbs from "@dicebear/thumbs";

/*
| Cartoon characters students can use instead of a personal photo.
| Made on the device with DiceBear (no outside service). Only CC0 1.0 styles
| are used, so they're free to use without credit:
|   Lorelei (Lisa Wischofsky), Notionists (Zoish),
|   Open Peeps (Pablo Stanley), Thumbs (DiceBear).
| The chosen character is turned into a 256x256 PNG and saved like a photo.
*/

const BACKGROUNDS = ["e0e7ff", "fce7f3", "dcfce7", "fef3c7", "e0f2fe", "ede9fe"];

export const AVATAR_STYLES = [
  { id: "lorelei", label: "Illustrated", style: lorelei },
  { id: "notionists", label: "Sketch", style: notionists },
  { id: "openPeeps", label: "Doodle", style: openPeeps },
  { id: "thumbs", label: "Playful", style: thumbs },
];

export const AVATARS_PER_PAGE = 12;

// A batch of seeds; "Shuffle" asks for a new batch
export function makeSeeds(count = AVATARS_PER_PAGE) {
  return Array.from({ length: count }, () =>
    Math.random().toString(36).slice(2, 10)
  );
}

function styleFor(styleId) {
  return (AVATAR_STYLES.find((s) => s.id === styleId) || AVATAR_STYLES[0]).style;
}

// SVG data URI for showing a character in the picker
export function avatarDataUri(styleId, seed) {
  return createAvatar(styleFor(styleId), {
    seed,
    backgroundColor: BACKGROUNDS,
    backgroundType: ["solid"],
    radius: 0,
  }).toDataUri();
}

// 256x256 PNG data URL, the format the profile picture endpoint accepts
export function avatarToPngDataUrl(styleId, seed, size = 256) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, size, size);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => reject(new Error("Couldn't prepare that character. Please try another."));
    img.src = avatarDataUri(styleId, seed);
  });
}
