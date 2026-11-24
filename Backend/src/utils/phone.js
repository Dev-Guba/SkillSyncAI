/*
| Philippine mobile numbers. Accepts 0917 123 4567, 09171234567,
| +63 917 123 4567, 639171234567, 917-123-4567 and stores 09171234567.
| Same rules as Frontend/src/utils/phone.js.
*/

// Returns "09XXXXXXXXX", or null if it isn't a valid PH mobile number
export function normalizePhPhone(input) {
    const raw = String(input || "").trim();
    if (!raw) return null;

    if (!/^\+?[\d\s\-.()]+$/.test(raw)) return null;

    let digits = raw.replace(/\D/g, "");

    if (digits.startsWith("63") && digits.length === 12) digits = digits.slice(2);
    else if (digits.startsWith("0") && digits.length === 11) digits = digits.slice(1);

    if (!/^9\d{9}$/.test(digits)) return null;

    return `0${digits}`;
}

export const PHONE_ERROR = "Enter a Philippine mobile number, e.g. 0917 123 4567.";
