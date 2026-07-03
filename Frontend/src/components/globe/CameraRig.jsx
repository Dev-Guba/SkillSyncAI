import { useThree, useFrame } from "@react-three/fiber";
import { easing } from "maath";

export default function CameraRig() {
  const { camera, pointer } = useThree();

  useFrame((state, delta) => {
    easing.damp3(
      camera.position,
      [
        pointer.x * 0.6,
        pointer.y * 0.4,
        7,
      ],
      0.25,
      delta
    );

    camera.lookAt(0, 0, 0);
  });

  return null;
}