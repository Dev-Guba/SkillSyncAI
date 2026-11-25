/*
| Philippine mobile numbers. Accepts what people usually type:
|   0917 123 4567 · 09171234567 · +63 917 123 4567 · 639171234567 · 917-123-4567
| and turns them into the stored form 09171234567 (11 digits, starts with 09).
| Same rules as Backend/src/utils/phone.js.
*/

export const PHONE_EXAMPLE = "0917 123 4567";

// Returns "09XXXXXXXXX", or null if it isn't a valid PH mobile number
export function normalizePhPhone(input) {
  const raw = String(input || "").trim();
  if (!raw) return null;

  // Only digits, spaces, dashes, dots, brackets and one leading +
  if (!/^\+?[\d\s\-.()]+$/.test(raw)) return null;

  let digits = raw.replace(/\D/g, "");

  if (digits.startsWith("63") && digits.length === 12) digits = digits.slice(2);
  else if (digits.startsWith("0") && digits.length === 11) digits = digits.slice(1);

  // Now it should be the 10-digit mobile number: 9XXXXXXXXX
  if (!/^9\d{9}$/.test(digits)) return null;

  return `0${digits}`;
}

// "09171234567" -> "0917 123 4567" (anything else is shown as saved)
export function formatPhPhone(value) {
  const normalized = normalizePhPhone(value);
  if (!normalized) return value || "";
  return `${normalized.slice(0, 4)} ${normalized.slice(4, 7)} ${normalized.slice(7)}`;
}

export const PHONE_ERROR = `Enter a Philippine mobile number, e.g. ${PHONE_EXAMPLE}.`;
