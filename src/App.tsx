/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-fuchsia-500/30">
      {/* Abstract Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />

      <header className="mb-8 z-10 text-center flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 drop-shadow-[0_0_10px_rgba(217,70,239,0.5)] tracking-tighter uppercase italic">
          Neon <span className="font-sans font-light px-1">&</span> Synth
        </h1>
        <p className="text-zinc-500 uppercase tracking-[0.3em] text-xs mt-2 font-mono">
          Retro Cybernetic Entertainment
        </p>
      </header>
      
      <main className="z-10 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 w-full max-w-6xl">
        <div className="w-full flex justify-center lg:justify-end">
          <SnakeGame />
        </div>
        
        <div className="w-full flex justify-center lg:justify-start">
          <MusicPlayer />
        </div>
      </main>

      <footer className="mt-12 z-10 font-mono text-xs text-zinc-600 text-center tracking-widest uppercase">
        <p>© {new Date().getFullYear()} AI Studio Build</p>
      </footer>
    </div>
  );
}

