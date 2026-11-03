/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, RotateCcw, Home, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../game/sound';
import { GameStats } from '../game/types';

interface PauseModalProps {
  stats: GameStats;
  timer: number;
  onResume: () => void;
  onRestart: () => void;
  onMainMenu: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  stats,
  timer,
  onResume,
  onRestart,
  onMainMenu,
  isMuted,
  onToggleMute,
}) => {
  const minutes = Math.floor(timer / 60);
  const seconds = Math.floor(timer % 60);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-purple-500/40 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(168,85,247,0.3)] text-center relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Title */}
        <h2 className="font-spooky text-4xl md:text-5xl text-purple-400 glow-purple tracking-wide">
          GAME PAUSED
        </h2>
        <p className="text-xs font-arcade text-slate-400 mt-1">Take a breath, brave little pumpkin</p>

        {/* Current Run Summary */}
        <div className="grid grid-cols-2 gap-3 my-6 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-left">
          <div>
            <div className="text-[10px] font-arcade text-slate-500">SURVIVAL TIME</div>
            <div className="text-base font-arcade text-orange-400 mt-0.5 tabular-nums">
              {minutes}m {seconds}s
            </div>
          </div>
          <div>
            <div className="text-[10px] font-arcade text-slate-500">CURRENT SCORE</div>
            <div className="text-base font-arcade text-amber-300 mt-0.5 tabular-nums">
              {stats.score} PTS
            </div>
          </div>
          <div>
            <div className="text-[10px] font-arcade text-slate-500">STAGE</div>
            <div className="text-xs font-arcade text-purple-300 mt-0.5">
              Stage {stats.stage}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-arcade text-slate-500">MONSTERS BANISHED</div>
            <div className="text-xs font-arcade text-slate-300 mt-0.5 tabular-nums">
              {stats.monstersBanished}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          {/* Resume */}
          <button
            onClick={() => {
              sound.playButton();
              onResume();
            }}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-slate-950 font-arcade text-xs md:text-sm tracking-wider font-bold shadow-[0_0_20px_rgba(249,115,22,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>RESUME SURVIVAL</span>
          </button>

          {/* Restart */}
          <button
            onClick={() => {
              sound.playButton();
              onRestart();
            }}
            className="w-full py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-arcade text-xs tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-orange-400" />
            <span>RESTART GAME</span>
          </button>

          {/* Main Menu */}
          <button
            onClick={() => {
              sound.playButton();
              onMainMenu();
            }}
            className="w-full py-3 px-6 rounded-xl bg-slate-950/70 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 font-arcade text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>MAIN MENU</span>
          </button>
        </div>

        {/* Audio quick toggle */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-sans-clean text-slate-400">
          <span>Audio Atmosphere</span>
          <button
            onClick={() => {
              sound.playButton();
              onToggleMute();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-orange-400" />}
            <span className="text-[10px] font-arcade">{isMuted ? 'UNMUTE' : 'MUTE'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
