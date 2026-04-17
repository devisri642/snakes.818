import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, RotateCcw, Trophy } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const BASE_SPEED = 150;

type Point = { x: number; y: number };

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  let isOccupied = true;
  while (isOccupied) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    isOccupied = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
  }
  return newFood!;
};

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 15, y: 5 });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  
  // Ref to hold the current direction to prevent multiple rapid key presses
  // turning the snake back on itself before the next tick.
  const currentDirRef = useRef(INITIAL_DIRECTION);
  const nextDirRef = useRef(INITIAL_DIRECTION);
  // Need food ref to use inside game loop without adding to dependency array
  const foodRef = useRef(food);

  useEffect(() => {
    foodRef.current = food;
  }, [food]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    currentDirRef.current = INITIAL_DIRECTION;
    nextDirRef.current = INITIAL_DIRECTION;
    const newFood = generateFood(INITIAL_SNAKE);
    setFood(newFood);
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && !gameOver) {
        setIsPaused(prev => !prev);
        return;
      }

      if (isPaused || gameOver) return;

      const { x, y } = currentDirRef.current;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (y !== 1) nextDirRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (y !== -1) nextDirRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (x !== 1) nextDirRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (x !== -1) nextDirRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, gameOver]);

  const gameLoop = useCallback(() => {
    if (isPaused || gameOver) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      currentDirRef.current = nextDirRef.current;
      const currentDir = currentDirRef.current;
      const newHead = { x: head.x + currentDir.x, y: head.y + currentDir.y };

      // Check wall collision
      if (
        newHead.x < 0 || 
        newHead.x >= GRID_SIZE || 
        newHead.y < 0 || 
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        setHighScore(prevHigh => Math.max(prevHigh, score));
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        setHighScore(prevHigh => Math.max(prevHigh, score));
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food eating
      if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [isPaused, gameOver, score]);

  useEffect(() => {
    // Increase speed slightly as score goes up
    const speed = Math.max(50, BASE_SPEED - Math.floor(score / 50) * 10);
    const intervalId = setInterval(gameLoop, speed);
    return () => clearInterval(intervalId);
  }, [gameLoop, score]);

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-zinc-900 border border-cyan-500/50 shadow-[0_0_30px_rgba(34,211,238,0.15)] rounded-2xl w-full max-w-md relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-10" 
        style={{
          backgroundImage: 'linear-gradient(rgba(34, 211, 238, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.5) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />
      
      <div className="flex justify-between w-full font-mono z-10 px-2">
        <div className="flex flex-col">
          <span className="text-xs text-cyan-500/70 uppercase tracking-widest">Score</span>
          <span className="text-2xl font-black text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] leading-none">{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-fuchsia-500/70 uppercase tracking-widest flex items-center gap-1">
            <Trophy className="w-3 h-3" /> High
          </span>
          <span className="text-xl font-bold text-fuchsia-400 drop-shadow-[0_0_6px_rgba(217,70,239,0.8)] leading-none">{highScore}</span>
        </div>
      </div>

      <div className="relative z-10 p-2 rounded-xl bg-black border-2 border-zinc-800 shadow-[inset_0_0_20px_rgba(0,0,0,1)]">
        <div 
          className="grid gap-px bg-zinc-900/50 relative"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            width: '300px',
            height: '300px'
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnakeHead = snake[0].x === x && snake[0].y === y;
            const isSnakeBody = snake.some((segment, idx) => idx !== 0 && segment.x === x && segment.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div 
                key={i} 
                className={`w-full h-full rounded-sm transition-all duration-75 ${
                  isSnakeHead 
                    ? 'bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,1)] z-10' 
                    : isSnakeBody 
                      ? 'bg-cyan-500/80 shadow-[0_0_5px_rgba(6,182,212,0.5)]' 
                      : isFood 
                        ? 'bg-fuchsia-500 shadow-[0_0_12px_rgba(217,70,239,1)] animate-pulse rounded-full scale-75' 
                        : 'bg-transparent'
                }`}
              />
            );
          })}
        </div>

        {/* Overlays */}
        {(isPaused || gameOver) && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center rounded-xl z-20">
            <div className="flex flex-col items-center gap-6 bg-zinc-900/90 p-6 rounded-xl border border-fuchsia-500/30 shadow-[0_0_30px_rgba(217,70,239,0.2)]">
              {gameOver ? (
                <>
                  <div className="text-center font-mono">
                    <h2 className="text-3xl font-black text-fuchsia-400 drop-shadow-[0_0_10px_rgba(217,70,239,0.8)] mb-2 uppercase tracking-widest">Game Over</h2>
                    <p className="text-cyan-400">Final Score: {score}</p>
                  </div>
                  <button 
                    onClick={resetGame}
                    className="flex items-center gap-2 px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-lg font-bold tracking-wider transition-all shadow-[0_0_15px_rgba(217,70,239,0.5)] hover:shadow-[0_0_25px_rgba(217,70,239,0.8)] focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    <RotateCcw className="w-5 h-5" /> RESTART
                  </button>
                </>
              ) : (
                <>
                  <div className="text-center font-mono text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
                    <h2 className="text-2xl font-bold mb-2 uppercase tracking-wider">Ready?</h2>
                    <p className="text-xs text-zinc-400 uppercase tracking-widest drop-shadow-none">Press Space to Pause/Play</p>
                    <div className="flex justify-center gap-4 mt-4 opacity-70">
                      <div className="flex flex-col items-center"><span className="p-1 px-2 mb-1 border border-zinc-700 rounded text-xs bg-zinc-800">W</span><span className="text-[10px]">UP</span></div>
                      <div className="flex flex-col items-center"><span className="p-1 px-2 mb-1 border border-zinc-700 rounded text-xs bg-zinc-800">A</span><span className="text-[10px]">LEFT</span></div>
                      <div className="flex flex-col items-center"><span className="p-1 px-2 mb-1 border border-zinc-700 rounded text-xs bg-zinc-800">S</span><span className="text-[10px]">DOWN</span></div>
                      <div className="flex flex-col items-center"><span className="p-1 px-2 mb-1 border border-zinc-700 rounded text-xs bg-zinc-800">D</span><span className="text-[10px]">RIGHT</span></div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsPaused(false)}
                    className="flex items-center gap-2 px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.5)] hover:shadow-[0_0_25px_rgba(6,182,212,0.8)] focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                  >
                    <Play className="w-5 h-5" /> PLAY
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
