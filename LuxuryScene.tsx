import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { Environment, Sparkles, Stars, ContactShadows } from '@react-three/drei';
import { MorphingParticles } from './MorphingParticles';
import { SCENE_CONFIG, COLORS } from '../constants';
import { generateTreeData } from '../utils/geometry';
import { TreeMorphState, ParticleData } from '../types';

interface LuxurySceneProps {
  treeState: TreeMorphState;
}

export const LuxuryScene: React.FC<LuxurySceneProps> = ({ treeState }) => {
  const { viewport } = useThree();

  // --- Geometry & Materials ---
  
  // 1. Leaves: Camphor Tree Shape
  const leafGeo = useMemo(() => {
     const shape = new THREE.Shape();
     shape.moveTo(0, 0);
     shape.bezierCurveTo(0.15, 0.1, 0.15, 0.4, 0, 0.6); 
     shape.bezierCurveTo(-0.15, 0.4, -0.15, 0.1, 0, 0);

     const extrudeSettings = {
       depth: 0.01,
       bevelEnabled: true,
       bevelThickness: 0.01,
       bevelSize: 0.005,
       bevelSegments: 2
     };
     return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  const leafMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: COLORS.EMERALD_MID,
    roughness: 0.2,
    metalness: 0.1,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1,
    emissive: COLORS.EMERALD_DEEP,
    emissiveIntensity: 0.1,
    side: THREE.DoubleSide,
    envMapIntensity: 1.5,
  }), []);

  // 2. Ornaments: Spheres
  const ornamentGeo = useMemo(() => new THREE.SphereGeometry(0.5, 32, 32), []);
  const ornamentMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: COLORS.GOLD_METALLIC,
    roughness: 0.1,
    metalness: 1.0,
    emissive: COLORS.GOLD_CHAMPAGNE,
    emissiveIntensity: 0.5,
    envMapIntensity: 2.0,
  }), []);

  // 3. Gifts: Boxes
  const giftGeo = useMemo(() => {
    // Chamfered box for luxury look
    const geo = new THREE.BoxGeometry(1, 1, 1);
    return geo;
  }, []);
  
  const giftMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: COLORS.RED_VELVET,
    roughness: 0.3,
    metalness: 0.4,
    envMapIntensity: 1.5,
  }), []);

  // 4. Star: 5-Pointed Star
  const starGeo = useMemo(() => {
    const starShape = new THREE.Shape();
    const outerRadius = 1.2;
    const innerRadius = 0.5;
    const points = 5;
    
    for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i / (points * 2)) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) starShape.moveTo(x, y);
        else starShape.lineTo(x, y);
    }
    starShape.closePath();
    
    return new THREE.ExtrudeGeometry(starShape, {
        depth: 0.4,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.05,
        bevelSegments: 3
    });
  }, []);

  const starMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: COLORS.GOLD_METALLIC,
    roughness: 0.1,
    metalness: 1.0,
    emissive: COLORS.GOLD_METALLIC,
    emissiveIntensity: 1.0, // High glow
    envMapIntensity: 3.0,
  }), []);

  // --- Data Generation ---
  
  const leafData = useMemo(() => generateTreeData({
    count: SCENE_CONFIG.PARTICLE_COUNT,
    radius: SCENE_CONFIG.TREE_RADIUS,
    height: SCENE_CONFIG.TREE_HEIGHT,
    scatterRadius: SCENE_CONFIG.SCATTER_RADIUS
  }, 'leaf'), []);

  const ornamentData = useMemo(() => generateTreeData({
    count: SCENE_CONFIG.ORNAMENT_COUNT,
    radius: SCENE_CONFIG.TREE_RADIUS * 0.9,
    height: SCENE_CONFIG.TREE_HEIGHT,
    scatterRadius: SCENE_CONFIG.SCATTER_RADIUS
  }, 'ornament'), []);

  const giftData = useMemo(() => generateTreeData({
    count: SCENE_CONFIG.GIFT_COUNT,
    radius: SCENE_CONFIG.TREE_RADIUS * 0.8,
    height: SCENE_CONFIG.TREE_HEIGHT,
    scatterRadius: SCENE_CONFIG.SCATTER_RADIUS,
    minYNorm: 0.05, // Keep gifts mostly in lower 80%
    maxYNorm: 0.8,
  }, 'gift'), []);

  // Star Data (Single Particle)
  const starData: ParticleData[] = useMemo(() => {
     const topY = SCENE_CONFIG.TREE_HEIGHT / 2; // Top of tree
     return [{
        id: 9999,
        treePosition: new THREE.Vector3(0, topY + 0.5, 0),
        treeRotation: new THREE.Euler(0, 0, 0),
        scatterPosition: new THREE.Vector3(0, 40, 0), // Scatter high up
        scatterRotation: new THREE.Euler(Math.PI/2, 0, 0),
        currentPosition: new THREE.Vector3(0, 40, 0),
        currentRotation: new THREE.Euler(0, 0, 0),
        speed: 0.03,
        scale: 1.5, // Large star
        color: new THREE.Color(COLORS.GOLD_METALLIC),
     }];
  }, []);


  return (
    <group position={[0, -2, 0]}>
      {/* Environment for Reflections */}
      <Environment preset="city" />
      
      {/* Cinematic Lighting */}
      <ambientLight intensity={0.2} color={COLORS.EMERALD_DEEP} />
      <spotLight 
        position={[10, 20, 10]} 
        angle={0.3} 
        penumbra={0.5} 
        intensity={100} 
        color={COLORS.GOLD_CHAMPAGNE} 
        castShadow 
      />
      <pointLight 
        position={[-10, 5, -10]} 
        intensity={50} 
        color={COLORS.EMERALD_LIGHT} 
      />
      {/* Warm glow from bottom for gifts */}
      <pointLight
        position={[0, -5, 5]}
        intensity={20}
        color={COLORS.RED_BRIGHT}
        distance={15}
      />
      
      {/* The Morphing Elements */}
      <group>
        <MorphingParticles 
            name="leaves"
            data={leafData} 
            state={treeState} 
            geometry={leafGeo} 
            material={leafMat} 
        />
        <MorphingParticles 
            name="ornaments"
            data={ornamentData} 
            state={treeState} 
            geometry={ornamentGeo} 
            material={ornamentMat} 
        />
        <MorphingParticles 
            name="gifts"
            data={giftData} 
            state={treeState} 
            geometry={giftGeo} 
            material={giftMat} 
        />
         <MorphingParticles 
            name="star"
            data={starData} 
            state={treeState} 
            geometry={starGeo} 
            material={starMat} 
        />
      </group>

      {/* Background Ambience */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Floating dust/gold motes */}
      <Sparkles 
        count={500} 
        scale={20} 
        size={4} 
        speed={0.4} 
        opacity={0.5} 
        color={COLORS.GOLD_ROSE} 
      />

      {/* Ground Reflection */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -SCENE_CONFIG.TREE_HEIGHT / 2 - 1, 0]}>
         <planeGeometry args={[100, 100]} />
         <meshStandardMaterial 
            color="#000" 
            roughness={0} 
            metalness={0.8} 
         />
      </mesh>
      
      <ContactShadows opacity={0.7} scale={40} blur={2} far={10} resolution={256} color="#000000" />
    </group>
  );
};