const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

export function fibonacciSphere(count, radius = 1) {
  if (count <= 0) return [];
  if (count === 1) return [[0, radius, 0]];

  const points = [];

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = GOLDEN_ANGLE * i;

    points.push([
      Math.cos(theta) * radiusAtY * radius,
      y * radius,
      Math.sin(theta) * radiusAtY * radius,
    ]);
  }

  return points;
}