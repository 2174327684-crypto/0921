import * as THREE from 'three';
import { ParticleData, TreeConfig } from '../types';
import { COLORS } from '../constants';

/**
 * Generates data for particles that can morph between a cone tree and a scattered sphere.
 */
export const generateTreeData = (config: TreeConfig, type: 'leaf' | 'ornament' | 'gift' = 'leaf'): ParticleData[] => {
  const particles: ParticleData[] = [];
  const { count, radius, height, scatterRadius, minYNorm = 0, maxYNorm = 1 } = config;

  for (let i = 0; i < count; i++) {
    // --- Tree Shape Generation (Cone / Spiral) ---
    // Normalized height (0 to 1) mapped to the requested range
    const range = maxYNorm - minYNorm;
    const yNorm = minYNorm + (i / count) * range;
    
    // Invert y so 0 is bottom, 1 is top (relative to tree height)
    // The tree centers at 0 on Y, so it goes from -height/2 to +height/2
    const y = (yNorm - 0.5) * height; 
    
    // Radius at this height (cone shape: wider at bottom)
    // We adjust radius based on how high up we are on the *entire* tree, not just the segment
    const r = radius * (1 - yNorm);
    
    // Golden Angle spiral for distribution
    const phi = i * Math.PI * (3 - Math.sqrt(5)); 
    
    let treeX = r * Math.cos(phi);
    let treeZ = r * Math.sin(phi);

    // Jitter
    let jitter = 0.5;
    if (type === 'ornament') jitter = 0.2;
    if (type === 'gift') jitter = 0.8; // Gifts are bit more random on branches

    const treePos = new THREE.Vector3(
      treeX + (Math.random() - 0.5) * jitter, 
      y, 
      treeZ + (Math.random() - 0.5) * jitter
    );

    // Rotation Logic
    let treeRot: THREE.Euler;

    if (type === 'leaf') {
        treeRot = new THREE.Euler(
            Math.random() * Math.PI, // Random pitch
            Math.atan2(treeX, treeZ), // Face out
            Math.random() * Math.PI * 2 // Random roll
        );
    } else if (type === 'gift') {
        // Gifts sit flat-ish or dangle, but for this style, random box orientation looks rich
        treeRot = new THREE.Euler(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
    } else {
        // Ornaments
        treeRot = new THREE.Euler(
            0, 
            Math.atan2(treeX, treeZ), 
            0
        );
    }

    // --- Scattered Shape Generation (Random inside Sphere) ---
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phiSphere = Math.acos(2 * v - 1);
    const rSphere = scatterRadius * Math.cbrt(Math.random()); // Cubic root for uniform distribution
    
    const scatterPos = new THREE.Vector3(
      rSphere * Math.sin(phiSphere) * Math.cos(theta),
      rSphere * Math.sin(phiSphere) * Math.sin(theta),
      rSphere * Math.cos(phiSphere)
    );

    const scatterRot = new THREE.Euler(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    );

    // Color logic
    let colorHex = COLORS.EMERALD_MID;
    let scale = 1;

    if (type === 'ornament') {
       colorHex = Math.random() > 0.5 ? COLORS.GOLD_METALLIC : COLORS.GOLD_ROSE;
       scale = 0.3 + Math.random() * 0.4;
    } else if (type === 'gift') {
       // Mix of Deep Red and Gold
       colorHex = Math.random() > 0.4 ? COLORS.RED_VELVET : COLORS.GOLD_METALLIC;
       scale = 0.5 + Math.random() * 0.4; // Box size
    } else {
       // LEAVES
       const rand = Math.random();
       if (rand > 0.95) colorHex = COLORS.GOLD_METALLIC;
       else if (rand > 0.7) colorHex = COLORS.EMERALD_LIGHT;
       else colorHex = COLORS.EMERALD_MID;
       
       scale = 0.8 + Math.random() * 0.5;
    }

    particles.push({
      id: i,
      treePosition: treePos,
      treeRotation: treeRot,
      scatterPosition: scatterPos,
      scatterRotation: scatterRot,
      currentPosition: scatterPos.clone(), 
      currentRotation: scatterRot.clone(),
      speed: 0.02 + Math.random() * 0.04, 
      scale: scale,
      color: new THREE.Color(colorHex),
    });
  }

  return particles;
};