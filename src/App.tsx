/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine } from './game/engine';
import { GameStats, Player, ScreenState } from './game/types';
import { sound } from './game/sound';
import { MainMenu } from './components/MainMenu';
import { GameHUD } from './components/GameHUD';
import { PauseModal } from './components/PauseModal';
import { GameOverModal } from './components/GameOverModal';
import { VictoryModal } from './components/VictoryModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { SettingsModal } from './components/SettingsModal';
import { CreditsModal } from './components/CreditsModal';
import { MobileControls } from './components/MobileControls';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const [screenState, setScreenState] = useState<ScreenState>('MENU');
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    highScore: 0,
    timeSurvived: 0,
    pumpkinsCollected: 0,
    goldenPumpkins: 0,
    magicPumpkins: 0,
    monstersBanished: 0,
    stage: 1,
    newHighScore: false,
  });

  const [playerState, setPlayerState] = useState<Player | null>(null);
  const [timer, setTimer] = useState(0);
  const [isMuted, setIsMuted] = useState(sound.settings.masterMuted);
  const [touchControlsEnabled, setTouchControlsEnabled] = useState(false);

  // Initialize Canvas & Game Engine
  useEffect(() => {
    // Detect mobile touch capability
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setTouchControlsEnabled(isTouchDevice);

    if (canvasRef.current && !engineRef.current) {
      const engine = new GameEngine(canvasRef.current);
      engineRef.current = engine;

      engine.onStateChange = (nextState) => {
        setScreenState(nextState);
      };

      engine.onStatsUpdate = (newStats) => {
        setStats({ ...newStats });
      };

      // Set initial high score in state
      setStats((prev) => ({ ...prev, highScore: engine.stats.highScore }));

      // Start engine loop
      engine.startLoop();
    }

    return () => {
      if (engineRef.current) {
        engineRef.current.stopLoop();
        engineRef.current = null;
      }
    };
  }, []);

  // Sync player & timer state regularly for React HUD
  useEffect(() => {
    const syncInterval = setInterval(() => {
      if (engineRef.current) {
        setPlayerState({ ...engineRef.current.player });
        setTimer(engineRef.current.timer);
      }
    }, 100);

    return () => clearInterval(syncInterval);
  }, []);

  // Handlers
  const handlePlayGame = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.startNewGame();
    }
  }, []);

  const handlePause = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.togglePause();
    }
  }, []);

  const handleResume = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.resumeGame();
    }
  }, []);

  const handleRestart = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.startNewGame();
    }
  }, []);

  const handleMainMenu = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.setScreenState('MENU');
      sound.stopMusic();
    }
  }, []);

  const handleSpecialPower = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.triggerSpecialPower();
    }
  }, []);

  const handleToggleMute = useCallback(() => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  }, []);

  const handleJoystickMove = useCallback((vx: number, vy: number) => {
    if (engineRef.current) {
      engineRef.current.setJoystickVector(vx, vy);
    }
  }, []);

  const handleToggleTouchControls = useCallback(() => {
    setTouchControlsEnabled((prev) => !prev);
  }, []);

  const specialReady = playerState ? playerState.specialCooldown <= 0 : false;
  const specialPercent = playerState
    ? Math.min(
        100,
        ((playerState.specialMaxCooldown - playerState.specialCooldown) / playerState.specialMaxCooldown) * 100
      )
    : 100;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 select-none">
      {/* 2D Canvas Viewport */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full block ${screenState === 'MENU' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      />

      {/* Screen: Main Menu */}
      {screenState === 'MENU' && (
        <MainMenu
          highScore={stats.highScore}
          onPlay={handlePlayGame}
          onHowToPlay={() => setScreenState('HOW_TO_PLAY')}
          onSettings={() => setScreenState('SETTINGS')}
          onCredits={() => setScreenState('CREDITS')}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* Screen: Active Gameplay HUD */}
      {(screenState === 'PLAYING' || screenState === 'PAUSED' || screenState === 'GAME_OVER' || screenState === 'VICTORY') && playerState && (
        <GameHUD
          player={playerState}
          stats={stats}
          timer={timer}
          survivalGoal={180}
          onPause={handlePause}
          onSpecial={handleSpecialPower}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* Mobile Touch Controls */}
      {screenState === 'PLAYING' && touchControlsEnabled && (
        <MobileControls
          onMove={handleJoystickMove}
          onSpecial={handleSpecialPower}
          specialReady={specialReady}
          specialPercent={specialPercent}
        />
      )}

      {/* Modal: Pause */}
      {screenState === 'PAUSED' && (
        <PauseModal
          stats={stats}
          timer={timer}
          onResume={handleResume}
          onRestart={handleRestart}
          onMainMenu={handleMainMenu}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* Modal: Game Over */}
      {screenState === 'GAME_OVER' && (
        <GameOverModal
          stats={stats}
          timer={timer}
          onPlayAgain={handleRestart}
          onMainMenu={handleMainMenu}
        />
      )}

      {/* Modal: Victory */}
      {screenState === 'VICTORY' && (
        <VictoryModal
          stats={stats}
          onPlayAgain={handleRestart}
          onMainMenu={handleMainMenu}
        />
      )}

      {/* Modal: How to Play */}
      {screenState === 'HOW_TO_PLAY' && (
        <HowToPlayModal
          onClose={() => setScreenState('MENU')}
        />
      )}

      {/* Modal: Settings */}
      {screenState === 'SETTINGS' && (
        <SettingsModal
          onClose={() => setScreenState('MENU')}
          touchControlsEnabled={touchControlsEnabled}
          onToggleTouchControls={handleToggleTouchControls}
        />
      )}

      {/* Modal: Credits */}
      {screenState === 'CREDITS' && (
        <CreditsModal
          onClose={() => setScreenState('MENU')}
        />
      )}
    </div>
  );
}
