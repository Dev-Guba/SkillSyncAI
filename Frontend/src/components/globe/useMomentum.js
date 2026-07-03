import { useCallback, useEffect, useRef } from "react";
import { MathUtils } from "three";
import { easing } from "maath";

const DEFAULT_OPTIONS = {
  sensitivity: 0.006,
  damping: 0.25,
  maxPitch: Math.PI / 2.4,
};

export default function useMomentum(options = {}) {
  const { sensitivity, damping, maxPitch } = { ...DEFAULT_OPTIONS, ...options };

  const rotation = useRef({ yaw: 0, pitch: 0 });
  const velocity = useRef({ yaw: 0, pitch: 0 });
  const dragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const lastMoveTime = useRef(0);

  const handlePointerMove = useCallback(
    (event) => {
      if (!dragging.current) return;

      const now = performance.now();
      const dt = Math.max(now - lastMoveTime.current, 1) / 1000;

      const deltaX = event.clientX - lastPointer.current.x;
      const deltaY = event.clientY - lastPointer.current.y;

      const deltaYaw = deltaX * sensitivity;
      const deltaPitch = deltaY * sensitivity;

      rotation.current.yaw += deltaYaw;
      rotation.current.pitch = MathUtils.clamp(
        rotation.current.pitch + deltaPitch,
        -maxPitch,
        maxPitch
      );

      velocity.current.yaw = deltaYaw / dt;
      velocity.current.pitch = deltaPitch / dt;

      lastPointer.current = { x: event.clientX, y: event.clientY };
      lastMoveTime.current = now;
    },
    [sensitivity, maxPitch]
  );

  const handlePointerUp = useCallback(() => {
    dragging.current = false;
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
  }, [handlePointerMove]);

  const handlePointerDown = useCallback(
    (event) => {
      event.stopPropagation();
      dragging.current = true;
      velocity.current = { yaw: 0, pitch: 0 };
      lastPointer.current = { x: event.clientX, y: event.clientY };
      lastMoveTime.current = performance.now();

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    },
    [handlePointerMove, handlePointerUp]
  );

  // Call once per frame (from useFrame) to carry momentum after release
  const update = useCallback(
    (delta) => {
      if (dragging.current) return;

      const speed = Math.hypot(velocity.current.yaw, velocity.current.pitch);
      if (speed < 0.0001) return;

      rotation.current.yaw += velocity.current.yaw * delta;
      rotation.current.pitch = MathUtils.clamp(
        rotation.current.pitch + velocity.current.pitch * delta,
        -maxPitch,
        maxPitch
      );

      easing.damp(velocity.current, "yaw", 0, damping, delta);
      easing.damp(velocity.current, "pitch", 0, damping, delta);
    },
    [damping, maxPitch]
  );

  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  return { rotation, velocity, dragging, onPointerDown: handlePointerDown, update };
}