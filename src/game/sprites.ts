/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Player, Enemy, Collectible, Obstacle } from './types';

export class SpriteRenderer {
  // Draw the Player (Little Jack-o'-Lantern Hero)
  public static drawPlayer(ctx: CanvasRenderingContext2D, player: Player) {
    ctx.save();
    ctx.translate(player.x, player.y);

    // Directional facing
    if (player.facing === 'left') {
      ctx.scale(-1, 1);
    }

    // Invincibility flashing
    if (player.invincibleTimer > 0) {
      const flash = Math.floor(player.invincibleTimer * 16) % 2 === 0;
      if (flash) {
        ctx.globalAlpha = 0.4;
      }
    }

    // Speed boost flame trail / aura
    if (player.speedBoostTimer > 0) {
      ctx.save();
      const auraPulse = 1 + Math.sin(player.animTime * 12) * 0.15;
      const auraGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 36 * auraPulse);
      auraGrad.addColorStop(0, 'rgba(168, 85, 247, 0.4)');
      auraGrad.addColorStop(0.7, 'rgba(217, 70, 239, 0.2)');
      auraGrad.addColorStop(1, 'rgba(168, 85, 247, 0)');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 36 * auraPulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Shield protective bubble
    if (player.shieldActive) {
      ctx.save();
      const shieldPulse = 1 + Math.sin(player.animTime * 6) * 0.08;
      const shieldGrad = ctx.createRadialGradient(0, 0, 16, 0, 0, 32 * shieldPulse);
      shieldGrad.addColorStop(0, 'rgba(56, 189, 248, 0.15)');
      shieldGrad.addColorStop(0.8, 'rgba(56, 189, 248, 0.5)');
      shieldGrad.addColorStop(1, 'rgba(125, 211, 252, 0.9)');
      ctx.fillStyle = shieldGrad;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, 30 * shieldPulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Rotating protective runes
      const rot = player.animTime * 2;
      for (let i = 0; i < 3; i++) {
        const a = rot + (i * Math.PI * 2) / 3;
        const rx = Math.cos(a) * (30 * shieldPulse);
        const ry = Math.sin(a) * (30 * shieldPulse);
        ctx.fillStyle = '#bae6fd';
        ctx.beginPath();
        ctx.arc(rx, ry, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Walking animation bob and feet
    const walkBob = player.isMoving ? Math.sin(player.animTime * 14) * 3 : Math.sin(player.animTime * 3) * 1.5;
    const footSwing = player.isMoving ? Math.sin(player.animTime * 14) * 6 : 0;

    // Feet (little wooden roots / boots)
    ctx.fillStyle = '#451a03';
    // Left foot
    ctx.beginPath();
    ctx.roundRect(-10 + footSwing, 12, 7, 6, 2);
    ctx.fill();
    // Right foot
    ctx.beginPath();
    ctx.roundRect(3 - footSwing, 12, 7, 6, 2);
    ctx.fill();

    // Pumpkin body offset by bob
    ctx.save();
    ctx.translate(0, walkBob);

    // Pumpkin base shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(0, 16 - walkBob, 18, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pumpkin lobes (outer segments)
    // Left lobe
    ctx.fillStyle = '#c2410c';
    ctx.beginPath();
    ctx.ellipse(-11, -1, 10, 17, -0.15, 0, Math.PI * 2);
    ctx.fill();

    // Right lobe
    ctx.beginPath();
    ctx.ellipse(11, -1, 10, 17, 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Mid lobes
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.ellipse(-6, 0, 10, 18, -0.08, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(6, 0, 10, 18, 0.08, 0, Math.PI * 2);
    ctx.fill();

    // Center lobe (brightest)
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.ellipse(0, 1, 11, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pumpkin Stem (green top stalk)
    ctx.fillStyle = '#166534';
    ctx.beginPath();
    ctx.moveTo(-3, -16);
    ctx.quadraticCurveTo(-1, -25, 4, -26);
    ctx.quadraticCurveTo(5, -23, 2, -16);
    ctx.closePath();
    ctx.fill();

    // Cute green leaf
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.ellipse(5, -21, 5, 2.5, 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Carved Face: Eyes
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 10;

    // Left eye (triangle)
    ctx.beginPath();
    ctx.moveTo(-10, -5);
    ctx.lineTo(-4, -5);
    ctx.lineTo(-7, -10);
    ctx.closePath();
    ctx.fill();

    // Right eye (triangle)
    ctx.beginPath();
    ctx.moveTo(4, -5);
    ctx.lineTo(10, -5);
    ctx.lineTo(7, -10);
    ctx.closePath();
    ctx.fill();

    // Nose (tiny triangle)
    ctx.beginPath();
    ctx.moveTo(-2, -3);
    ctx.lineTo(2, -3);
    ctx.lineTo(0, -6);
    ctx.closePath();
    ctx.fill();

    // Jagged smiling mouth
    ctx.beginPath();
    ctx.moveTo(-12, 3);
    ctx.lineTo(-8, 8);
    ctx.lineTo(-5, 5);
    ctx.lineTo(-2, 9);
    ctx.lineTo(2, 9);
    ctx.lineTo(5, 5);
    ctx.lineTo(8, 8);
    ctx.lineTo(12, 3);
    ctx.lineTo(9, 3);
    ctx.lineTo(6, 5);
    ctx.lineTo(2, 4);
    ctx.lineTo(-2, 4);
    ctx.lineTo(-6, 5);
    ctx.lineTo(-9, 3);
    ctx.closePath();
    ctx.fill();

    // Inner bright hot-yellow glow inside cuts
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 4;
    ctx.fillRect(-7, -7, 1.5, 1.5);
    ctx.fillRect(7, -7, 1.5, 1.5);

    ctx.restore();
    ctx.restore();
  }

  // Draw Ghost Enemy
  public static drawGhost(ctx: CanvasRenderingContext2D, enemy: Enemy) {
    ctx.save();
    ctx.translate(enemy.x, enemy.y);

    if (enemy.facing === 'left') {
      ctx.scale(-1, 1);
    }

    const floatY = Math.sin(enemy.animTime * 6) * 4;
    ctx.translate(0, floatY);

    // Ethereal shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.beginPath();
    ctx.ellipse(0, 18 - floatY, 14, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Spectral aura glow
    const glowGrad = ctx.createRadialGradient(0, 0, 6, 0, 0, 24);
    glowGrad.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
    glowGrad.addColorStop(0.7, 'rgba(147, 197, 253, 0.15)');
    glowGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI * 2);
    ctx.fill();

    // Ghost body (flowing white/cyan sheet)
    ctx.fillStyle = 'rgba(240, 249, 255, 0.92)';
    ctx.beginPath();
    // Rounded head
    ctx.arc(0, -6, 14, Math.PI, 0, false);
    // Right side
    ctx.lineTo(14, 8);
    // Wavy bottom hem
    const wave = Math.sin(enemy.animTime * 10);
    ctx.quadraticCurveTo(9, 14 + wave * 3, 4, 8);
    ctx.quadraticCurveTo(0, 15 - wave * 3, -4, 8);
    ctx.quadraticCurveTo(-9, 14 + wave * 3, -14, 8);
    // Left side back to head
    ctx.lineTo(-14, -6);
    ctx.closePath();
    ctx.fill();

    // Dark ghostly eyes
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(-5, -6, 2.5, 4, 0, 0, Math.PI * 2);
    ctx.ellipse(5, -6, 2.5, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Spectral cyan glint inside eyes
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(-5, -7, 1, 0, Math.PI * 2);
    ctx.arc(5, -7, 1, 0, Math.PI * 2);
    ctx.fill();

    // Spooky open mouth
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(0, 0, 3, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Draw Skeleton Enemy
  public static drawSkeleton(ctx: CanvasRenderingContext2D, enemy: Enemy) {
    ctx.save();
    ctx.translate(enemy.x, enemy.y);

    if (enemy.facing === 'left') {
      ctx.scale(-1, 1);
    }

    const walkTime = enemy.animTime * 12;
    const legLeft = Math.sin(walkTime) * 6;
    const legRight = Math.cos(walkTime) * 6;
    const armSwing = Math.sin(walkTime) * 5;

    // Ground shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(0, 18, 12, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bones color
    ctx.fillStyle = '#e2e8f0';
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;

    // Legs
    // Left leg
    ctx.beginPath();
    ctx.moveTo(-4, 5);
    ctx.lineTo(-5 + legLeft, 12);
    ctx.lineTo(-5 + legLeft * 1.3, 18);
    ctx.stroke();
    // Right leg
    ctx.beginPath();
    ctx.moveTo(4, 5);
    ctx.lineTo(5 + legRight, 12);
    ctx.lineTo(5 + legRight * 1.3, 18);
    ctx.stroke();

    // Pelvis
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(-6, 3, 12, 3);

    // Spine & Ribcage
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.lineTo(0, 4);
    ctx.stroke();

    // Ribs
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-7, -4);
    ctx.lineTo(7, -4);
    ctx.moveTo(-6, -1);
    ctx.lineTo(6, -1);
    ctx.moveTo(-5, 2);
    ctx.lineTo(5, 2);
    ctx.stroke();

    // Arms
    ctx.beginPath();
    ctx.moveTo(-7, -4);
    ctx.lineTo(-10 + armSwing, 2);
    ctx.lineTo(-9 + armSwing, 8);
    ctx.moveTo(7, -4);
    ctx.lineTo(10 - armSwing, 2);
    ctx.lineTo(9 - armSwing, 8);
    ctx.stroke();

    // Skull
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(0, -11, 8, 0, Math.PI * 2);
    ctx.fill();
    // Jaw
    ctx.fillRect(-4, -6, 8, 4);

    // Dark eye sockets with glowing red pupils
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(-3, -11, 2, 2.5, 0, 0, Math.PI * 2);
    ctx.ellipse(3, -11, 2, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Red menace dots
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#dc2626';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(-3, -11, 1, 0, Math.PI * 2);
    ctx.arc(3, -11, 1, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Draw Bat Enemy
  public static drawBat(ctx: CanvasRenderingContext2D, enemy: Enemy) {
    ctx.save();
    ctx.translate(enemy.x, enemy.y);

    if (enemy.facing === 'left') {
      ctx.scale(-1, 1);
    }

    const flap = Math.sin(enemy.animTime * 18);
    const wingY = flap * 8;

    // Bat shadow on ground
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(0, 16, 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bat wings
    ctx.fillStyle = '#312e81'; // dark indigo
    ctx.strokeStyle = '#4338ca';
    ctx.lineWidth = 1;

    // Left Wing
    ctx.beginPath();
    ctx.moveTo(-3, 0);
    ctx.lineTo(-18, -6 + wingY);
    ctx.quadraticCurveTo(-14, 4 + wingY, -9, 2 + wingY);
    ctx.quadraticCurveTo(-6, 5 + wingY, -3, 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right Wing
    ctx.beginPath();
    ctx.moveTo(3, 0);
    ctx.lineTo(18, -6 + wingY);
    ctx.quadraticCurveTo(14, 4 + wingY, 9, 2 + wingY);
    ctx.quadraticCurveTo(6, 5 + wingY, 3, 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Body
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.ellipse(0, 1, 5, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pointed ears
    ctx.beginPath();
    ctx.moveTo(-4, -4);
    ctx.lineTo(-6, -10);
    ctx.lineTo(-2, -5);
    ctx.moveTo(4, -4);
    ctx.lineTo(6, -10);
    ctx.lineTo(2, -5);
    ctx.closePath();
    ctx.fill();

    // Glowing yellow eyes
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(-2, -1, 1.2, 0, Math.PI * 2);
    ctx.arc(2, -1, 1.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Draw Shadow Monster (Stage 2/3 Nightmare Stalker)
  public static drawShadowMonster(ctx: CanvasRenderingContext2D, enemy: Enemy) {
    ctx.save();
    ctx.translate(enemy.x, enemy.y);

    if (enemy.facing === 'left') {
      ctx.scale(-1, 1);
    }

    // Shadow tendril distortion
    const pulse = 1 + Math.sin(enemy.animTime * 8) * 0.1;

    // Dark smoke halo
    const halo = ctx.createRadialGradient(0, 0, 8, 0, 0, 32 * pulse);
    halo.addColorStop(0, 'rgba(88, 28, 135, 0.6)');
    halo.addColorStop(0.6, 'rgba(15, 5, 29, 0.4)');
    halo.addColorStop(1, 'rgba(88, 28, 135, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(0, 0, 32 * pulse, 0, Math.PI * 2);
    ctx.fill();

    // Shadow blob body
    ctx.fillStyle = '#090514';
    ctx.beginPath();
    ctx.arc(0, 0, 18 * pulse, 0, Math.PI * 2);
    ctx.fill();

    // Wispy dark tendrils
    ctx.strokeStyle = '#2e1065';
    ctx.lineWidth = 3;
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3 + enemy.animTime * 2;
      const tx = Math.cos(angle) * (18 * pulse);
      const ty = Math.sin(angle) * (18 * pulse);
      const tipX = Math.cos(angle + 0.3) * (26 * pulse);
      const tipY = Math.sin(angle + 0.3) * (26 * pulse);
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.quadraticCurveTo(tx * 1.2, ty * 1.2, tipX, tipY);
      ctx.stroke();
    }

    // Blazing crimson slit eyes
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#dc2626';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.ellipse(-6, -3, 4, 1.8, -0.2, 0, Math.PI * 2);
    ctx.ellipse(6, -3, 4, 1.8, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // White core slit
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(-6, -3, 1.5, 0.8, -0.2, 0, Math.PI * 2);
    ctx.ellipse(6, -3, 1.5, 0.8, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Razor teeth
    ctx.fillStyle = '#e2e8f0';
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.moveTo(-8, 5);
    ctx.lineTo(-5, 9);
    ctx.lineTo(-2, 5);
    ctx.lineTo(1, 9);
    ctx.lineTo(4, 5);
    ctx.lineTo(7, 9);
    ctx.lineTo(8, 5);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // Draw Collectibles & Power-ups
  public static drawCollectible(ctx: CanvasRenderingContext2D, item: Collectible) {
    ctx.save();
    ctx.translate(item.x, item.y + item.bobOffset);

    // Ground glow
    const glowColor =
      item.type === 'golden_pumpkin' ? 'rgba(250, 204, 21, 0.5)' :
      item.type === 'magic_pumpkin' ? 'rgba(236, 72, 153, 0.5)' :
      item.type === 'speed_potion' ? 'rgba(168, 85, 247, 0.5)' :
      item.type === 'shield' ? 'rgba(56, 189, 248, 0.5)' :
      item.type === 'fire_pumpkin' ? 'rgba(239, 68, 68, 0.6)' :
      'rgba(249, 115, 22, 0.35)';

    const halo = ctx.createRadialGradient(0, 0, 4, 0, 0, 20);
    halo.addColorStop(0, glowColor);
    halo.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.fill();

    switch (item.type) {
      case 'normal_pumpkin': {
        // Orange pumpkin
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.ellipse(0, 0, 11, 9, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ea580c';
        ctx.beginPath();
        ctx.ellipse(-6, 0, 5, 8, -0.2, 0, Math.PI * 2);
        ctx.ellipse(6, 0, 5, 8, 0.2, 0, Math.PI * 2);
        ctx.fill();

        // Stem
        ctx.fillStyle = '#15803d';
        ctx.fillRect(-1.5, -12, 3, 4);

        // Face
        ctx.fillStyle = '#fef08a';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 6;
        ctx.fillRect(-5, -2, 2.5, 2.5);
        ctx.fillRect(2.5, -2, 2.5, 2.5);
        ctx.beginPath();
        ctx.moveTo(-4, 3);
        ctx.lineTo(-2, 5);
        ctx.lineTo(2, 5);
        ctx.lineTo(4, 3);
        ctx.closePath();
        ctx.fill();
        break;
      }

      case 'golden_pumpkin': {
        // Shimmering Golden Pumpkin
        ctx.fillStyle = '#fbbf24';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.ellipse(0, 0, 12, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.ellipse(0, -1, 7, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Shiny golden stem
        ctx.fillStyle = '#854d0e';
        ctx.fillRect(-1.5, -13, 3, 4.5);

        // Glowing white face
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-5, -2, 3, 3);
        ctx.fillRect(2, -2, 3, 3);
        ctx.fillRect(-3, 3, 6, 2.5);

        // Rotating star sparkles
        const rot = item.pulseTime * 3;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 4; i++) {
          const a = rot + (i * Math.PI) / 2;
          const sx = Math.cos(a) * 16;
          const sy = Math.sin(a) * 16;
          ctx.beginPath();
          ctx.moveTo(sx - 2, sy);
          ctx.lineTo(sx + 2, sy);
          ctx.moveTo(sx, sy - 2);
          ctx.lineTo(sx, sy + 2);
          ctx.stroke();
        }
        break;
      }

      case 'magic_pumpkin': {
        // Mystical Magenta Pumpkin (+1 Heart)
        ctx.fillStyle = '#ec4899';
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.ellipse(0, 0, 11, 9, 0, 0, Math.PI * 2);
        ctx.fill();

        // Stem
        ctx.fillStyle = '#a855f7';
        ctx.fillRect(-1.5, -12, 3, 4);

        // Heart symbol in center
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(0, 2);
        ctx.bezierCurveTo(-5, -3, -7, 0, 0, 6);
        ctx.bezierCurveTo(7, 0, 5, -3, 0, 2);
        ctx.fill();
        break;
      }

      case 'speed_potion': {
        // Glass Flask with bubbling purple elixir
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 1.5;

        // Flask neck
        ctx.fillRect(-3, -11, 6, 5);
        ctx.strokeRect(-3, -11, 6, 5);

        // Cork
        ctx.fillStyle = '#78350f';
        ctx.fillRect(-2.5, -14, 5, 3);

        // Flask belly
        ctx.fillStyle = 'rgba(168, 85, 247, 0.85)';
        ctx.beginPath();
        ctx.arc(0, 2, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Speed lightning icon inside
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.moveTo(1, -2);
        ctx.lineTo(-3, 3);
        ctx.lineTo(-0.5, 3);
        ctx.lineTo(-1.5, 7);
        ctx.lineTo(3.5, 1);
        ctx.lineTo(1, 1);
        ctx.closePath();
        ctx.fill();
        break;
      }

      case 'shield': {
        // Runic Protective Crystal Shield
        ctx.fillStyle = '#0284c7';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#0ea5e9';
        ctx.shadowBlur = 10;

        // Shield crest shape
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(9, -4);
        ctx.lineTo(7, 6);
        ctx.lineTo(0, 11);
        ctx.lineTo(-7, 6);
        ctx.lineTo(-9, -4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Inner glowing crest
        ctx.fillStyle = '#e0f2fe';
        ctx.beginPath();
        ctx.moveTo(0, -6);
        ctx.lineTo(5, -2);
        ctx.lineTo(0, 7);
        ctx.lineTo(-5, -2);
        ctx.closePath();
        ctx.fill();
        break;
      }

      case 'fire_pumpkin': {
        // Blazing Fire Pumpkin
        ctx.fillStyle = '#ef4444';
        ctx.shadowColor = '#f97316';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.ellipse(0, 1, 11, 9, 0, 0, Math.PI * 2);
        ctx.fill();

        // Stem
        ctx.fillStyle = '#78350f';
        ctx.fillRect(-1.5, -11, 3, 4);

        // Dancing flame on top
        const flameH = 6 + Math.sin(item.pulseTime * 15) * 3;
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.moveTo(-4, -8);
        ctx.quadraticCurveTo(0, -8 - flameH, 0, -8 - flameH * 1.3);
        ctx.quadraticCurveTo(3, -8 - flameH, 4, -8);
        ctx.closePath();
        ctx.fill();

        // Fierce glowing fire face
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(-5, -1, 3, 2.5);
        ctx.fillRect(2, -1, 3, 2.5);
        ctx.beginPath();
        ctx.moveTo(-5, 4);
        ctx.lineTo(0, 7);
        ctx.lineTo(5, 4);
        ctx.lineTo(0, 5);
        ctx.closePath();
        ctx.fill();
        break;
      }
    }

    ctx.restore();
  }

  // Draw Forest Obstacles (Creepy Trees, Gravestones, Abandoned shacks)
  public static drawObstacle(ctx: CanvasRenderingContext2D, obs: Obstacle) {
    ctx.save();
    ctx.translate(obs.x, obs.y);

    if (obs.type === 'tree') {
      // Tree base shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.ellipse(0, 10, obs.radius * 1.2, obs.radius * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Twisted dark gnarled trunk
      ctx.fillStyle = '#1c1917';
      ctx.beginPath();
      ctx.moveTo(-obs.radius * 0.5, 10);
      ctx.quadraticCurveTo(-obs.radius * 0.3, -obs.radius * 0.8, -obs.radius * 0.2, -obs.radius * 1.6);
      ctx.lineTo(obs.radius * 0.2, -obs.radius * 1.6);
      ctx.quadraticCurveTo(obs.radius * 0.3, -obs.radius * 0.8, obs.radius * 0.5, 10);
      ctx.closePath();
      ctx.fill();

      // Bare, jagged creepy branches
      ctx.strokeStyle = '#292524';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-obs.radius * 0.2, -obs.radius * 1.4);
      ctx.lineTo(-obs.radius * 0.9, -obs.radius * 2.0);
      ctx.lineTo(-obs.radius * 1.2, -obs.radius * 2.4);

      ctx.moveTo(obs.radius * 0.2, -obs.radius * 1.4);
      ctx.lineTo(obs.radius * 0.9, -obs.radius * 2.1);
      ctx.lineTo(obs.radius * 1.3, -obs.radius * 2.5);

      ctx.moveTo(0, -obs.radius * 1.6);
      ctx.lineTo(0, -obs.radius * 2.6);
      ctx.stroke();

      // Subtle eerie hollow eye in trunk
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.ellipse(0, -obs.radius * 0.5, 3, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (obs.type === 'tombstone') {
      // Tombstone shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(0, 8, obs.radius * 1.1, obs.radius * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Weathered stone slab
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.roundRect(-obs.radius * 0.8, -obs.radius * 1.2, obs.radius * 1.6, obs.radius * 1.8, [12, 12, 2, 2]);
      ctx.fill();

      // Stone highlight
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // "RIP" inscription
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('R.I.P', 0, -obs.radius * 0.3);

      // Cracked stone fissure
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(obs.radius * 0.3, -obs.radius * 0.9);
      ctx.lineTo(obs.radius * 0.1, -obs.radius * 0.6);
      ctx.lineTo(obs.radius * 0.25, -obs.radius * 0.4);
      ctx.stroke();
    } else if (obs.type === 'shack') {
      // Abandoned crooked shack ruin
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(0, 16, obs.radius * 1.4, obs.radius * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Wooden walls
      ctx.fillStyle = '#271c19';
      ctx.fillRect(-obs.radius * 1.1, -obs.radius * 0.8, obs.radius * 2.2, obs.radius * 1.6);

      // Broken roof
      ctx.fillStyle = '#1a1412';
      ctx.beginPath();
      ctx.moveTo(-obs.radius * 1.3, -obs.radius * 0.8);
      ctx.lineTo(0, -obs.radius * 1.8);
      ctx.lineTo(obs.radius * 1.3, -obs.radius * 0.8);
      ctx.closePath();
      ctx.fill();

      // Glowing haunted window
      ctx.fillStyle = '#f59e0b';
      ctx.shadowColor = '#d97706';
      ctx.shadowBlur = 8;
      ctx.fillRect(-obs.radius * 0.4, -obs.radius * 0.3, obs.radius * 0.8, obs.radius * 0.7);

      // Window cross
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#1a1412';
      ctx.fillRect(-obs.radius * 0.4, -obs.radius * 0.05, obs.radius * 0.8, 2);
      ctx.fillRect(-1, -obs.radius * 0.3, 2, obs.radius * 0.7);
    }

    ctx.restore();
  }

  // Draw Jack-o'-Lantern Nova Wave
  public static drawNovaWave(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, alpha: number) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

    // Outer shockwave ring
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#ea580c';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Inner bright yellow ring
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.9, 0, Math.PI * 2);
    ctx.stroke();

    // Fiery radial gradient
    const grad = ctx.createRadialGradient(x, y, radius * 0.6, x, y, radius);
    grad.addColorStop(0, 'rgba(249, 115, 22, 0)');
    grad.addColorStop(0.7, 'rgba(234, 88, 12, 0.25)');
    grad.addColorStop(1, 'rgba(254, 240, 138, 0.4)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
