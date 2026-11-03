/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Heart, Sparkles, Ghost, Shield } from 'lucide-react';
import { sound } from '../game/sound';

interface CreditsModalProps {
  onClose: () => void;
}

export const CreditsModal: React.FC<CreditsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-purple-500/40 rounded-3xl p-6 md:p-8 shadow-2xl relative text-center">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Ghost className="w-5 h-5 text-purple-400" />
            <h2 className="font-arcade text-sm text-white tracking-wider">
              CREDITS
            </h2>
          </div>
          <button
            onClick={() => {
              sound.playButton();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="my-6 space-y-4 text-left">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <h3 className="font-spooky text-2xl text-orange-400 glow-orange">
              PUMPKIN PANIC
            </h3>
            <div className="text-[10px] font-arcade text-purple-300 mt-1">
              SURVIVE THE NIGHT (EDITION 2026)
            </div>
            <p className="text-xs font-sans-clean text-slate-400 mt-2 leading-relaxed">
              &ldquo;One Forest. Endless Nightmares. Three Minutes to Survive.&rdquo;
              An indie Halloween arcade survival game crafted with pixel passion.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5 text-xs font-sans-clean text-slate-300">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Game Engine</span>
              <span className="font-arcade text-[10px] text-amber-400">HTML5 Canvas 2D</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Audio System</span>
              <span className="font-arcade text-[10px] text-purple-400">Web Audio Synth</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Pixel Art & FX</span>
              <span className="font-arcade text-[10px] text-orange-400">Vector Pixel Sprites</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">High Scores</span>
              <span className="font-arcade text-[10px] text-sky-400">Local Storage</span>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-3 border-t border-slate-800">
          <button
            onClick={() => {
              sound.playButton();
              onClose();
            }}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-arcade text-xs tracking-wider transition-colors cursor-pointer"
          >
            BACK TO MENU
          </button>
        </div>
      </div>
    </div>
  );
};
