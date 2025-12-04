import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import { LuxuryScene } from './components/LuxuryScene';
import { PostEffects } from './components/PostProcessing';
import { TreeMorphState } from './types';
import { COLORS } from './constants';

function App() {
  const [treeState, setTreeState] = useState<TreeMorphState>(TreeMorphState.SCATTERED);

  const toggleState = () => {
    setTreeState((prev) => 
      prev === TreeMorphState.SCATTERED 
        ? TreeMorphState.TREE_SHAPE 
        : TreeMorphState.SCATTERED
    );
  };

  return (
    <div className="w-full h-screen relative bg-black">
      {/* 3D Canvas */}
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 35], fov: 45, near: 0.1, far: 200 }}
        gl={{ antialias: false, toneMappingExposure: 1.2 }}
      >
        <color attach="background" args={[COLORS.BG_GRADIENT_START]} />
        <fog attach="fog" args={[COLORS.BG_GRADIENT_END, 20, 90]} />
        
        <Suspense fallback={null}>
          <LuxuryScene treeState={treeState} />
          <PostEffects />
        </Suspense>
      </Canvas>
      
      <Loader />

      {/* UI Overlay */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col justify-between p-8 md:p-12 z-10">
        
        {/* Header */}
        <header className="flex flex-col items-center md:items-start text-center md:text-left">
          <h1 
            className="text-4xl md:text-6xl font-serif text-[#FFD700] tracking-widest drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]"
            style={{ fontFamily: '"Cinzel", serif' }}
          >
            MERRY
          </h1>
          <h1 
            className="text-3xl md:text-5xl font-serif text-[#E6BE8A] tracking-widest mt-2 drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]"
            style={{ fontFamily: '"Cinzel", serif' }}
          >
            CHRISTMAS
          </h1>
          <p className="text-emerald-400 text-sm md:text-base tracking-[0.3em] uppercase mt-4 opacity-80 font-serif">
            Interactive Holiday Experience
          </p>
        </header>

        {/* Central Info (Optional, hidden on small screens) */}
        <div className="hidden md:flex flex-col items-center justify-center opacity-50">
            <span className="text-[10px] text-gold tracking-widest uppercase mb-1">Status</span>
            <span className="text-xs text-white tracking-widest">{treeState === TreeMorphState.SCATTERED ? 'AWAITING SPIRIT' : 'MAGIC ASSEMBLED'}</span>
        </div>

        {/* Footer / Controls */}
        <footer className="flex flex-col items-center md:items-end pointer-events-auto">
          <div className="flex flex-col items-center gap-4">
             <p className="text-[#E6BE8A] text-xs tracking-wider italic font-serif opacity-70 max-w-[200px] text-center md:text-right">
                {treeState === TreeMorphState.SCATTERED 
                  ? "The magic is scattered. Gather the joy." 
                  : "Let the festive spirit fill the air."}
             </p>
             
             <button
              onClick={toggleState}
              className="group relative px-8 py-3 bg-transparent border border-[#FFD700] text-[#FFD700] 
                         uppercase tracking-[0.2em] text-sm font-bold transition-all duration-700 ease-out
                         hover:bg-[#FFD700] hover:text-black overflow-hidden"
             >
                <span className="relative z-10">
                  {treeState === TreeMorphState.SCATTERED ? 'Gather Tree' : 'Release Magic'}
                </span>
                
                {/* Glow effect on hover */}
                <div className="absolute inset-0 w-full h-full bg-[#FFD700] opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-500"></div>
             </button>
          </div>
        </footer>
      </div>

      {/* Decorative Border */}
      <div className="absolute top-0 left-0 w-full h-full border-[1px] border-[#FFD700] opacity-10 pointer-events-none m-4 box-border" style={{ width: 'calc(100% - 2rem)', height: 'calc(100% - 2rem)' }}></div>
    </div>
  );
}

export default App;