import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";
import * as THREE from "three";

const MIN_SCALE = 0.55;
const MAX_SCALE = 1.2;
const MIN_OPACITY = 0.12;
const MAX_OPACITY = 1;

const worldPosition = new THREE.Vector3();
const cameraPosition = new THREE.Vector3();
const toCard = new THREE.Vector3();
const toCamera = new THREE.Vector3();

export default function SkillCard({ label, position }) {
  const anchorRef = useRef();
  const materialRef = useRef();
  const textRef = useRef();

  useFrame(({ camera }) => {
    if (!anchorRef.current) return;

    // assumes the globe's rotating group is centered at world origin
    anchorRef.current.getWorldPosition(worldPosition);
    camera.getWorldPosition(cameraPosition);

    toCard.copy(worldPosition).normalize();
    toCamera.copy(cameraPosition).normalize();

    const facing = THREE.MathUtils.clamp(toCard.dot(toCamera), -1, 1);
    const t = (facing + 1) / 2;

    const scale = THREE.MathUtils.lerp(MIN_SCALE, MAX_SCALE, t);
    const opacity = THREE.MathUtils.lerp(MIN_OPACITY, MAX_OPACITY, t);

    anchorRef.current.scale.setScalar(scale);
    if (materialRef.current) materialRef.current.opacity = opacity;
    if (textRef.current) textRef.current.fillOpacity = opacity;
  });

  return (
    <group ref={anchorRef} position={position}>
      <Billboard>
        <mesh>
          <planeGeometry args={[1.5, 0.55]} />
          <meshPhysicalMaterial
            ref={materialRef}
            transmission={0.9}
            roughness={0.2}
            thickness={0.5}
            ior={1.3}
            color="#c9d4ff"
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>

        <Text
          ref={textRef}
          position={[0, 0, 0.02]}
          fontSize={0.16}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      </Billboard>
    </group>
  );
}