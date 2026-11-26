/*
| Approximate reference points [latitude, longitude] for "Use my current
| location". The nearest point decides the suggested city/municipality.
|
| - Most towns: one point near the town center (poblacion).
| - Metro Cebu cities sit side by side, so they get several points spread
|   across the city to make the nearest-point guess more accurate there.
| - OUTSIDE_POINTS are towns on nearby islands (Negros, Bohol, Leyte); if one
|   of those is nearest, the user is told they seem to be outside Cebu and
|   nothing is filled in.
|
| Coordinates are approximate (from general knowledge, not survey data). The
| result is only a suggestion the user can change, but spot-check and correct
| any that look off.
*/

export const LOCATION_POINTS = {
  // ---- Cities ----
  "Cebu City": [
    [10.2936, 123.9019], // downtown / Colon
    [10.3157, 123.8854], // Capitol / Fuente
    [10.3300, 123.9060], // IT Park / Lahug
    [10.3700, 123.9170], // Talamban
    [10.3180, 123.9170], // Mabolo
    [10.2800, 123.8600], // Pardo
    [10.3200, 123.8800], // Guadalupe
    [10.2700, 123.8800], // South Road Properties
    [10.3900, 123.8600], // Busay (uplands)
  ],
  "Mandaue City": [
    [10.3236, 123.9223], // city hall / centro
    [10.3350, 123.9400], // Looc / Opao
    [10.3450, 123.9300], // Cabancalan / Banilad side
    [10.3400, 123.9150], // Subangdaku / Bakilid
  ],
  "Lapu-Lapu City": [
    [10.3133, 123.9550], // Poblacion / Pusok
    [10.3070, 123.9790], // Mactan airport
    [10.2760, 123.9770], // Marigondon
    [10.2900, 124.0100], // Maribago
    [10.3240, 124.0200], // Punta Engaño
  ],
  "Talisay City": [
    [10.2447, 123.8494],
    [10.2600, 123.8350], // Tabunok
  ],
  "Naga City": [[10.2090, 123.7580]],
  "Carcar City": [[10.1066, 123.6403]],
  "Danao City": [[10.5208, 124.0272]],
  "Toledo City": [[10.3773, 123.6386]],
  "Bogo City": [[11.0517, 124.0055]],

  // ---- Municipalities ----
  Alcantara: [[9.9719, 123.4044]],
  Alcoy: [[9.7081, 123.5064]],
  Alegria: [[9.7556, 123.3436]],
  Aloguinsan: [[10.2224, 123.5487]],
  Argao: [[9.8792, 123.6067]],
  Asturias: [[10.5679, 123.7175]],
  Badian: [[9.8697, 123.3961]],
  Balamban: [[10.5039, 123.7154]],
  Bantayan: [[11.1690, 123.7225]],
  Barili: [[10.1150, 123.5106]],
  Boljoon: [[9.6292, 123.4797]],
  Borbon: [[10.8327, 124.0332]],
  Carmen: [[10.5869, 124.0217]],
  Catmon: [[10.7181, 124.0100]],
  Compostela: [[10.4542, 124.0117]],
  Consolacion: [[10.3766, 123.9573]],
  Cordova: [[10.2561, 123.9494]],
  Daanbantayan: [[11.2537, 124.0055]],
  Dalaguete: [[9.7614, 123.5347]],
  Dumanjug: [[10.0567, 123.4367]],
  Ginatilan: [[9.5986, 123.3111]],
  Liloan: [[10.3990, 123.9993]],
  Madridejos: [[11.2667, 123.7231]],
  Malabuyoc: [[9.6528, 123.3283]],
  Medellin: [[11.1286, 123.9616]],
  Minglanilla: [[10.2447, 123.7961]],
  Moalboal: [[9.9492, 123.3961]],
  Oslob: [
    [9.5197, 123.4286],
    [9.4650, 123.3800], // Tan-awan (whale watching), south of the poblacion
  ],
  Pilar: [[10.8156, 124.5689]],
  Pinamungajan: [[10.2697, 123.5839]],
  Poro: [[10.6292, 124.4100]],
  Ronda: [[10.0017, 123.4100]],
  Samboan: [[9.5292, 123.3067]],
  "San Fernando": [[10.1617, 123.7083]],
  "San Francisco": [[10.6450, 124.3500]],
  "San Remigio": [[11.0811, 123.9375]],
  "Santa Fe": [[11.1592, 123.8031]],
  Santander: [[9.4178, 123.3347]],
  Sibonga: [[10.0336, 123.5697]],
  Sogod: [[10.7508, 124.0119]],
  Tabogon: [[10.9408, 124.0281]],
  Tabuelan: [[10.8233, 123.8706]],
  Tuburan: [[10.7244, 123.8250]],
  Tudela: [[10.6378, 124.4719]],
};

// Towns just across the water from Cebu
export const OUTSIDE_POINTS = [
  [9.3068, 123.3054], // Dumaguete, Negros Oriental
  [9.3500, 123.2833], // Sibulan
  [9.5167, 123.1583], // Tanjay
  [9.5907, 123.1218], // Bais
  [10.1186, 123.2742], // Guihulngan
  [10.3333, 123.3167], // Vallehermoso
  [10.4929, 123.4095], // San Carlos, Negros Occidental
  [10.8402, 123.4999], // Escalante
  [10.9465, 123.2888], // Cadiz
  [10.6765, 122.9509], // Bacolod
  [9.6500, 123.8500], // Tagbilaran, Bohol
  [9.9525, 123.9633], // Tubigon
  [10.1500, 124.3333], // Talibon
  [11.0064, 124.6075], // Ormoc, Leyte
  [10.6800, 124.8000], // Baybay
  [11.0500, 124.3800], // Palompon
  [10.3700, 124.7500], // Hilongos
];

// If even the nearest point is farther than this, treat it as outside Cebu
export const MAX_DISTANCE_KM = 30;
