/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, VolumeX, Pause, Shield, Zap, Flame } from 'lucide-react';
import { GameStats, Player } from '../game/types';
import { sound } from '../game/sound';

interface GameHUDProps {
  player: Player;
  stats: GameStats;
  timer: number;
  survivalGoal: number;
  onPause: () => void;
  onSpecial: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  player,
  stats,
  timer,
  survivalGoal,
  onPause,
  onSpecial,
  isMuted,
  onToggleMute,
}) => {
  const timeLeft = Math.max(0, survivalGoal - timer);
  const minutes = Math.floor(timeLeft / 60);
  const seconds = Math.floor(timeLeft % 60);
  const timeFormatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  const timeProgress = Math.min(100, (timer / survivalGoal) * 100);

  const specialReady = player.specialCooldown <= 0;
  const specialPercent = Math.min(
    100,
    ((player.specialMaxCooldown - player.specialCooldown) / player.specialMaxCooldown) * 100
  );

  const stageBadge =
    stats.stage === 1 ? { name: 'STAGE 1: TWILIGHT DREAD', color: 'text-purple-300 border-purple-500/40 bg-purple-950/60' } :
    stats.stage === 2 ? { name: 'STAGE 2: MIDNIGHT GRAVEYARD', color: 'text-amber-300 border-amber-500/40 bg-amber-950/60' } :
    { name: 'STAGE 3: BLOOD MOON NIGHTMARE', color: 'text-red-400 border-red-500/50 bg-red-950/70 animate-pulse' };

  return (
    <div className="absolute inset-x-0 top-0 pointer-events-none p-3 md:p-5 flex flex-col gap-2 z-10 select-none">
      {/* Top Bar Row */}
      <div className="flex items-center justify-between gap-3 max-w-6xl mx-auto w-full">
        {/* Lives: 3 Carved Jack-o'-Lanterns */}
        <div className="flex items-center gap-2 bg-slate-950/75 backdrop-blur-md px-3.5 py-2 rounded-xl border border-orange-500/30 shadow-lg pointer-events-auto">
          <span className="text-[10px] font-arcade tracking-wider text-orange-400/90 hidden sm:inline">LIVES</span>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((heartIndex) => {
              const isAlive = player.lives >= heartIndex;
              return (
                <div
                  key={heartIndex}
                  className={`relative transition-all duration-300 transform ${
                    isAlive ? 'scale-100 opacity-100 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]' : 'scale-75 opacity-25 grayscale'
                  }`}
                >
                  <svg className="w-6 h-6 md:w-7 md:h-7" viewBox="0 0 24 24" fill="none">
                    {/* Pumpkin silhouette */}
                    <ellipse cx="12" cy="13" rx="10" ry="8.5" fill={isAlive ? '#ea580c' : '#475569'} />
                    <ellipse cx="7" cy="13" rx="4.5" ry="8" fill={isAlive ? '#c2410c' : '#334155'} />
                    <ellipse cx="17" cy="13" rx="4.5" ry="8" fill={isAlive ? '#c2410c' : '#334155'} />
                    <ellipse cx="12" cy="13" rx="5" ry="8.5" fill={isAlive ? '#f97316' : '#64748b'} />
                    {/* Green stem */}
                    <path d="M12 4.5 C 11.5 2, 13 1, 14 1 C 13.5 3, 13 4.5, 12 4.5" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
                    {/* Glowing face when alive */}
                    {isAlive ? (
                      <>
                        <polygon points="8.5,10 10.5,10 9.5,8" fill="#fef08a" />
                        <polygon points="13.5,10 15.5,10 14.5,8" fill="#fef08a" />
                        <polygon points="8,14 10,16 12,14 14,16 16,14 14.5,14 13,15 12,14 11,15 9.5,14" fill="#fef08a" />
                      </>
                    ) : (
                      <path d="M8 11 L16 16 M16 11 L8 16" stroke="#0f172a" strokeWidth="1.5" />
                    )}
                  </svg>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Countdown Clock & Stage Banner */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-4 py-2 rounded-xl border border-purple-500/40 shadow-xl">
            <span className="text-[10px] font-arcade text-purple-300 hidden sm:inline">SURVIVE</span>
            <span
              className={`font-arcade text-lg md:text-2xl tracking-widest tabular-nums ${
                timeLeft <= 30 ? 'text-red-400 animate-pulse glow-orange' : 'text-orange-400'
              }`}
            >
              {timeFormatted}
            </span>
          </div>
          {/* Stage name */}
          <div className={`mt-1 text-[9px] md:text-[10px] font-arcade tracking-wider px-2.5 py-0.5 rounded-full border backdrop-blur-sm ${stageBadge.color}`}>
            {stageBadge.name}
          </div>
        </div>

        {/* Right side: Score & Controls */}
        <div className="flex items-center gap-2">
          {/* Score display */}
          <div className="flex flex-col items-end bg-slate-950/75 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-amber-500/30 shadow-lg pointer-events-auto">
            <div className="text-[9px] font-arcade text-amber-400/80">
              SCORE: <span className="text-white font-arcade tabular-nums">{stats.score}</span>
            </div>
            <div className="text-[8px] font-arcade text-slate-400">
              BEST: <span className="text-amber-300 font-arcade tabular-nums">{stats.highScore}</span>
            </div>
          </div>

          {/* Sound Mute Toggle */}
          <button
            onClick={() => {
              sound.playButton();
              onToggleMute();
            }}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors pointer-events-auto shadow-md"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-orange-400" />}
          </button>

          {/* Pause Button */}
          <button
            onClick={() => {
              sound.playButton();
              onPause();
            }}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors pointer-events-auto shadow-md"
            title="Pause Game (ESC / P)"
          >
            <Pause className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Second Row: Active Buffs & Special Power Cooldown Gauge */}
      <div className="flex items-center justify-between max-w-6xl mx-auto w-full px-1">
        {/* Active Buffs (Speed Potion & Shield) */}
        <div className="flex items-center gap-2">
          {player.shieldActive && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-950/80 border border-sky-400/50 text-sky-300 text-xs shadow-[0_0_10px_rgba(56,189,248,0.3)]">
              <Shield className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              <span className="font-arcade text-[8px] tracking-wider">SHIELD ON</span>
            </div>
          )}

          {player.speedBoostTimer > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-400/50 text-purple-300 text-xs shadow-[0_0_10px_rgba(168,85,247,0.3)]">
              <Zap className="w-3.5 h-3.5 text-purple-400 animate-bounce" />
              <span className="font-arcade text-[8px] tracking-wider">
                SPEED {Math.ceil(player.speedBoostTimer)}s
              </span>
            </div>
          )}
        </div>

        {/* Special Ability: Fire Nova Indicator */}
        <div
          onClick={() => {
            if (specialReady) onSpecial();
          }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all pointer-events-auto ${
            specialReady
              ? 'bg-gradient-to-r from-orange-600/90 to-amber-600/90 border-amber-300/80 cursor-pointer shadow-[0_0_15px_rgba(249,115,22,0.8)] animate-pulse'
              : 'bg-slate-900/80 border-slate-700/60 opacity-80 cursor-not-allowed'
          }`}
          title="Fire Nova (SPACE / Click)"
        >
          <div className="relative flex items-center justify-center">
            <Flame className={`w-4 h-4 ${specialReady ? 'text-amber-100 fill-amber-300' : 'text-slate-400'}`} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className={`text-[8px] font-arcade tracking-wider ${specialReady ? 'text-white' : 'text-slate-400'}`}>
                FIRE NOVA
              </span>
              <kbd className="text-[7px] font-mono px-1 py-0.2 bg-black/40 rounded text-amber-300 border border-amber-400/30">
                SPACE
              </kbd>
            </div>
            {!specialReady && (
              <div className="w-20 bg-slate-800 h-1 rounded-full overflow-hidden mt-0.5">
                <div
                  className="bg-orange-500 h-full transition-all duration-200"
                  style={{ width: `${specialPercent}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
