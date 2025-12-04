import React, { useMemo, useRef, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TreeMorphState, ParticleData } from '../types';
import { ANIMATION_CONFIG, M_TEMP, Q_TEMP, V_TEMP, E_TEMP } from '../constants';

interface MorphingParticlesProps {
  data: ParticleData[];
  state: TreeMorphState;
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  name: string;
}

export const MorphingParticles: React.FC<MorphingParticlesProps> = ({
  data,
  state,
  geometry,
  material,
  name
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  // Initialize instances
  useLayoutEffect(() => {
    if (!meshRef.current) return;
    
    data.forEach((particle, i) => {
      // Set Color
      meshRef.current!.setColorAt(i, particle.color);
      
      // Set Initial Matrix (Scattered)
      V_TEMP.copy(particle.scatterPosition);
      E_TEMP.copy(particle.scatterRotation);
      Q_TEMP.setFromEuler(E_TEMP);
      M_TEMP.compose(V_TEMP, Q_TEMP, new THREE.Vector3(particle.scale, particle.scale, particle.scale));
      meshRef.current!.setMatrixAt(i, M_TEMP);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, [data]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    const isTree = state === TreeMorphState.TREE_SHAPE;
    let needsUpdate = false;

    // We interpolate every particle
    for (let i = 0; i < data.length; i++) {
      const p = data[i];

      const targetPos = isTree ? p.treePosition : p.scatterPosition;
      const targetRot = isTree ? p.treeRotation : p.scatterRotation;

      // Distance check to stop calculating if close enough (Optimization)
      // However, for smooth continuous organic feel, we might want to keep them moving slightly
      // For this "High Fidelity" request, we calculate every frame for smoothness.

      // Interpolate Position
      // Using a custom lerp factor based on delta and particle speed for variety
      const lerpFactor = THREE.MathUtils.clamp(p.speed * (delta * 60), 0, 1);

      p.currentPosition.lerp(targetPos, lerpFactor);

      // Interpolate Rotation (Quaternion slerp is better, but Euler lerp is cheaper and fine here)
      // Converting to Quaternions for proper interpolation
      const currentQ = new THREE.Quaternion().setFromEuler(p.currentRotation);
      const targetQ = new THREE.Quaternion().setFromEuler(targetRot);
      currentQ.slerp(targetQ, lerpFactor);
      p.currentRotation.setFromQuaternion(currentQ);

      // Apply to Matrix
      V_TEMP.copy(p.currentPosition);
      Q_TEMP.setFromEuler(p.currentRotation);
      
      // Add a gentle floating wave effect if in tree mode
      if (isTree) {
         const time = Date.now() * 0.001;
         V_TEMP.y += Math.sin(time + p.id * 0.1) * 0.02; 
      } else {
         // Float randomly in scatter mode
         const time = Date.now() * 0.0005;
         V_TEMP.x += Math.sin(time + p.id) * 0.01;
         V_TEMP.y += Math.cos(time + p.id * 0.5) * 0.01;
      }

      M_TEMP.compose(V_TEMP, Q_TEMP, new THREE.Vector3(p.scale, p.scale, p.scale));
      meshRef.current.setMatrixAt(i, M_TEMP);
      needsUpdate = true;
    }

    if (needsUpdate) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
    
    // Slowly rotate the whole container if it's a tree for cinematic effect
    if (isTree) {
       meshRef.current.rotation.y += delta * 0.05;
    } else {
       // Slow rotation in scatter mode too
       meshRef.current.rotation.y += delta * 0.01;
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, data.length]}
      castShadow
      receiveShadow
    />
  );
};
