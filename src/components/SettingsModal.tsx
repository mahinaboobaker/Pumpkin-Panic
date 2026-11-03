/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Volume2, Music, Bell, Smartphone, Sparkles } from 'lucide-react';
import { sound } from '../game/sound';

interface SettingsModalProps {
  onClose: () => void;
  touchControlsEnabled: boolean;
  onToggleTouchControls: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  touchControlsEnabled,
  onToggleTouchControls,
}) => {
  const [volume, setVolume] = useState(sound.settings.volume);
  const [musicMuted, setMusicMuted] = useState(sound.settings.musicMuted);
  const [sfxMuted, setSfxMuted] = useState(sound.settings.sfxMuted);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    sound.setVolume(val);
  };

  const handleToggleMusic = () => {
    const muted = sound.toggleMusic();
    setMusicMuted(muted);
  };

  const handleToggleSfx = () => {
    const muted = sound.toggleSfx();
    setSfxMuted(muted);
    if (!muted) sound.playButton();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 md:p-8 shadow-2xl relative text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-orange-400" />
            <h2 className="font-arcade text-sm md:text-base text-white tracking-wider">
              SETTINGS
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

        {/* Settings options */}
        <div className="space-y-4 my-5">
          {/* Master Volume */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between text-xs font-arcade text-slate-300 mb-2">
              <span className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-orange-400" />
                MASTER VOLUME
              </span>
              <span className="text-orange-400 tabular-nums">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
          </div>

          {/* Music Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <Music className="w-4 h-4 text-purple-400" />
              <div>
                <div className="text-xs font-arcade text-slate-200">BACKGROUND MUSIC</div>
                <div className="text-[10px] text-slate-500 font-sans-clean mt-0.5">Procedural Halloween synth soundtrack</div>
              </div>
            </div>
            <button
              onClick={handleToggleMusic}
              className={`px-3 py-1.5 rounded-xl font-arcade text-[10px] transition-colors cursor-pointer ${
                !musicMuted ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {!musicMuted ? 'ON' : 'MUTED'}
            </button>
          </div>

          {/* SFX Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-xs font-arcade text-slate-200">SOUND EFFECTS</div>
                <div className="text-[10px] text-slate-500 font-sans-clean mt-0.5">Pickups, attacks, and nova blasts</div>
              </div>
            </div>
            <button
              onClick={handleToggleSfx}
              className={`px-3 py-1.5 rounded-xl font-arcade text-[10px] transition-colors cursor-pointer ${
                !sfxMuted ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {!sfxMuted ? 'ON' : 'MUTED'}
            </button>
          </div>

          {/* Touch Controls Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-sky-400" />
              <div>
                <div className="text-xs font-arcade text-slate-200">ON-SCREEN TOUCH CONTROLS</div>
                <div className="text-[10px] text-slate-500 font-sans-clean mt-0.5">Virtual joystick and action buttons</div>
              </div>
            </div>
            <button
              onClick={() => {
                sound.playButton();
                onToggleTouchControls();
              }}
              className={`px-3 py-1.5 rounded-xl font-arcade text-[10px] transition-colors cursor-pointer ${
                touchControlsEnabled ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {touchControlsEnabled ? 'VISIBLE' : 'HIDDEN'}
            </button>
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
            SAVE & CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
