import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const HighlightManager = ({ highlightedMaterialObjects, isActive = true }) => {
  const highlightMaterialsRef = useRef([]); // list of materials currently highlighted
  const originalMaterialStateRef = useRef(new Map()); // material -> { color, emissive }
  const blinkValueRef = useRef(0.5);

  const setHighlight = (material) => {
    if (material) {
      // Save original state only once
      if (!originalMaterialStateRef.current.has(material)) {
        originalMaterialStateRef.current.set(material, {
          color: material.color.clone(),
          emissive: material.emissive.clone(),
          emissiveIntensity: material.emissiveIntensity,
        });
      }

      material.transparent = false;
      material.color.set('#cf303f');
      material.emissive.set('#cf303f');
      material.emissiveIntensity = 1;
    }
  };

  const resetHighlight = (material) => {
    if (material && originalMaterialStateRef.current.has(material)) {
      const original = originalMaterialStateRef.current.get(material);
      material.color.copy(original.color);
      material.emissive.copy(original.emissive);
      material.emissiveIntensity = original.emissiveIntensity;
      originalMaterialStateRef.current.delete(material); // Clean up
    }
  };

  const resetAllHighlights = () => {
    highlightMaterialsRef.current.forEach(resetHighlight);
    highlightMaterialsRef.current = [];
  };

  useEffect(() => {
    // Reset any previously highlighted materials
    resetAllHighlights();

    if (isActive && highlightedMaterialObjects?.length > 0) {
      const validMaterials = highlightedMaterialObjects.filter(Boolean);
      validMaterials.forEach(setHighlight);
      highlightMaterialsRef.current = validMaterials;
    }
  }, [highlightedMaterialObjects, isActive]);

  useEffect(() => {
    return () => {
      resetAllHighlights();
    };
  }, []);

  useFrame(() => {
    if (!isActive) return;

    const blinkValue = 0.7 + Math.abs(Math.sin(Date.now() / 500) * 1.9);
    blinkValueRef.current = blinkValue;

    highlightMaterialsRef.current.forEach((material) => {
      if (material) {
        material.emissiveIntensity = blinkValue;
      }
    });
  });

  return null;
};

export default HighlightManager;
