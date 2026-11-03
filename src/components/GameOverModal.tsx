/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RotateCcw, Home, Skull, Trophy, Clock, Flame } from 'lucide-react';
import { sound } from '../game/sound';
import { GameStats } from '../game/types';

interface GameOverModalProps {
  stats: GameStats;
  timer: number;
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  stats,
  timer,
  onPlayAgain,
  onMainMenu,
}) => {
  const minutes = Math.floor(timer / 60);
  const seconds = Math.floor(timer % 60);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md select-none animate-in fade-in zoom-in-95 duration-300">
      <div className="w-full max-w-md bg-slate-900 border border-red-600/50 rounded-3xl p-6 md:p-8 shadow-[0_0_60px_rgba(220,38,38,0.4)] text-center relative overflow-hidden">
        {/* Sinister Red Aura */}
        <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-600/25 rounded-full blur-3xl pointer-events-none" />

        {/* Animated Cracked Skull / Broken Pumpkin */}
        <div className="relative mx-auto mb-3 w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 bg-red-600/20 rounded-full animate-ping duration-1000" />
          <div className="relative p-4 rounded-2xl bg-red-950/80 border border-red-500/50 shadow-inner">
            <Skull className="w-10 h-10 text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.9)]" />
          </div>
        </div>

        {/* Game Over Title */}
        <h2 className="font-spooky text-5xl md:text-6xl text-red-500 tracking-wider glow-orange">
          GAME OVER
        </h2>
        <p className="text-xs font-arcade text-slate-400 mt-1">
          The haunted darkness consumed you...
        </p>

        {/* New Record Banner if applicable */}
        {stats.newHighScore && (
          <div className="my-3 py-1 px-3 bg-amber-500/20 border border-amber-500/50 rounded-full inline-flex items-center gap-2 text-amber-300 text-[10px] font-arcade tracking-wider animate-bounce">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>NEW HIGH SCORE RECORD!</span>
          </div>
        )}

        {/* Run Stats Grid */}
        <div className="grid grid-cols-2 gap-2.5 my-5 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left">
          <div className="p-2 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <div className="flex items-center gap-1.5 text-[9px] font-arcade text-slate-400">
              <Trophy className="w-3 h-3 text-amber-400" />
              <span>FINAL SCORE</span>
            </div>
            <div className="text-lg font-arcade text-amber-300 mt-1 tabular-nums">
              {stats.score}
            </div>
          </div>

          <div className="p-2 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <div className="flex items-center gap-1.5 text-[9px] font-arcade text-slate-400">
              <Clock className="w-3 h-3 text-sky-400" />
              <span>SURVIVED</span>
            </div>
            <div className="text-lg font-arcade text-white mt-1 tabular-nums">
              {minutes}m {seconds}s
            </div>
          </div>

          <div className="p-2 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <div className="text-[9px] font-arcade text-slate-400">PUMPKINS</div>
            <div className="text-sm font-arcade text-orange-400 mt-1 tabular-nums">
              {stats.pumpkinsCollected + stats.goldenPumpkins}
            </div>
          </div>

          <div className="p-2 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <div className="flex items-center gap-1 text-[9px] font-arcade text-slate-400">
              <Flame className="w-3 h-3 text-red-400" />
              <span>BANISHED</span>
            </div>
            <div className="text-sm font-arcade text-red-400 mt-1 tabular-nums">
              {stats.monstersBanished}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          {/* Play Again */}
          <button
            onClick={() => {
              sound.playButton();
              onPlayAgain();
            }}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 hover:from-orange-500 hover:to-amber-400 text-slate-950 font-arcade text-xs md:text-sm tracking-wider font-extrabold shadow-[0_0_25px_rgba(249,115,22,0.8)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 fill-slate-950" />
            <span>PLAY AGAIN</span>
          </button>

          {/* Main Menu */}
          <button
            onClick={() => {
              sound.playButton();
              onMainMenu();
            }}
            className="w-full py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white font-arcade text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>MAIN MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};
