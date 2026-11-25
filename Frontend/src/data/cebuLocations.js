// Cities and municipalities of Cebu Province, used for the profile Location
// field so everyone picks the same names (useful for matching job listings,
// which come labeled like "Cebu City" or "Mandaue City").

export const CEBU_CITIES = [
  "Cebu City",
  "Mandaue City",
  "Lapu-Lapu City",
  "Talisay City",
  "Naga City",
  "Carcar City",
  "Danao City",
  "Toledo City",
  "Bogo City",
];

export const CEBU_MUNICIPALITIES = [
  "Alcantara", "Alcoy", "Alegria", "Aloguinsan", "Argao", "Asturias",
  "Badian", "Balamban", "Bantayan", "Barili", "Boljoon", "Borbon",
  "Carmen", "Catmon", "Compostela", "Consolacion", "Cordova",
  "Daanbantayan", "Dalaguete", "Dumanjug", "Ginatilan", "Liloan",
  "Madridejos", "Malabuyoc", "Medellin", "Minglanilla", "Moalboal",
  "Oslob", "Pilar", "Pinamungajan", "Poro", "Ronda", "Samboan",
  "San Fernando", "San Francisco", "San Remigio", "Santa Fe",
  "Santander", "Sibonga", "Sogod", "Tabogon", "Tabuelan", "Tuburan",
  "Tudela",
];

// Cebu only: every student is at UCLM and every job is in Cebu, so there is
// no "Outside Cebu" choice.
export const LOCATION_GROUPS = [
  { label: "Cities", options: CEBU_CITIES },
  { label: "Municipalities", options: CEBU_MUNICIPALITIES },
];

export const ALL_LOCATIONS = LOCATION_GROUPS.flatMap((g) => g.options);
