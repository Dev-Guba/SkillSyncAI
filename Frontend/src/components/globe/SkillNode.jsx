import { useMemo } from "react";
import SkillCard from "./SkillCard";
import { fibonacciSphere } from "./utils/fibonacciSphere";

export default function SkillNodes({ labels, radius = 2.6 }) {
  const positions = useMemo(
    () => fibonacciSphere(labels.length, radius),
    [labels, radius]
  );

  return (
    <>
      {labels.map((label, index) => (
        <SkillCard key={label} label={label} position={positions[index]} />
      ))}
    </>
  );
}