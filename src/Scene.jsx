import React, { useRef, useEffect, useState, Suspense } from "react";
import { Environment, PerspectiveCamera, PointerLockControls } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import Cyberscene from "./components/Cyberscene";
import { useScenarios } from "./context/ScenariosContext";
import * as THREE from "three";
import gsap from "gsap";

const LoadingBox = () => (
  <mesh position={[0, 0, 0]}>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color='#666666' />
  </mesh>
);

const Scene = () => {
  const { state, getCurrentLocation, getCurrentSceneTrigger } = useScenarios();
  const controlsRef = useRef(null);
  const [isLocked, setIsLocked] = useState(false);
  const { gl, camera } = useThree();
  const moveSpeed = 0.1;
  const keys = useRef({ forward: false, backward: false, left: false, right: false });

  // Handle pointer lock changes
  useEffect(() => {
    if (!controlsRef.current) return;

    const handleLock = () => setIsLocked(true);
    const handleUnlock = () => setIsLocked(false);

    document.addEventListener("click", () => {
      controlsRef.current?.lock();
    });

    controlsRef.current.addEventListener("lock", handleLock);
    controlsRef.current.addEventListener("unlock", handleUnlock);

    return () => {
      if (controlsRef.current) {
        controlsRef.current.removeEventListener("lock", handleLock);
        controlsRef.current.removeEventListener("unlock", handleUnlock);
      }
    };
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = e => {
      if (!isLocked) return;
      switch (e.code) {
        case "KeyW":
          keys.current.forward = true;
          break;
        case "KeyS":
          keys.current.backward = true;
          break;
        case "KeyA":
          keys.current.left = true;
          break;
        case "KeyD":
          keys.current.right = true;
          break;
      }
    };

    const handleKeyUp = e => {
      switch (e.code) {
        case "KeyW":
          keys.current.forward = false;
          break;
        case "KeyS":
          keys.current.backward = false;
          break;
        case "KeyA":
          keys.current.left = false;
          break;
        case "KeyD":
          keys.current.right = false;
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isLocked]);

  // Handle movement
  useFrame(() => {
    if (!isLocked || !controlsRef.current) return;

    const camera = controlsRef.current.getObject();
    const direction = new THREE.Vector3();

    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    const forward = cameraDirection.clone();
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(new THREE.Vector3(0, 1, 0), forward).normalize();

    if (keys.current.forward) direction.add(forward);
    if (keys.current.backward) direction.sub(forward);
    if (keys.current.right) direction.add(right);
    if (keys.current.left) direction.sub(right);

    if (direction.length() > 0) {
      direction.normalize().multiplyScalar(moveSpeed);
      camera.position.add(direction);
    }
  });
  const [currentLocation, setCurrentLocation] = useState("");
  // Handle location changes and scene triggers
  useEffect(() => {
    if (!controlsRef.current) return;
    const location = getCurrentLocation();
    if (!location || location.MetaLocation === currentLocation) return;

    setCurrentLocation(location.MetaLocation);

    if (isLocked) {
      controlsRef.current.unlock();
    }

    const controls = controlsRef.current;
    const camera = controls.getObject();

    // 1. Animate camera position
    gsap.to(camera.position, {
      duration: 1,
      x: location.position[0],
      y: location.position[1],
      z: location.position[2],
      ease: "power2.inOut",
    });

    // 2. Animate camera rotation to lookAt
    if (location.lookAt) {
      // Create a temporary Object3D at the new camera position
      const dummy = new THREE.Object3D();
      dummy.position.set(location.position[0], location.position[1], location.position[2]);
      // Point it at the lookAt target
      dummy.lookAt(new THREE.Vector3(location.lookAt[0], location.lookAt[1], location.lookAt[2]));
      dummy.rotateY(-Math.PI);
      // Clone its quaternion
      const targetQuat = dummy.quaternion.clone();

      // Tween the camera’s quaternion
      gsap.to(camera.quaternion, {
        duration: 1,
        x: targetQuat.x,
        y: targetQuat.y,
        z: targetQuat.z,
        w: targetQuat.w,
        ease: "power2.inOut",
      });
    }
  }, [state.MetaLocation, getCurrentLocation]);

  // Get current scene trigger for video and highlight updates
  const currentTrigger = getCurrentSceneTrigger();

  return (
    <>
      {/* <color attach="background" args={["#61b8ff"]} /> */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      <PerspectiveCamera makeDefault position={[0, 1.6, 0]} />
      <PointerLockControls ref={controlsRef} />
      <Environment files={"hdr/Cannon_Exterior.hdr"} background />
      <Cyberscene config={state} currentTrigger={currentTrigger} />
    </>
  );
};

export default Scene;
