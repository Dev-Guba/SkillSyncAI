import { Canvas } from "@react-three/fiber";
import {
  AdaptiveDpr,
  AdaptiveEvents,
  Environment,
  PerspectiveCamera,
  Stars,
} from "@react-three/drei";

import { EffectComposer, Bloom } from "@react-three/postprocessing";

import WireSphere from "./WireSphere";
import CameraRig from "./CameraRig";

export default function GlobeScene({ onClose }) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      onPointerMissed={onClose}
    >
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />

      <PerspectiveCamera
        makeDefault
        position={[0, 0, 7]}
        fov={35}
      />

      <color attach="background" args={["#050816"]} />

      <fog attach="fog" args={["#050816", 10, 24]} />

      <ambientLight intensity={0.9} />

      <directionalLight
        intensity={5}
        position={[5, 8, 5]}
        castShadow
      />

      <pointLight
        color="#6f6dff"
        intensity={45}
        position={[0, 0, 4]}
      />

      <pointLight
        color="#66cfff"
        intensity={15}
        position={[-4, 2, 5]}
      />

      <Stars
        radius={120}
        depth={50}
        count={4500}
        factor={5}
        saturation={0}
        fade
        speed={0.4}
      />

      <Environment preset="night" />
      <CameraRig />
      <WireSphere />

      <EffectComposer>
        <Bloom
          intensity={1.6}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.8}
        />
      </EffectComposer>
    </Canvas>
  );
}