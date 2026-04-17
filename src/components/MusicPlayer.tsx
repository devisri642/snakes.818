import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';
import { TRACKS } from '../constants/tracks';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Could not play audio", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev === 0 ? TRACKS.length - 1 : prev - 1));
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev === TRACKS.length - 1 ? 0 : prev + 1));
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className="bg-zinc-900 border border-fuchsia-500/50 shadow-[0_0_20px_rgba(217,70,239,0.2)] rounded-xl p-4 w-80 text-fuchsia-400 font-mono flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="bg-fuchsia-500/20 p-2 rounded-lg border border-fuchsia-500/30">
          <Music className="w-6 h-6 text-fuchsia-400" />
        </div>
        <div className="flex-1 overflow-hidden">
          <h2 className="text-sm font-bold truncate tracking-wider text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
            {currentTrack.title}
          </h2>
          <p className="text-xs text-fuchsia-500/70 truncate uppercase tracking-widest">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button 
          onClick={prevTrack}
          className="p-2 rounded-full hover:bg-fuchsia-500/20 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <SkipBack className="w-5 h-5 text-fuchsia-400 hover:text-cyan-400 transition-colors" />
        </button>
        <button 
          onClick={togglePlay}
          className="p-3 bg-fuchsia-500/20 rounded-full border border-fuchsia-500/50 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-[0_0_15px_rgba(217,70,239,0.3)] hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] text-fuchsia-400 hover:text-cyan-400"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
        </button>
        <button 
          onClick={nextTrack}
          className="p-2 rounded-full hover:bg-fuchsia-500/20 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <SkipForward className="w-5 h-5 text-fuchsia-400 hover:text-cyan-400 transition-colors" />
        </button>
      </div>
      
      <div className="flex items-center gap-3 px-2">
        <Volume2 className="w-4 h-4 text-fuchsia-500/70" />
        <input 
          type="range" 
          min="0" max="1" step="0.01" 
          value={volume} 
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="flex-1 h-1 bg-fuchsia-950 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(34,211,238,0.8)]"
        />
      </div>

      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={handleEnded}
      />
    </div>
  );
}
