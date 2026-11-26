import { CEBU_CITIES, CEBU_MUNICIPALITIES } from "../data/cebuLocations.js";

const LIST_NAMES = new Set([...CEBU_CITIES, ...CEBU_MUNICIPALITIES]);

/*
| Works out which Cebu city/municipality a job listing is in, from labels
| like "Mandaue City, Cebu", "Consolacion, Cebu" or a barangay ("Lahug, Cebu").
| "Cebu, Central Visayas" names only the province, so it matches no city.
*/

// Well-known barangays/areas that belong to one city only. Names shared by
// several cities (Banilad, Basak, Cogon, Centro...) are left out on purpose.
const BARANGAY_TO_CITY = {
  // Cebu City
  lahug: "Cebu City",
  apas: "Cebu City",
  "it park": "Cebu City",
  mabolo: "Cebu City",
  talamban: "Cebu City",
  guadalupe: "Cebu City",
  "capitol site": "Cebu City",
  kamputhaw: "Cebu City",
  inayawan: "Cebu City",
  labangon: "Cebu City",
  pardo: "Cebu City",
  tisa: "Cebu City",
  "punta princesa": "Cebu City",
  kasambagan: "Cebu City",
  busay: "Cebu City",
  // Mandaue City
  guizo: "Mandaue City",
  subangdaku: "Mandaue City",
  "pakna-an": "Mandaue City",
  paknaan: "Mandaue City",
  cabancalan: "Mandaue City",
  tipolo: "Mandaue City",
  maguikay: "Mandaue City",
  bakilid: "Mandaue City",
  "alang-alang": "Mandaue City",
  jagobiao: "Mandaue City",
  // Lapu-Lapu City
  pajo: "Lapu-Lapu City",
  mactan: "Lapu-Lapu City",
  marigondon: "Lapu-Lapu City",
  pusok: "Lapu-Lapu City",
  "gun-ob": "Lapu-Lapu City",
  maribago: "Lapu-Lapu City",
  babag: "Lapu-Lapu City",
};

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const wordRe = (phrase) => new RegExp(`(^|[^a-z])${escape(phrase)}($|[^a-z])`, "i");

// [regex, canonical name], most specific first
const MATCHERS = [
  ...CEBU_CITIES.flatMap((city) => {
    const base = city.replace(/ City$/, "");
    // "Cebu" alone means the province, so Cebu City needs the word "City"
    return base === "Cebu"
      ? [[wordRe("cebu city"), city]]
      : [[wordRe(city.toLowerCase()), city], [wordRe(base.toLowerCase()), city]];
  }),
  ...CEBU_MUNICIPALITIES.map((m) => [wordRe(m.toLowerCase()), m]),
  ...Object.entries(BARANGAY_TO_CITY).map(([b, city]) => [wordRe(b), city]),
];

export function jobLocality(locationLabel) {
  const text = String(locationLabel || "").toLowerCase();
  if (!text) return null;
  for (const [re, name] of MATCHERS) {
    if (re.test(text)) return name;
  }
  return null;
}

// The user's city/municipality: a list value as-is, or read from older
// typed-in text like "Opao, Mandaue City Cebu" or "Mandaue".
export function userLocality(userLocation) {
  if (!userLocation) return null;
  return LIST_NAMES.has(userLocation) ? userLocation : jobLocality(userLocation);
}

// True if the job is in the same city/municipality as the user's profile
export function isJobNearUser(job, userLocation) {
  const mine = userLocality(userLocation);
  if (!mine) return false;
  return jobLocality(job?.location) === mine;
}
