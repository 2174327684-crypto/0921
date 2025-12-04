import * as THREE from 'three';

// Palette
export const COLORS = {
  EMERALD_DEEP: '#001A05',
  EMERALD_MID: '#046307',
  EMERALD_LIGHT: '#1E8F23',
  GOLD_METALLIC: '#FFD700',
  GOLD_CHAMPAGNE: '#F7E7CE',
  GOLD_ROSE: '#E6BE8A',
  RED_VELVET: '#8B0000', // Deep red for gifts
  RED_BRIGHT: '#D40000',
  BG_GRADIENT_START: '#000000',
  BG_GRADIENT_END: '#011404',
};

// 3D Settings
export const SCENE_CONFIG = {
  PARTICLE_COUNT: 4500, // Significantly increased for denser foliage
  ORNAMENT_COUNT: 200,
  GIFT_COUNT: 60,       // New gift decorations
  TREE_HEIGHT: 15,
  TREE_RADIUS: 5.0,     // Slightly reduced for tighter look
  SCATTER_RADIUS: 25,
};

// Animation Settings
export const ANIMATION_CONFIG = {
  LERP_SPEED: 0.04, // Global speed of interpolation
  ROTATION_SPEED: 0.1, // Idle rotation speed
};

// Reusable Three.js Objects (to avoid recreation)
export const V_TEMP = new THREE.Vector3();
export const Q_TEMP = new THREE.Quaternion();
export const E_TEMP = new THREE.Euler();
export const M_TEMP = new THREE.Matrix4();
export const C_TEMP = new THREE.Color();