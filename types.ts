import * as THREE from 'three';

export enum TreeMorphState {
  SCATTERED = 'SCATTERED',
  TREE_SHAPE = 'TREE_SHAPE',
}

export interface ParticleData {
  id: number;
  // The target position when forming the tree
  treePosition: THREE.Vector3;
  treeRotation: THREE.Euler;
  // The target position when scattered
  scatterPosition: THREE.Vector3;
  scatterRotation: THREE.Euler;
  // Current interpolated state
  currentPosition: THREE.Vector3;
  currentRotation: THREE.Euler;
  // Random speed factor for organic movement
  speed: number;
  scale: number;
  color: THREE.Color;
}

export interface TreeConfig {
  count: number;
  radius: number;
  height: number;
  scatterRadius: number;
  // Optional vertical constraints (0 to 1)
  minYNorm?: number; 
  maxYNorm?: number;
}