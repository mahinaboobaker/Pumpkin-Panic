/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Sparkles, Shield, Zap, Flame, Heart, Clock } from 'lucide-react';
import { sound } from '../game/sound';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'basics' | 'enemies' | 'items'>('basics');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-purple-500/40 rounded-3xl p-6 md:p-8 shadow-[0_0_60px_rgba(168,85,247,0.3)] relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="font-spooky text-3xl md:text-4xl text-orange-400 glow-orange">
              HOW TO PLAY
            </h2>
            <p className="text-[10px] font-arcade text-purple-300 mt-0.5">
              SURVIVE 3 MINUTES UNTIL SUNRISE
            </p>
          </div>
          <button
            onClick={() => {
              sound.playButton();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-4 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              sound.playButton();
              setActiveTab('basics');
            }}
            className={`flex-1 py-2 px-3 rounded-lg font-arcade text-[10px] md:text-xs transition-colors cursor-pointer ${
              activeTab === 'basics' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            OBJECTIVE & CONTROLS
          </button>
          <button
            onClick={() => {
              sound.playButton();
              setActiveTab('items');
            }}
            className={`flex-1 py-2 px-3 rounded-lg font-arcade text-[10px] md:text-xs transition-colors cursor-pointer ${
              activeTab === 'items' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            PUMPKINS & POWER-UPS
          </button>
          <button
            onClick={() => {
              sound.playButton();
              setActiveTab('enemies');
            }}
            className={`flex-1 py-2 px-3 rounded-lg font-arcade text-[10px] md:text-xs transition-colors cursor-pointer ${
              activeTab === 'enemies' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            MONSTERS & STAGES
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto mt-4 pr-1 text-left space-y-4 text-xs font-sans-clean text-slate-300">
          {activeTab === 'basics' && (
            <div className="space-y-4">
              {/* Mission */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center gap-2 text-amber-400 font-arcade text-xs mb-1.5">
                  <Clock className="w-4 h-4" />
                  <span>THE 3-MINUTE SURVIVAL MISSION</span>
                </div>
                <p className="leading-relaxed text-slate-300">
                  You are a brave little jack-o&apos;-lantern trapped in a haunted forest on Halloween night.
                  Survive against relentless spooky creatures for <span className="text-amber-300 font-bold">3 full minutes (180s)</span> until dawn breaks and banishes the curse!
                </p>
              </div>

              {/* Controls Grid */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="font-arcade text-xs text-purple-300 mb-3">KEYBOARD CONTROLS</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-300">Move Character</span>
                    <div className="flex items-center gap-1 font-arcade text-[10px] text-orange-400">
                      <span className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">W</span>
                      <span className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">A</span>
                      <span className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">S</span>
                      <span className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">D</span>
                      <span className="text-slate-500 text-[8px] mx-1">OR</span>
                      <span className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">ARROWS</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-300">Jack-o&apos;-Lantern Fire Nova</span>
                    <span className="px-2 py-0.5 bg-orange-600/30 border border-orange-500/50 rounded font-arcade text-[10px] text-amber-300">
                      SPACE
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-300">Pause Game</span>
                    <span className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-arcade text-[10px] text-slate-300">
                      ESC / P
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-300">Mobile / Tablet</span>
                    <span className="text-sky-300 font-arcade text-[9px]">
                      TOUCH JOYSTICK + NOVA BUTTON
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'items' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-orange-500/30 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-orange-600/20 border border-orange-500/50 flex items-center justify-center shrink-0">
                  <span className="text-lg">🎃</span>
                </div>
                <div>
                  <div className="font-arcade text-xs text-orange-400">Normal Pumpkin</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Awards +10 Points. Harvest regularly to push your record score!</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-yellow-500/30 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-yellow-600/20 border border-yellow-500/50 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                </div>
                <div>
                  <div className="font-arcade text-xs text-yellow-300">Golden Pumpkin</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Rare glowing relic! Awards +50 Points and bursts into sparkles.</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-pink-500/30 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-pink-600/20 border border-pink-500/50 flex items-center justify-center shrink-0">
                  <Heart className="w-4 h-4 text-pink-400" />
                </div>
                <div>
                  <div className="font-arcade text-xs text-pink-400">Magic Pumpkin</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Restores 1 lost pumpkin life (up to 3 max), or +30 bonus points if full.</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-purple-500/30 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/50 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <div className="font-arcade text-xs text-purple-400">Speed Potion</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Grants +50% movement speed for 8 seconds with purple flame trail.</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-sky-500/30 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-sky-600/20 border border-sky-500/50 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4 text-sky-400" />
                </div>
                <div>
                  <div className="font-arcade text-xs text-sky-400">Shield Amulet</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Surrounds you with an orbital protective bubble that absorbs 1 monster attack without losing life!</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-red-500/30 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/50 flex items-center justify-center shrink-0">
                  <Flame className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <div className="font-arcade text-xs text-red-400">Fire Pumpkin</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Detonates an infernal firestorm! Instantly incinerates ALL monsters on screen for +15 pts each!</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'enemies' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-950/60 border border-sky-400/40 flex items-center justify-center shrink-0 text-sky-300 font-arcade text-xs">
                  👻
                </div>
                <div>
                  <div className="font-arcade text-xs text-sky-300">Ghost (Stage 1+)</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Ethereal spirits that drift through forest obstacles directly toward you. Slow, but surround you if ignored.</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 text-slate-200 font-arcade text-xs">
                  💀
                </div>
                <div>
                  <div className="font-arcade text-xs text-slate-200">Skeleton (Stage 2+)</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Fast bone warriors that charge quickly when aligned with your pumpkin. Dodge around trees to shake them!</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-400/40 flex items-center justify-center shrink-0 text-purple-300 font-arcade text-xs">
                  🦇
                </div>
                <div>
                  <div className="font-arcade text-xs text-purple-300">Bat (Stage 1+)</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Flies in unpredictable sinusoidal swoops at high speed. Hard to dodge without sudden direction changes.</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-red-950/60 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-950/80 border border-red-500/50 flex items-center justify-center shrink-0 text-red-400 font-arcade text-xs">
                  👿
                </div>
                <div>
                  <div className="font-arcade text-xs text-red-400">Shadow Monster (Stage 3 Nightmare)</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Eldritch shadow beast with blazing crimson eyes. Stalks stealthily before lunging in lethal sprint bursts!</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Close Button */}
        <div className="pt-4 border-t border-slate-800 mt-4">
          <button
            onClick={() => {
              sound.playButton();
              onClose();
            }}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-arcade text-xs tracking-wider transition-colors cursor-pointer"
          >
            GOT IT – BACK TO MENU
          </button>
        </div>
      </div>
    </div>
  );
};
