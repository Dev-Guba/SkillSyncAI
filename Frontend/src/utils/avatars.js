
import { Avatar, Style } from "@dicebear/core";

import lorelei from "@dicebear/styles/lorelei.json" with { type: "json" };
import notionists from "@dicebear/styles/notionists.json" with { type: "json" };
import openPeeps from "@dicebear/styles/open-peeps.json" with { type: "json" };
import thumbs from "@dicebear/styles/thumbs.json" with { type: "json" };

const BACKGROUNDS = [
  "e0e7ff",
  "fce7f3",
  "dcfce7",
  "fef3c7",
  "e0f2fe",
  "ede9fe",
];

export const AVATAR_STYLES = [
  { id: "lorelei", label: "Illustrated", style: lorelei },
  { id: "notionists", label: "Sketch", style: notionists },
  { id: "openPeeps", label: "Doodle", style: openPeeps },
  { id: "thumbs", label: "Playful", style: thumbs },
];

export const AVATARS_PER_PAGE = 12;

export function makeSeeds(count = AVATARS_PER_PAGE) {
  return Array.from({ length: count }, () =>
    Math.random().toString(36).slice(2, 10)
  );
}

function styleFor(styleId) {
  return (
    AVATAR_STYLES.find((s) => s.id === styleId) ||
    AVATAR_STYLES[0]
  ).style;
}

export function avatarDataUri(styleId, seed) {
  const avatar = new Avatar(
    new Style(styleFor(styleId)),
    {
      seed,
      backgroundColor: BACKGROUNDS,
      backgroundType: ["solid"],
      radius: 0,
    }
  );

  return avatar.toDataUri();
}

export function avatarToPngDataUrl(styleId, seed, size = 256) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Couldn't prepare the avatar canvas."));
        return;
      }

      ctx.drawImage(img, 0, 0, size, size);
      resolve(canvas.toDataURL("image/png"));
    };

    img.onerror = () => {
      reject(
        new Error("Couldn't prepare that character. Please try another.")
      );
    };

    img.src = avatarDataUri(styleId, seed);
  });
}
