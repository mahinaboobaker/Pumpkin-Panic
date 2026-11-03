/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RotateCcw, Home, Sun, Trophy, Award, Flame, Sparkles } from 'lucide-react';
import { sound } from '../game/sound';
import { GameStats } from '../game/types';

interface VictoryModalProps {
  stats: GameStats;
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  stats,
  onPlayAgain,
  onMainMenu,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md select-none animate-in fade-in zoom-in-95 duration-300">
      <div className="w-full max-w-lg bg-slate-900 border border-amber-500/50 rounded-3xl p-6 md:p-8 shadow-[0_0_80px_rgba(250,204,21,0.4)] text-center relative overflow-hidden">
        {/* Golden Dawn Aura */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/25 rounded-full blur-3xl pointer-events-none" />

        {/* Sunrise Emblem */}
        <div className="relative mx-auto mb-3 w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 bg-amber-400/20 rounded-full animate-ping duration-1000" />
          <div className="relative p-4 rounded-2xl bg-amber-950/80 border border-amber-400/60 shadow-inner">
            <Sun className="w-10 h-10 text-amber-400 drop-shadow-[0_0_15px_rgba(250,204,21,1)]" />
          </div>
          <Sparkles className="w-6 h-6 text-amber-300 absolute -top-1 -right-2 animate-spin duration-[3000ms]" />
        </div>

        {/* Victory Title */}
        <h2 className="font-spooky text-5xl md:text-6xl text-amber-400 tracking-wider glow-gold leading-tight">
          YOU SURVIVED THE NIGHT!
        </h2>
        <p className="text-xs font-arcade text-amber-200/90 mt-2">
          Dawn breaks over the haunted forest. The curse is broken!
        </p>

        {/* Completion Bonus Callout */}
        <div className="my-3 py-1.5 px-4 bg-amber-500/15 border border-amber-500/40 rounded-full inline-flex items-center gap-2 text-amber-300 text-[10px] font-arcade tracking-wider">
          <Award className="w-4 h-4 text-amber-400" />
          <span>+500 SURVIVAL CHAMPION BONUS INCLUDED!</span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-5 p-4 rounded-2xl bg-slate-950/85 border border-slate-800 text-left">
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-[9px] font-arcade text-slate-400">TOTAL SCORE</div>
            <div className="text-base md:text-lg font-arcade text-amber-300 mt-1 tabular-nums">
              {stats.score}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-[9px] font-arcade text-slate-400">TIME</div>
            <div className="text-base md:text-lg font-arcade text-emerald-400 mt-1">
              3:00 FULL
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-[9px] font-arcade text-slate-400">GOLDEN</div>
            <div className="text-base md:text-lg font-arcade text-yellow-400 mt-1 tabular-nums">
              {stats.goldenPumpkins}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-[9px] font-arcade text-slate-400">BANISHED</div>
            <div className="text-base md:text-lg font-arcade text-orange-400 mt-1 tabular-nums">
              {stats.monstersBanished}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={() => {
              sound.playButton();
              onPlayAgain();
            }}
            className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-arcade text-xs md:text-sm tracking-wider font-extrabold shadow-[0_0_25px_rgba(250,204,21,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 fill-slate-950" />
            <span>PLAY AGAIN</span>
          </button>

          <button
            onClick={() => {
              sound.playButton();
              onMainMenu();
            }}
            className="flex-1 py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-arcade text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>MAIN MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};
