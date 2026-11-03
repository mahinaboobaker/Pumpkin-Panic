/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Flame } from 'lucide-react';
import { sound } from '../game/sound';

interface MobileControlsProps {
  onMove: (vx: number, vy: number) => void;
  onSpecial: () => void;
  specialReady: boolean;
  specialPercent: number;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onMove,
  onSpecial,
  specialReady,
  specialPercent,
}) => {
  const joystickRef = useRef<HTMLDivElement>(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const activeTouchId = useRef<number | null>(null);

  const resetJoystick = useCallback(() => {
    setIsDragging(false);
    activeTouchId.current = null;
    setKnobPos({ x: 0, y: 0 });
    onMove(0, 0);
  }, [onMove]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (activeTouchId.current !== null) return;
    const touch = e.changedTouches[0];
    activeTouchId.current = touch.identifier;
    setIsDragging(true);
    handleTouchMove(e);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!joystickRef.current || activeTouchId.current === null) return;

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === activeTouchId.current) {
        const rect = joystickRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const maxRadius = rect.width / 2 - 12;
        let dx = touch.clientX - centerX;
        let dy = touch.clientY - centerY;
        const dist = Math.hypot(dx, dy);

        if (dist > maxRadius) {
          dx = (dx / dist) * maxRadius;
          dy = (dy / dist) * maxRadius;
        }

        setKnobPos({ x: dx, y: dy });

        // Normalize vector from -1 to 1
        const normX = dx / maxRadius;
        const normY = dy / maxRadius;
        onMove(normX, normY);
        break;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === activeTouchId.current) {
        resetJoystick();
        break;
      }
    }
  };

  useEffect(() => {
    const handleGlobalTouchEnd = () => {
      if (activeTouchId.current !== null) {
        resetJoystick();
      }
    };
    window.addEventListener('touchend', handleGlobalTouchEnd);
    window.addEventListener('touchcancel', handleGlobalTouchEnd);
    return () => {
      window.removeEventListener('touchend', handleGlobalTouchEnd);
      window.removeEventListener('touchcancel', handleGlobalTouchEnd);
    };
  }, [resetJoystick]);

  return (
    <div className="absolute inset-x-0 bottom-0 pointer-events-none p-5 pb-8 flex items-end justify-between z-20 select-none">
      {/* Left Virtual Joystick */}
      <div
        ref={joystickRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className="relative w-32 h-32 rounded-full bg-slate-950/60 backdrop-blur-md border-2 border-purple-500/40 shadow-xl flex items-center justify-center pointer-events-auto touch-none"
      >
        {/* Joystick Base Crosshairs */}
        <div className="absolute w-full h-[1px] bg-purple-500/20" />
        <div className="absolute h-full w-[1px] bg-purple-500/20" />

        {/* Movable Knob */}
        <div
          className={`w-14 h-14 rounded-full bg-gradient-to-tr from-purple-700 to-indigo-500 border-2 border-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.7)] transform transition-transform ${
            isDragging ? 'duration-75 scale-95' : 'duration-200'
          }`}
          style={{
            transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
          }}
        />
      </div>

      {/* Right Action Button (Jack-o'-Lantern Fire Nova) */}
      <div className="pointer-events-auto">
        <button
          onClick={() => {
            if (specialReady) {
              onSpecial();
            }
          }}
          disabled={!specialReady}
          className={`relative w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center shadow-2xl transition-all cursor-pointer ${
            specialReady
              ? 'bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-600 border-amber-300 shadow-[0_0_25px_rgba(249,115,22,0.9)] active:scale-95 animate-pulse'
              : 'bg-slate-900/80 border-slate-700 opacity-60 cursor-not-allowed'
          }`}
        >
          <Flame className={`w-8 h-8 ${specialReady ? 'text-slate-950 fill-amber-300' : 'text-slate-500'}`} />
          <span className={`text-[8px] font-arcade mt-1 tracking-wider ${specialReady ? 'text-slate-950 font-bold' : 'text-slate-400'}`}>
            {specialReady ? 'NOVA' : `${Math.round(specialPercent)}%`}
          </span>

          {/* Cooldown Ring */}
          {!specialReady && (
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="44"
                cy="44"
                r="40"
                stroke="currentColor"
                strokeWidth="4"
                className="text-orange-500/40"
                fill="transparent"
                strokeDasharray="251.2"
                strokeDashoffset={`${251.2 * (1 - specialPercent / 100)}`}
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};
