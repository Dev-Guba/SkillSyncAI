import {
  LOCATION_POINTS,
  OUTSIDE_POINTS,
  MAX_DISTANCE_KM,
} from "../data/cebuLocationCoords.js";

// Great-circle distance in km
function distanceKm([lat1, lng1], [lat2, lng2]) {
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
}

/*
| Suggests the Cebu city/municipality for a position, worked out entirely on
| the device (the coordinates are never sent anywhere).
| Returns { name, distanceKm }. name is null when the position looks outside
| Cebu (a town on a nearby island is nearer, or nothing is within
| MAX_DISTANCE_KM).
*/
export function nearestCebuLocation(lat, lng) {
  const here = [lat, lng];

  let best = { name: null, distanceKm: Infinity };
  for (const [name, points] of Object.entries(LOCATION_POINTS)) {
    for (const point of points) {
      const d = distanceKm(here, point);
      if (d < best.distanceKm) best = { name, distanceKm: d };
    }
  }

  const nearestOutside = Math.min(...OUTSIDE_POINTS.map((p) => distanceKm(here, p)));

  if (nearestOutside < best.distanceKm || best.distanceKm > MAX_DISTANCE_KM) {
    return { name: null, distanceKm: best.distanceKm };
  }
  return best;
}
