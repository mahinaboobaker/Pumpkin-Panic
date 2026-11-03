/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, HelpCircle, Settings, Award, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { sound } from '../game/sound';

interface MainMenuProps {
  highScore: number;
  onPlay: () => void;
  onHowToPlay: () => void;
  onSettings: () => void;
  onCredits: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  highScore,
  onPlay,
  onHowToPlay,
  onSettings,
  onCredits,
  isMuted,
  onToggleMute,
}) => {
  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-between p-6 overflow-hidden select-none">
      {/* Background Cover Image with atmospheric overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transform animate-pulse duration-[8000ms]"
        style={{
          backgroundImage: `url('/src/assets/images/pumpkin_panic_cover_1793674878240.jpg')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-purple-950/60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,5,20,0.8)_85%)]" />

      {/* Top Header Controls: Sound & High Score */}
      <div className="relative z-10 w-full max-w-5xl flex items-center justify-between pt-2">
        {/* High Score Badge */}
        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl border border-amber-500/30 shadow-lg">
          <Award className="w-4 h-4 text-amber-400" />
          <span className="text-[10px] md:text-xs font-arcade text-amber-300">
            RECORD: <span className="text-white font-arcade tabular-nums">{highScore} PTS</span>
          </span>
        </div>

        {/* Mute button */}
        <button
          onClick={() => {
            sound.playButton();
            onToggleMute();
          }}
          className="flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white transition-colors shadow-lg cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-orange-400" />}
          <span className="text-[10px] font-arcade hidden sm:inline">{isMuted ? 'UNMUTE' : 'SOUND ON'}</span>
        </button>
      </div>

      {/* Center Section: Logo, Animated Pumpkin Hero & Tagline */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl my-auto">
        {/* Animated Pumpkin Hero Mascot */}
        <div className="relative mb-3 animate-float">
          <div className="w-24 h-24 md:w-32 md:h-32 relative drop-shadow-[0_0_35px_rgba(249,115,22,0.9)]">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Outer Glow */}
              <circle cx="50" cy="54" r="42" fill="url(#pumpkinGrad)" />
              {/* Green Stalk */}
              <path
                d="M50 20 C 47 6, 57 4, 62 4 C 58 12, 54 20, 50 20"
                fill="#166534"
                stroke="#15803d"
                strokeWidth="2"
              />
              {/* Stem leaf */}
              <ellipse cx="63" cy="8" rx="8" ry="4" transform="rotate(-15 63 8)" fill="#22c55e" />
              {/* Pumpkin Lobes */}
              <ellipse cx="25" cy="54" rx="20" ry="34" fill="#c2410c" />
              <ellipse cx="75" cy="54" rx="20" ry="34" fill="#c2410c" />
              <ellipse cx="34" cy="54" rx="20" ry="36" fill="#ea580c" />
              <ellipse cx="66" cy="54" rx="20" ry="36" fill="#ea580c" />
              <ellipse cx="50" cy="54" rx="22" ry="37" fill="#f97316" />

              {/* Glowing Jack-o'-Lantern Eyes */}
              <polygon points="32,46 44,46 38,36" fill="#fef08a" filter="drop-shadow(0 0 4px #f59e0b)" />
              <polygon points="56,46 68,46 62,36" fill="#fef08a" filter="drop-shadow(0 0 4px #f59e0b)" />
              {/* Nose */}
              <polygon points="46,51 54,51 50,47" fill="#fef08a" />
              {/* Jagged Grin */}
              <polygon
                points="26,62 36,74 44,66 50,75 56,66 64,74 74,62 67,61 62,67 56,60 50,65 44,60 38,67 33,61"
                fill="#fef08a"
                filter="drop-shadow(0 0 6px #f59e0b)"
              />
              <defs>
                <radialGradient id="pumpkinGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#7c2d12" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
          </div>
          {/* Subtle sparkles */}
          <Sparkles className="w-6 h-6 text-yellow-300 absolute -top-1 -right-2 animate-spin duration-[4000ms]" />
        </div>

        {/* Main Title Logo */}
        <h1 className="font-spooky text-6xl md:text-8xl tracking-wider text-orange-500 glow-orange leading-none select-none">
          PUMPKIN PANIC
        </h1>

        <div className="mt-1 font-arcade text-xs md:text-sm tracking-[0.25em] text-purple-300 font-bold glow-purple">
          SURVIVE THE NIGHT
        </div>

        {/* Tagline */}
        <p className="mt-3 text-xs md:text-sm font-sans-clean text-slate-300/90 max-w-lg leading-relaxed">
          &ldquo;One Forest. Endless Nightmares. Three Minutes to Survive.&rdquo;
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 mt-7 w-full justify-center">
          {/* Play Button */}
          <button
            onClick={() => {
              sound.playButton();
              onPlay();
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 hover:from-orange-500 hover:to-amber-400 text-slate-950 font-arcade text-sm md:text-base tracking-wider font-extrabold shadow-[0_0_30px_rgba(249,115,22,0.8)] hover:shadow-[0_0_45px_rgba(249,115,22,1)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer group"
          >
            <Play className="w-5 h-5 fill-slate-950 group-hover:scale-110 transition-transform" />
            <span>PLAY NOW</span>
          </button>

          {/* How to Play Button */}
          <button
            onClick={() => {
              sound.playButton();
              onHowToPlay();
            }}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900/85 hover:bg-slate-850 border border-purple-500/40 hover:border-purple-400 text-purple-200 font-arcade text-xs md:text-sm tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-purple-400" />
            <span>HOW TO PLAY</span>
          </button>
        </div>

        {/* Secondary Utility Controls */}
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={() => {
              sound.playButton();
              onSettings();
            }}
            className="px-4 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-slate-400 hover:text-slate-200 font-arcade text-[10px] tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>SETTINGS</span>
          </button>

          <button
            onClick={() => {
              sound.playButton();
              onCredits();
            }}
            className="px-4 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-slate-400 hover:text-slate-200 font-arcade text-[10px] tracking-wider transition-colors cursor-pointer"
          >
            <span>CREDITS</span>
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 text-[11px] font-sans-clean text-slate-400/80 flex items-center gap-2 text-center pb-2">
        <span>Controls: WASD or Arrow Keys</span>
        <span>·</span>
        <span>Space for Fire Nova</span>
        <span>·</span>
        <span>Survive 3:00 to Win</span>
      </div>
    </div>
  );
};
