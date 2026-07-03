import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function WireSphere() {
  const group = useRef();

  const { gl } = useThree();

  const rotation = useRef({
    x: 0,
    y: 0,
  });

  const velocity = useRef({
    x: 0,
    y: 0,
  });

  const dragging = useRef(false);

  const last = useRef({
    x: 0,
    y: 0,
  });

  useFrame((_, delta) => {
    if (!dragging.current) {
      velocity.current.x *= 0.96;
      velocity.current.y *= 0.96;
    }

    rotation.current.y += velocity.current.x * delta * 60;
    rotation.current.x += velocity.current.y * delta * 60;

    group.current.rotation.y = rotation.current.y;
    group.current.rotation.x = rotation.current.x;
  });

  const pointerDown = (e) => {
    e.stopPropagation();

    dragging.current = true;

    last.current.x = e.clientX;
    last.current.y = e.clientY;

    gl.domElement.style.cursor = "grabbing";
  };

  const pointerMove = (e) => {
    if (!dragging.current) return;

    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;

    velocity.current.x = dx * 0.003;
    velocity.current.y = dy * 0.003;

    last.current.x = e.clientX;
    last.current.y = e.clientY;
  };

  const pointerUp = () => {
    dragging.current = false;
    gl.domElement.style.cursor = "grab";
  };

  return (
    <group
      ref={group}
      onPointerDown={pointerDown}
      onPointerMove={pointerMove}
      onPointerUp={pointerUp}
      onPointerOut={pointerUp}
    >
      {/* Glow */}
      <mesh scale={1.08}>
        <sphereGeometry args={[2.25, 128, 128]} />
        <meshBasicMaterial
          color="#6d63ff"
          transparent
          opacity={0.05}
        />
      </mesh>

      {/* Glass */}
      <mesh>
        <sphereGeometry args={[2.15, 128, 128]} />
        <meshPhysicalMaterial
          transmission={1}
          thickness={0.6}
          roughness={0}
          metalness={0.8}
          transparent
          opacity={0.08}
          color="#5B4BFF"
        />
      </mesh>

      {/* Wireframe */}
      <mesh>
        <sphereGeometry args={[2.17, 96, 96]} />
        <meshBasicMaterial
          wireframe
          color="#a497ff"
        />
      </mesh>

      {/* Equator */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.22, 0.01, 16, 300]} />
        <meshBasicMaterial
          color="#7b73ff"
        />
      </mesh>

      {/* Vertical Ring */}
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[2.22, 0.01, 16, 300]} />
        <meshBasicMaterial
          color="#7b73ff"
        />
      </mesh>

      {/* Tilted Ring */}
      <mesh rotation={[0.8, 0.5, 0]}>
        <torusGeometry args={[2.22, 0.01, 16, 300]} />
        <meshBasicMaterial
          color="#7b73ff"
        />
      </mesh>
    </group>
  );
}