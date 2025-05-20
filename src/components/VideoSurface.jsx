import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function VideoSurface({ mesh, videoId, loop = true, autoplay = true, isActive = true }) {
  const videoElementRef = useRef(null);
  const videoTextureRef = useRef(null);
  const videoMaterialRef = useRef(null); // Stores the THREE.Material instance for video
  const originalMaterialRef = useRef(null); // Stores the original material of the mesh
  const isInitializedRef = useRef(false); // To track if basic setup is done

  useEffect(() => {
    if (!mesh || !mesh.material) {
      // If mesh is invalid, nothing to do. Cleanup will be handled by unmount effect if needed.
      return;
    }

    // Initialize resources: Happens once per component instance
    // (effectively per mesh/videoId due to keying in Cyberscene.jsx)
    if (!isInitializedRef.current) {
      originalMaterialRef.current = mesh.material; // Store original material

      const video = document.createElement('video');
      video.src = `/videos/${videoId}.mp4`;
      video.loop = loop;
      video.muted = true; // Essential for autoplay in most browsers
      video.crossOrigin = 'anonymous';
      video.setAttribute('playsinline', 'true'); // For iOS Safari
      videoElementRef.current = video;

      const texture = new THREE.VideoTexture(video);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.flipY = false; // Often necessary for video textures
      videoTextureRef.current = texture;

      videoMaterialRef.current = new THREE.MeshBasicMaterial({ map: texture });
      
      isInitializedRef.current = true;
    } else {
      // If already initialized, update mutable properties like loop or videoId if they can change
      // For videoId, Cyberscene's keying should cause a remount, making this less critical for src.
      if (videoElementRef.current && videoElementRef.current.src !== `/videos/${videoId}.mp4`) {
        videoElementRef.current.src = `/videos/${videoId}.mp4`;
      }
      if (videoElementRef.current) {
        videoElementRef.current.loop = loop;
      }
    }

    // Apply material and manage playback based on isActive
    if (isActive) {
      if (mesh.material !== videoMaterialRef.current && videoMaterialRef.current) {
        mesh.material = videoMaterialRef.current;
      }
      if (autoplay && videoElementRef.current && videoElementRef.current.paused) {
        videoElementRef.current.play().catch(error => console.error(`Video play failed for ${videoId}:`, error));
      }
    } else {
      // Not active: restore original material and pause video
      if (mesh.material === videoMaterialRef.current && originalMaterialRef.current) {
        mesh.material = originalMaterialRef.current;
      }
      if (videoElementRef.current && !videoElementRef.current.paused) {
        videoElementRef.current.pause();
      }
    }

    // The main effect doesn't need a complex cleanup if the unmount effect handles all disposals.
    // However, pausing the video if dependencies change might be considered.
    // For now, relying on play/pause logic within the effect body.

  }, [mesh, videoId, loop, autoplay, isActive]);

  // Effect for cleanup on unmount
  useEffect(() => {
    // Capture current refs for the cleanup function's closure
    const videoEl = videoElementRef.current;
    const texture = videoTextureRef.current;
    const videoMat = videoMaterialRef.current;
    const originalMat = originalMaterialRef.current;
    // Keep a reference to the mesh instance at the time of this effect setup
    const currentMesh = mesh; 

    return () => {
      // This runs only when the component unmounts
      if (videoEl) {
        videoEl.pause();
        videoEl.removeAttribute('src'); // Detach source
        videoEl.load(); // Abort pending loads/playback
        videoEl.remove(); // Remove from DOM
      }
      if (texture) {
        texture.dispose();
      }
      if (videoMat) {
        videoMat.dispose(); // Dispose the Three.js material
      }

      // Restore original material IF the mesh still exists and currently has the video material
      // This is a safeguard.
      if (currentMesh && originalMat && currentMesh.material === videoMat) {
        currentMesh.material = originalMat;
      }
      
      // Clear refs to help with garbage collection and indicate cleanup
      isInitializedRef.current = false;
      videoElementRef.current = null;
      videoTextureRef.current = null;
      videoMaterialRef.current = null;
      originalMaterialRef.current = null;
    };
  }, [mesh]); // Re-run this setup/cleanup if the mesh instance itself changes.
            // Given Cyberscene's keying, this might be equivalent to `[]` if mesh per instance is stable.
            // Using `[mesh]` is safer if mesh identity could change for a "persistent" conceptual surface.

  return null; // This component does not render anything itself
} 