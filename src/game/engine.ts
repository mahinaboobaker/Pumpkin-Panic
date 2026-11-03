/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { sound } from './sound';
import { SpriteRenderer } from './sprites';
import {
  Collectible,
  CollectibleType,
  Enemy,
  EnemyType,
  FloatingText,
  GameStage,
  GameStats,
  Obstacle,
  Particle,
  Player,
  ScreenState,
} from './types';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  // World dimensions
  public worldWidth = 1600;
  public worldHeight = 1200;

  // Camera
  public cameraX = 0;
  public cameraY = 0;

  // Game state
  public screenState: ScreenState = 'MENU';
  public isPaused = false;
  public survivalGoal = 180; // 3 minutes in seconds
  public timer = 0; // seconds elapsed
  public currentStage: GameStage = 1;

  // Entities
  public player: Player;
  public enemies: Enemy[] = [];
  public collectibles: Collectible[] = [];
  public obstacles: Obstacle[] = [];
  public particles: Particle[] = [];
  public floatingTexts: FloatingText[] = [];

  // Shockwave
  public novaWave: { x: number; y: number; radius: number; maxRadius: number; alpha: number } | null = null;

  // Screen shake
  public shakeDuration = 0;
  public shakeMagnitude = 0;

  // Scoring & Stats
  public stats: GameStats = {
    score: 0,
    highScore: 0,
    timeSurvived: 0,
    pumpkinsCollected: 0,
    goldenPumpkins: 0,
    magicPumpkins: 0,
    monstersBanished: 0,
    stage: 1,
    newHighScore: false,
  };

  // Input states
  private keys: { [key: string]: boolean } = {};
  public joystickVector = { x: 0, y: 0 };
  private touchActive = false;

  // Spawning clocks
  private enemySpawnTimer = 0;
  private collectibleSpawnTimer = 0;
  private ambientParticleTimer = 0;
  private nextId = 1;

  // Animation frame request ID
  private animId: number | null = null;
  private lastTime = 0;

  // Callbacks for React state synchronization
  public onStateChange?: (state: ScreenState) => void;
  public onStatsUpdate?: (stats: GameStats) => void;
  public onStageAdvance?: (stage: GameStage) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not get 2D context');
    this.ctx = context;

    // Load high score
    const savedHighScore = localStorage.getItem('pumpkin_panic_high_score');
    if (savedHighScore) {
      this.stats.highScore = parseInt(savedHighScore, 10) || 0;
    }

    // Default player
    this.player = this.createDefaultPlayer();

    // Generate static world obstacles
    this.initWorldObstacles();

    // Bind event listeners
    this.bindEvents();
  }

  private createDefaultPlayer(): Player {
    return {
      x: this.worldWidth / 2,
      y: this.worldHeight / 2,
      vx: 0,
      vy: 0,
      speed: 220,
      baseSpeed: 220,
      width: 28,
      height: 32,
      radius: 14,
      lives: 3,
      maxLives: 3,
      invincibleTimer: 0,
      shieldActive: false,
      speedBoostTimer: 0,
      specialCooldown: 0,
      specialMaxCooldown: 12, // 12 seconds cooldown
      facing: 'right',
      animTime: 0,
      isMoving: false,
    };
  }

  private initWorldObstacles() {
    this.obstacles = [];

    // Place trees and tombstones randomly across the forest, avoiding the center spawn
    const count = 38;
    for (let i = 0; i < count; i++) {
      let x = 60 + Math.random() * (this.worldWidth - 120);
      let y = 60 + Math.random() * (this.worldHeight - 120);

      // Avoid center player spawn zone
      const distToCenter = Math.hypot(x - this.worldWidth / 2, y - this.worldHeight / 2);
      if (distToCenter < 120) continue;

      const typePick = Math.random();
      const type: Obstacle['type'] =
        typePick < 0.65 ? 'tree' :
        typePick < 0.88 ? 'tombstone' : 'shack';

      const radius = type === 'tree' ? 24 : type === 'tombstone' ? 16 : 36;

      this.obstacles.push({
        x,
        y,
        width: radius * 2,
        height: radius * 2,
        radius,
        type,
      });
    }
  }

  private bindEvents() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
      this.keys[e.code] = true;

      // Space activates special power
      if (e.code === 'Space' && this.screenState === 'PLAYING' && !this.isPaused) {
        e.preventDefault();
        this.triggerSpecialPower();
      }

      // Escape or P pauses
      if ((e.key === 'p' || e.key === 'P' || e.key === 'Escape') && this.screenState === 'PLAYING') {
        e.preventDefault();
        this.togglePause();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
      this.keys[e.code] = false;
    });

    window.addEventListener('resize', () => {
      this.resizeCanvas();
    });

    this.resizeCanvas();
  }

  public resizeCanvas() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  /* ----------------- GAME LIFECYCLE ----------------- */

  public startNewGame() {
    this.player = this.createDefaultPlayer();
    this.enemies = [];
    this.collectibles = [];
    this.particles = [];
    this.floatingTexts = [];
    this.novaWave = null;
    this.shakeDuration = 0;
    this.timer = 0;
    this.currentStage = 1;
    this.isPaused = false;
    this.enemySpawnTimer = 0;
    this.collectibleSpawnTimer = 0;

    this.stats = {
      score: 0,
      highScore: this.stats.highScore,
      timeSurvived: 0,
      pumpkinsCollected: 0,
      goldenPumpkins: 0,
      magicPumpkins: 0,
      monstersBanished: 0,
      stage: 1,
      newHighScore: false,
    };

    // Spawn initial collectibles
    for (let i = 0; i < 9; i++) {
      this.spawnCollectible();
    }

    // Set screen state
    this.setScreenState('PLAYING');
    sound.startMusic(1);

    if (this.onStatsUpdate) this.onStatsUpdate(this.stats);
  }

  public setScreenState(state: ScreenState) {
    this.screenState = state;
    if (this.onStateChange) this.onStateChange(state);
  }

  public togglePause() {
    if (this.screenState !== 'PLAYING') return;
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      sound.stopMusic();
      this.setScreenState('PAUSED');
    } else {
      sound.startMusic(this.currentStage);
      this.setScreenState('PLAYING');
    }
  }

  public resumeGame() {
    if (this.screenState === 'PAUSED') {
      this.isPaused = false;
      sound.startMusic(this.currentStage);
      this.setScreenState('PLAYING');
    }
  }

  public triggerSpecialPower() {
    if (this.player.specialCooldown > 0 || this.player.lives <= 0) return;

    this.player.specialCooldown = this.player.specialMaxCooldown;
    sound.playSpecialNova();

    // Trigger Expanding Jack-o'-Lantern Flame Nova
    this.novaWave = {
      x: this.player.x,
      y: this.player.y,
      radius: 20,
      maxRadius: 280,
      alpha: 1,
    };

    this.shakeScreen(0.35, 12);
    this.addFloatingText('FIRE NOVA!', this.player.x, this.player.y - 25, '#fbbf24', 16);

    // Banish all enemies in radius
    const novaRadius = 260;
    const survivors: Enemy[] = [];

    for (const enemy of this.enemies) {
      const dist = Math.hypot(enemy.x - this.player.x, enemy.y - this.player.y);
      if (dist <= novaRadius) {
        // Obliterate enemy
        this.destroyEnemy(enemy, 25);
      } else {
        survivors.push(enemy);
      }
    }
    this.enemies = survivors;

    // Spawn rich fire particles
    for (let i = 0; i < 40; i++) {
      const a = Math.random() * Math.PI * 2;
      const spd = 60 + Math.random() * 260;
      this.particles.push({
        x: this.player.x,
        y: this.player.y,
        vx: Math.cos(a) * spd,
        vy: Math.sin(a) * spd,
        size: 3 + Math.random() * 5,
        color: Math.random() > 0.4 ? '#f97316' : '#facc15',
        alpha: 1,
        life: 0,
        maxLife: 0.5 + Math.random() * 0.4,
        decay: 1.8,
        type: 'fire',
      });
    }

    if (this.onStatsUpdate) this.onStatsUpdate(this.stats);
  }

  public setJoystickVector(vx: number, vy: number) {
    this.joystickVector = { x: vx, y: vy };
    this.touchActive = Math.hypot(vx, vy) > 0.05;
  }

  /* ----------------- GAME LOOP ----------------- */

  public startLoop() {
    if (this.animId) cancelAnimationFrame(this.animId);
    this.lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min((time - this.lastTime) / 1000, 0.1); // clamp delta-time
      this.lastTime = time;

      if (this.screenState === 'PLAYING' && !this.isPaused) {
        this.update(dt);
      }

      this.render();

      this.animId = requestAnimationFrame(loop);
    };

    this.animId = requestAnimationFrame(loop);
  }

  public stopLoop() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    sound.stopMusic();
  }

  /* ----------------- UPDATES ----------------- */

  private update(dt: number) {
    // 1. Advance Game Clock & Survival Timer
    this.timer += dt;
    this.stats.timeSurvived = Math.floor(this.timer);

    // Passive score tick: +1 point per second survived
    if (Math.floor(this.timer) > Math.floor(this.timer - dt)) {
      this.stats.score += 1;
      this.checkHighScore();
      if (this.onStatsUpdate) this.onStatsUpdate(this.stats);
    }

    // 2. Check Difficulty Stage Progression
    // Stage 1: 0 - 60s (Twilight Dread)
    // Stage 2: 60 - 120s (Midnight Graveyard)
    // Stage 3: 120 - 180s (Blood Moon Nightmare)
    let newStage: GameStage = 1;
    if (this.timer >= 120) {
      newStage = 3;
    } else if (this.timer >= 60) {
      newStage = 2;
    }

    if (newStage !== this.currentStage) {
      this.currentStage = newStage;
      this.stats.stage = newStage;
      sound.setStage(newStage);
      this.shakeScreen(0.4, 8);

      const stageName =
        newStage === 2 ? 'STAGE 2: MIDNIGHT GRAVEYARD' : 'STAGE 3: BLOOD MOON NIGHTMARE';
      this.addFloatingText(stageName, this.player.x, this.player.y - 45, '#ef4444', 20);

      if (this.onStageAdvance) this.onStageAdvance(newStage);
      if (this.onStatsUpdate) this.onStatsUpdate(this.stats);
    }

    // 3. Check 3-Minute Victory Condition (180s)
    if (this.timer >= this.survivalGoal) {
      this.triggerVictory();
      return;
    }

    // 4. Update Player
    this.updatePlayer(dt);

    // 5. Update Enemies & Spawns
    this.updateEnemies(dt);

    // 6. Update Collectibles & Spawns
    this.updateCollectibles(dt);

    // 7. Update Nova Wave
    if (this.novaWave) {
      this.novaWave.radius += 550 * dt;
      this.novaWave.alpha = 1 - this.novaWave.radius / this.novaWave.maxRadius;
      if (this.novaWave.radius >= this.novaWave.maxRadius) {
        this.novaWave = null;
      }
    }

    // 8. Update Particles & Floating Text
    this.updateParticles(dt);

    // 9. Update Screen Shake
    if (this.shakeDuration > 0) {
      this.shakeDuration -= dt;
      if (this.shakeDuration <= 0) {
        this.shakeMagnitude = 0;
      }
    }

    // 10. Update Camera smooth follow
    this.updateCamera();
  }

  private updatePlayer(dt: number) {
    const p = this.player;

    // Movement input vector calculation
    let inputX = 0;
    let inputY = 0;

    if (this.touchActive) {
      inputX = this.joystickVector.x;
      inputY = this.joystickVector.y;
    } else {
      if (this.keys['w'] || this.keys['arrowup']) inputY -= 1;
      if (this.keys['s'] || this.keys['arrowdown']) inputY += 1;
      if (this.keys['a'] || this.keys['arrowleft']) inputX -= 1;
      if (this.keys['d'] || this.keys['arrowright']) inputX += 1;

      // Normalize diagonal keyboard movement
      if (inputX !== 0 && inputY !== 0) {
        const len = Math.SQRT2;
        inputX /= len;
        inputY /= len;
      }
    }

    // Speed boost buff calculation
    if (p.speedBoostTimer > 0) {
      p.speedBoostTimer -= dt;
      p.speed = p.baseSpeed * 1.5;

      // Spawn purple speed trail particles
      if (Math.random() < 0.4) {
        this.particles.push({
          x: p.x + (Math.random() * 12 - 6),
          y: p.y + 10,
          vx: -p.vx * 0.2 + (Math.random() * 20 - 10),
          vy: -p.vy * 0.2 - 20,
          size: 3 + Math.random() * 3,
          color: '#c084fc',
          alpha: 0.8,
          life: 0,
          maxLife: 0.35,
          decay: 2.2,
          type: 'sparkle',
        });
      }
    } else {
      p.speed = p.baseSpeed;
    }

    // Update velocity
    p.vx = inputX * p.speed;
    p.vy = inputY * p.speed;

    p.isMoving = Math.hypot(p.vx, p.vy) > 10;
    if (p.isMoving) {
      p.animTime += dt;
      if (p.vx < -5) p.facing = 'left';
      else if (p.vx > 5) p.facing = 'right';
    } else {
      p.animTime += dt * 0.5;
    }

    // Cooldown timers
    if (p.invincibleTimer > 0) p.invincibleTimer -= dt;
    if (p.specialCooldown > 0) p.specialCooldown = Math.max(0, p.specialCooldown - dt);

    // Apply movement with obstacle collisions
    const nextX = p.x + p.vx * dt;
    const nextY = p.y + p.vy * dt;

    if (!this.checkObstacleCollision(nextX, p.y, p.radius)) {
      p.x = nextX;
    }
    if (!this.checkObstacleCollision(p.x, nextY, p.radius)) {
      p.y = nextY;
    }

    // Clamp player within world bounds
    p.x = Math.max(p.radius + 20, Math.min(this.worldWidth - p.radius - 20, p.x));
    p.y = Math.max(p.radius + 20, Math.min(this.worldHeight - p.radius - 20, p.y));
  }

  private checkObstacleCollision(x: number, y: number, radius: number): boolean {
    for (const obs of this.obstacles) {
      const dist = Math.hypot(x - obs.x, y - obs.y);
      if (dist < radius + obs.radius * 0.75) {
        return true;
      }
    }
    return false;
  }

  private updateEnemies(dt: number) {
    // Spawning interval scales by stage
    // Stage 1: Spawn every 2.4s, max 10 enemies
    // Stage 2: Spawn every 1.4s, max 18 enemies
    // Stage 3: Spawn every 0.75s, max 30 enemies
    const spawnInterval = this.currentStage === 1 ? 2.4 : this.currentStage === 2 ? 1.4 : 0.75;
    const maxEnemies = this.currentStage === 1 ? 12 : this.currentStage === 2 ? 20 : 32;

    this.enemySpawnTimer += dt;
    if (this.enemySpawnTimer >= spawnInterval && this.enemies.length < maxEnemies) {
      this.enemySpawnTimer = 0;
      this.spawnEnemy();
    }

    const p = this.player;

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      enemy.animTime += dt;
      enemy.phaseTime += dt;

      // Enemy AI behaviors based on type
      const dx = p.x - enemy.x;
      const dy = p.y - enemy.y;
      const distToPlayer = Math.hypot(dx, dy);

      switch (enemy.type) {
        case 'ghost': {
          // Ghost: Slow, ethereal, drifts straight through trees, floats bobbing
          const dirX = distToPlayer > 0 ? dx / distToPlayer : 0;
          const dirY = distToPlayer > 0 ? dy / distToPlayer : 0;
          enemy.vx = dirX * enemy.speed;
          enemy.vy = dirY * enemy.speed;
          enemy.x += enemy.vx * dt;
          enemy.y += enemy.vy * dt;
          break;
        }

        case 'skeleton': {
          // Skeleton: Faster, rattles, charges straight when in line of sight
          const dirX = distToPlayer > 0 ? dx / distToPlayer : 0;
          const dirY = distToPlayer > 0 ? dy / distToPlayer : 0;
          const speedMod = distToPlayer < 220 ? 1.4 : 1.0;
          enemy.vx = dirX * enemy.speed * speedMod;
          enemy.vy = dirY * enemy.speed * speedMod;

          const nX = enemy.x + enemy.vx * dt;
          const nY = enemy.y + enemy.vy * dt;
          if (!this.checkObstacleCollision(nX, enemy.y, enemy.radius)) enemy.x = nX;
          if (!this.checkObstacleCollision(enemy.x, nY, enemy.radius)) enemy.y = nY;
          break;
        }

        case 'bat': {
          // Bat: Erratic, sinusoidal swoops, high bursts
          const baseAngle = Math.atan2(dy, dx);
          const swoopAngle = baseAngle + Math.sin(enemy.phaseTime * 5) * 0.75;
          enemy.vx = Math.cos(swoopAngle) * enemy.speed;
          enemy.vy = Math.sin(swoopAngle) * enemy.speed;
          enemy.x += enemy.vx * dt;
          enemy.y += enemy.vy * dt;
          break;
        }

        case 'shadow_monster': {
          // Shadow Monster: Stalks, then lunges aggressively in short sprint bursts
          const lungeCycle = Math.sin(enemy.phaseTime * 3);
          const lungeSpeed = lungeCycle > 0.4 ? enemy.speed * 1.8 : enemy.speed * 0.6;
          const dirX = distToPlayer > 0 ? dx / distToPlayer : 0;
          const dirY = distToPlayer > 0 ? dy / distToPlayer : 0;
          enemy.vx = dirX * lungeSpeed;
          enemy.vy = dirY * lungeSpeed;
          enemy.x += enemy.vx * dt;
          enemy.y += enemy.vy * dt;
          break;
        }
      }

      // Track facing
      if (enemy.vx < -2) enemy.facing = 'left';
      else if (enemy.vx > 2) enemy.facing = 'right';

      // Soft enemy-enemy separation
      for (let j = i - 1; j >= 0; j--) {
        const other = this.enemies[j];
        const sepDist = Math.hypot(enemy.x - other.x, enemy.y - other.y);
        const minDist = enemy.radius + other.radius;
        if (sepDist < minDist && sepDist > 0) {
          const push = (minDist - sepDist) * 0.5;
          const pushX = ((enemy.x - other.x) / sepDist) * push;
          const pushY = ((enemy.y - other.y) / sepDist) * push;
          enemy.x += pushX;
          enemy.y += pushY;
          other.x -= pushX;
          other.y -= pushY;
        }
      }

      // Check collision with Player
      if (distToPlayer < p.radius + enemy.radius && p.invincibleTimer <= 0) {
        this.handlePlayerHit(enemy);
      }
    }
  }

  private handlePlayerHit(enemy: Enemy) {
    const p = this.player;

    if (p.shieldActive) {
      // Shield absorbs hit!
      p.shieldActive = false;
      p.invincibleTimer = 1.2;
      sound.playShieldBreak();
      this.shakeScreen(0.25, 8);
      this.addFloatingText('SHIELD BROKEN!', p.x, p.y - 30, '#38bdf8', 14);

      // Knock enemy back
      const dx = enemy.x - p.x;
      const dy = enemy.y - p.y;
      const dist = Math.hypot(dx, dy) || 1;
      enemy.x += (dx / dist) * 70;
      enemy.y += (dy / dist) * 70;
    } else {
      // Lose life
      p.lives -= 1;
      p.invincibleTimer = 1.6;
      sound.playPlayerHurt();
      this.shakeScreen(0.4, 14);
      this.addFloatingText('-1 LIFE', p.x, p.y - 30, '#ef4444', 16);

      // Damage particles
      for (let k = 0; k < 15; k++) {
        this.particles.push({
          x: p.x,
          y: p.y,
          vx: (Math.random() - 0.5) * 160,
          vy: (Math.random() - 0.5) * 160,
          size: 3 + Math.random() * 4,
          color: '#f97316',
          alpha: 1,
          life: 0,
          maxLife: 0.4,
          decay: 2.5,
          type: 'ember',
        });
      }

      if (this.onStatsUpdate) this.onStatsUpdate(this.stats);

      if (p.lives <= 0) {
        this.triggerGameOver();
      }
    }
  }

  private spawnEnemy() {
    // Choose spawn edge just outside camera viewport or world edge
    const angle = Math.random() * Math.PI * 2;
    const spawnDist = 450 + Math.random() * 150;
    let spawnX = this.player.x + Math.cos(angle) * spawnDist;
    let spawnY = this.player.y + Math.sin(angle) * spawnDist;

    // Clamp within world
    spawnX = Math.max(30, Math.min(this.worldWidth - 30, spawnX));
    spawnY = Math.max(30, Math.min(this.worldHeight - 30, spawnY));

    // Choose type according to current stage
    let type: EnemyType = 'ghost';
    const roll = Math.random();

    if (this.currentStage === 1) {
      type = roll < 0.75 ? 'ghost' : 'bat';
    } else if (this.currentStage === 2) {
      type = roll < 0.45 ? 'ghost' : roll < 0.75 ? 'skeleton' : 'bat';
    } else {
      // Stage 3 Nightmare
      type = roll < 0.3 ? 'ghost' : roll < 0.55 ? 'skeleton' : roll < 0.75 ? 'bat' : 'shadow_monster';
    }

    const speed =
      type === 'ghost' ? 95 + Math.random() * 25 :
      type === 'skeleton' ? 140 + Math.random() * 30 :
      type === 'bat' ? 180 + Math.random() * 40 :
      155 + Math.random() * 35; // shadow monster

    const radius =
      type === 'ghost' ? 14 :
      type === 'skeleton' ? 13 :
      type === 'bat' ? 10 :
      16;

    this.enemies.push({
      id: this.nextId++,
      type,
      x: spawnX,
      y: spawnY,
      vx: 0,
      vy: 0,
      speed: speed * (1 + (this.currentStage - 1) * 0.15),
      radius,
      width: radius * 2,
      height: radius * 2,
      hp: 1,
      facing: 'right',
      animTime: Math.random() * 10,
      phaseTime: Math.random() * 10,
      aggroTargetX: this.player.x,
      aggroTargetY: this.player.y,
    });
  }

  private destroyEnemy(enemy: Enemy, bonusPoints = 15) {
    sound.playEnemyDeath();
    this.stats.monstersBanished += 1;
    this.stats.score += bonusPoints;
    this.checkHighScore();

    this.addFloatingText(`+${bonusPoints}`, enemy.x, enemy.y - 12, '#fef08a', 13);

    // Death poof particles
    for (let i = 0; i < 14; i++) {
      const a = Math.random() * Math.PI * 2;
      const spd = 30 + Math.random() * 110;
      this.particles.push({
        x: enemy.x,
        y: enemy.y,
        vx: Math.cos(a) * spd,
        vy: Math.sin(a) * spd,
        size: 2 + Math.random() * 4,
        color: enemy.type === 'shadow_monster' ? '#581c87' : enemy.type === 'ghost' ? '#bae6fd' : '#cbd5e1',
        alpha: 1,
        life: 0,
        maxLife: 0.45,
        decay: 2.2,
        type: 'smoke',
      });
    }
  }

  private updateCollectibles(dt: number) {
    this.collectibleSpawnTimer += dt;
    const maxItems = 12;

    if (this.collectibleSpawnTimer >= 3.0 && this.collectibles.length < maxItems) {
      this.collectibleSpawnTimer = 0;
      this.spawnCollectible();
    }

    const p = this.player;

    for (let i = this.collectibles.length - 1; i >= 0; i--) {
      const item = this.collectibles[i];
      item.pulseTime += dt;
      item.bobOffset = Math.sin(item.pulseTime * 4) * 3;

      // Check pickup collision
      const dist = Math.hypot(p.x - item.x, p.y - (item.y + item.bobOffset));
      if (dist < p.radius + item.radius) {
        this.collectItem(item);
        this.collectibles.splice(i, 1);
      }
    }
  }

  private spawnCollectible() {
    // Random position in world, avoid obstacles
    let x = 80 + Math.random() * (this.worldWidth - 160);
    let y = 80 + Math.random() * (this.worldHeight - 160);

    // Roll collectible type
    const roll = Math.random();
    let type: CollectibleType = 'normal_pumpkin';
    let points = 10;

    if (roll < 0.55) {
      type = 'normal_pumpkin';
      points = 10;
    } else if (roll < 0.72) {
      type = 'golden_pumpkin';
      points = 50;
    } else if (roll < 0.82) {
      type = 'speed_potion';
      points = 20;
    } else if (roll < 0.90) {
      type = 'shield';
      points = 25;
    } else if (roll < 0.96) {
      type = 'magic_pumpkin';
      points = 30;
    } else {
      type = 'fire_pumpkin';
      points = 35;
    }

    this.collectibles.push({
      id: this.nextId++,
      type,
      x,
      y,
      radius: 14,
      bobOffset: 0,
      pulseTime: Math.random() * 5,
      points,
    });
  }

  private collectItem(item: Collectible) {
    const p = this.player;
    this.stats.score += item.points;

    switch (item.type) {
      case 'normal_pumpkin': {
        sound.playPickupNormal();
        this.stats.pumpkinsCollected += 1;
        this.addFloatingText('+10', item.x, item.y - 15, '#fb923c', 14);
        break;
      }

      case 'golden_pumpkin': {
        sound.playPickupGolden();
        this.stats.goldenPumpkins += 1;
        this.addFloatingText('+50 GOLDEN!', item.x, item.y - 18, '#facc15', 16);
        // Golden sparkles
        for (let i = 0; i < 20; i++) {
          this.particles.push({
            x: item.x,
            y: item.y,
            vx: (Math.random() - 0.5) * 140,
            vy: (Math.random() - 0.5) * 140,
            size: 2 + Math.random() * 3,
            color: '#fef08a',
            alpha: 1,
            life: 0,
            maxLife: 0.5,
            decay: 2.0,
            type: 'sparkle',
          });
        }
        break;
      }

      case 'magic_pumpkin': {
        sound.playPickupMagic();
        this.stats.magicPumpkins += 1;
        if (p.lives < p.maxLives) {
          p.lives += 1;
          this.addFloatingText('+1 LIFE RESTORED!', item.x, item.y - 18, '#ec4899', 15);
        } else {
          this.addFloatingText('+30 BONUS PTS!', item.x, item.y - 18, '#ec4899', 14);
        }
        break;
      }

      case 'speed_potion': {
        sound.playPickupSpeed();
        p.speedBoostTimer = 8.0; // 8 seconds
        this.addFloatingText('SPEED BOOST (8s)!', item.x, item.y - 18, '#c084fc', 15);
        break;
      }

      case 'shield': {
        sound.playPickupShield();
        p.shieldActive = true;
        this.addFloatingText('SHIELD ACTIVE!', item.x, item.y - 18, '#38bdf8', 15);
        break;
      }

      case 'fire_pumpkin': {
        sound.playFireExplosion();
        this.shakeScreen(0.45, 15);
        this.addFloatingText('FIREBLAST PURGE!', item.x, item.y - 25, '#ef4444', 18);

        // Obliterate all current enemies on screen
        const banishedCount = this.enemies.length;
        for (const enemy of this.enemies) {
          this.destroyEnemy(enemy, 15);
        }
        this.enemies = [];

        // Huge fire wave
        for (let i = 0; i < 50; i++) {
          const a = Math.random() * Math.PI * 2;
          const spd = 80 + Math.random() * 280;
          this.particles.push({
            x: item.x,
            y: item.y,
            vx: Math.cos(a) * spd,
            vy: Math.sin(a) * spd,
            size: 4 + Math.random() * 5,
            color: Math.random() > 0.5 ? '#ef4444' : '#f97316',
            alpha: 1,
            life: 0,
            maxLife: 0.6,
            decay: 1.6,
            type: 'fire',
          });
        }

        if (banishedCount > 0) {
          this.addFloatingText(`PURGED ${banishedCount} MONSTERS!`, p.x, p.y + 25, '#facc15', 15);
        }
        break;
      }
    }

    this.checkHighScore();
    if (this.onStatsUpdate) this.onStatsUpdate(this.stats);
  }

  private checkHighScore() {
    if (this.stats.score > this.stats.highScore) {
      this.stats.highScore = this.stats.score;
      this.stats.newHighScore = true;
      try {
        localStorage.setItem('pumpkin_panic_high_score', this.stats.highScore.toString());
      } catch {
        // ignore
      }
    }
  }

  private triggerGameOver() {
    sound.stopMusic();
    sound.playGameOver();
    this.setScreenState('GAME_OVER');
    if (this.onStatsUpdate) this.onStatsUpdate(this.stats);
  }

  private triggerVictory() {
    sound.stopMusic();
    sound.playVictory();
    // Survived full 3 minutes bonus!
    this.stats.score += 500;
    this.checkHighScore();
    this.setScreenState('VICTORY');
    if (this.onStatsUpdate) this.onStatsUpdate(this.stats);
  }

  public shakeScreen(duration: number, magnitude: number) {
    this.shakeDuration = duration;
    this.shakeMagnitude = magnitude;
  }

  private addFloatingText(text: string, x: number, y: number, color: string, size = 14) {
    this.floatingTexts.push({
      id: this.nextId++,
      text,
      x,
      y,
      color,
      size,
      life: 0,
      maxLife: 1.1,
      vy: -35,
    });
  }

  private updateParticles(dt: number) {
    // Ambient floating mist / fireflies
    this.ambientParticleTimer += dt;
    if (this.ambientParticleTimer > 0.08) {
      this.ambientParticleTimer = 0;
      // Spawn near camera
      const px = this.cameraX + Math.random() * this.canvas.width;
      const py = this.cameraY + Math.random() * this.canvas.height;
      this.particles.push({
        x: px,
        y: py,
        vx: (Math.random() - 0.5) * 12,
        vy: -10 - Math.random() * 15,
        size: 1.5 + Math.random() * 2.5,
        color: this.currentStage === 3 ? 'rgba(239, 68, 68, 0.4)' : 'rgba(168, 85, 247, 0.35)',
        alpha: 0.6,
        life: 0,
        maxLife: 2.5 + Math.random() * 2,
        decay: 0.4,
        type: 'smoke',
      });
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.life += dt;
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      pt.alpha = Math.max(0, 1 - pt.life / pt.maxLife);

      if (pt.life >= pt.maxLife) {
        this.particles.splice(i, 1);
      }
    }

    // Update floating texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.life += dt;
      ft.y += ft.vy * dt;

      if (ft.life >= ft.maxLife) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  private updateCamera() {
    const targetX = this.player.x - this.canvas.width / 2;
    const targetY = this.player.y - this.canvas.height / 2;

    // Smooth lerp camera
    this.cameraX += (targetX - this.cameraX) * 0.12;
    this.cameraY += (targetY - this.cameraY) * 0.12;

    // Clamp camera within world bounds
    this.cameraX = Math.max(0, Math.min(this.worldWidth - this.canvas.width, this.cameraX));
    this.cameraY = Math.max(0, Math.min(this.worldHeight - this.canvas.height, this.cameraY));
  }

  /* ----------------- RENDERING ----------------- */

  public render() {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    ctx.save();
    ctx.clearRect(0, 0, width, height);

    // Apply Screen Shake
    if (this.shakeDuration > 0) {
      const shakeX = (Math.random() * 2 - 1) * this.shakeMagnitude;
      const shakeY = (Math.random() * 2 - 1) * this.shakeMagnitude;
      ctx.translate(shakeX, shakeY);
    }

    // World transform
    ctx.save();
    ctx.translate(-this.cameraX, -this.cameraY);

    // 1. Draw Haunted Forest Ground
    this.drawForestGround(ctx);

    // 2. Draw World Boundaries / Haunted Fence
    this.drawWorldBoundaries(ctx);

    // 3. Draw Collectibles
    for (const item of this.collectibles) {
      SpriteRenderer.drawCollectible(ctx, item);
    }

    // 4. Sort and Draw Obstacles, Enemies, Player by Y coordinate for depth
    const yEntities: Array<{ y: number; draw: () => void }> = [];

    // Obstacles
    for (const obs of this.obstacles) {
      yEntities.push({
        y: obs.y,
        draw: () => SpriteRenderer.drawObstacle(ctx, obs),
      });
    }

    // Enemies
    for (const enemy of this.enemies) {
      yEntities.push({
        y: enemy.y,
        draw: () => {
          if (enemy.type === 'ghost') SpriteRenderer.drawGhost(ctx, enemy);
          else if (enemy.type === 'skeleton') SpriteRenderer.drawSkeleton(ctx, enemy);
          else if (enemy.type === 'bat') SpriteRenderer.drawBat(ctx, enemy);
          else SpriteRenderer.drawShadowMonster(ctx, enemy);
        },
      });
    }

    // Player
    yEntities.push({
      y: this.player.y,
      draw: () => SpriteRenderer.drawPlayer(ctx, this.player),
    });

    // Sort by Y for 2.5D isometric depth
    yEntities.sort((a, b) => a.y - b.y);
    for (const ent of yEntities) {
      ent.draw();
    }

    // 5. Draw Nova Wave
    if (this.novaWave) {
      SpriteRenderer.drawNovaWave(ctx, this.novaWave.x, this.novaWave.y, this.novaWave.radius, this.novaWave.alpha);
    }

    // 6. Draw Particles
    for (const pt of this.particles) {
      ctx.save();
      ctx.globalAlpha = pt.alpha;
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 7. Draw Floating Texts
    for (const ft of this.floatingTexts) {
      ctx.save();
      const alpha = 1 - ft.life / ft.maxLife;
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.fillStyle = ft.color;
      ctx.font = `bold ${ft.size}px 'Press Start 2P', monospace`;
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 6;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }

    ctx.restore(); // Restore world transform

    // 8. Screen space Vignette & Stage Color Atmosphere
    this.drawScreenAtmosphere(ctx, width, height);

    ctx.restore(); // Restore shake
  }

  private drawForestGround(ctx: CanvasRenderingContext2D) {
    // Base forest dirt / grass color
    ctx.fillStyle = '#0a0614'; // deep purple-black
    ctx.fillRect(0, 0, this.worldWidth, this.worldHeight);

    // Subtle patch details
    ctx.fillStyle = '#130d24';
    for (let x = 0; x < this.worldWidth; x += 90) {
      for (let y = 0; y < this.worldHeight; y += 90) {
        if ((x + y) % 180 === 0) {
          ctx.beginPath();
          ctx.arc(x + 40, y + 40, 32, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Autumn forest leaf patches
    ctx.fillStyle = '#451a03';
    for (let i = 0; i < 60; i++) {
      const lx = ((i * 137) % (this.worldWidth - 100)) + 50;
      const ly = ((i * 229) % (this.worldHeight - 100)) + 50;
      ctx.fillRect(lx, ly, 4, 3);
      ctx.fillRect(lx + 5, ly + 2, 3, 2);
    }
  }

  private drawWorldBoundaries(ctx: CanvasRenderingContext2D) {
    // Spooky crooked fence posts along the boundary
    ctx.strokeStyle = '#292524';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, this.worldWidth - 40, this.worldHeight - 40);

    ctx.fillStyle = '#1c1917';
    // Fence posts along horizontal borders
    for (let x = 20; x < this.worldWidth - 20; x += 40) {
      ctx.fillRect(x - 2, 10, 4, 18);
      ctx.fillRect(x - 2, this.worldHeight - 28, 4, 18);
    }
    // Fence posts along vertical borders
    for (let y = 20; y < this.worldHeight - 20; y += 40) {
      ctx.fillRect(10, y - 2, 18, 4);
      ctx.fillRect(this.worldWidth - 28, y - 2, 18, 4);
    }
  }

  private drawScreenAtmosphere(ctx: CanvasRenderingContext2D, width: number, height: number) {
    // Stage lighting tint
    if (this.currentStage === 3) {
      // Blood Moon Nightmare red-tinted vignette
      const bloodGrad = ctx.createRadialGradient(
        width / 2, height / 2, width * 0.3,
        width / 2, height / 2, width * 0.75
      );
      bloodGrad.addColorStop(0, 'rgba(127, 29, 29, 0)');
      bloodGrad.addColorStop(0.7, 'rgba(153, 27, 27, 0.25)');
      bloodGrad.addColorStop(1, 'rgba(69, 10, 10, 0.6)');
      ctx.fillStyle = bloodGrad;
      ctx.fillRect(0, 0, width, height);
    } else {
      // Deep purple spooky vignette
      const vign = ctx.createRadialGradient(
        width / 2, height / 2, width * 0.35,
        width / 2, height / 2, width * 0.8
      );
      vign.addColorStop(0, 'rgba(10, 6, 20, 0)');
      vign.addColorStop(0.75, 'rgba(15, 7, 34, 0.4)');
      vign.addColorStop(1, 'rgba(6, 2, 15, 0.8)');
      ctx.fillStyle = vign;
      ctx.fillRect(0, 0, width, height);
    }

    // Red damage flash when player took damage
    if (this.player.invincibleTimer > 1.2) {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
      ctx.fillRect(0, 0, width, height);
    }
  }
}
