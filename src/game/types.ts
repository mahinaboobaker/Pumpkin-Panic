/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ScreenState = 
  | 'MENU' 
  | 'PLAYING' 
  | 'PAUSED' 
  | 'GAME_OVER' 
  | 'VICTORY' 
  | 'HOW_TO_PLAY' 
  | 'SETTINGS' 
  | 'CREDITS';

export type GameStage = 1 | 2 | 3;

export interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
  baseSpeed: number;
  width: number;
  height: number;
  radius: number;
  lives: number;
  maxLives: number;
  invincibleTimer: number; // seconds
  shieldActive: boolean;
  speedBoostTimer: number; // seconds remaining
  specialCooldown: number; // seconds remaining
  specialMaxCooldown: number;
  facing: 'left' | 'right';
  animTime: number;
  isMoving: boolean;
}

export type EnemyType = 'ghost' | 'skeleton' | 'bat' | 'shadow_monster';

export interface Enemy {
  id: number;
  type: EnemyType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
  radius: number;
  width: number;
  height: number;
  hp: number;
  facing: 'left' | 'right';
  animTime: number;
  phaseTime: number; // for sinusoidal/erratic motion
  aggroTargetX: number;
  aggroTargetY: number;
}

export type CollectibleType = 
  | 'normal_pumpkin' 
  | 'golden_pumpkin' 
  | 'magic_pumpkin' 
  | 'speed_potion' 
  | 'shield' 
  | 'fire_pumpkin';

export interface Collectible {
  id: number;
  type: CollectibleType;
  x: number;
  y: number;
  radius: number;
  bobOffset: number;
  pulseTime: number;
  points: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  decay: number;
  type?: 'ember' | 'sparkle' | 'smoke' | 'bone' | 'fire' | 'nova';
}

export interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
  vy: number;
}

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
  type: 'tree' | 'tombstone' | 'ruin' | 'shack';
}

export interface GameStats {
  score: number;
  highScore: number;
  timeSurvived: number; // in seconds
  pumpkinsCollected: number;
  goldenPumpkins: number;
  magicPumpkins: number;
  monstersBanished: number;
  stage: GameStage;
  newHighScore: boolean;
}

export interface AudioSettings {
  masterMuted: boolean;
  musicMuted: boolean;
  sfxMuted: boolean;
  volume: number; // 0 to 1
}
