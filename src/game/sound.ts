/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AudioSettings } from './types';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private masterGain: GainNode | null = null;

  private isMusicPlaying = false;
  private musicInterval: number | null = null;
  private musicDroneOsc: OscillatorNode | null = null;
  private musicDroneGain: GainNode | null = null;
  private musicNoteIndex = 0;
  private currentStage = 1;

  public settings: AudioSettings = {
    masterMuted: false,
    musicMuted: false,
    sfxMuted: false,
    volume: 0.7,
  };

  constructor() {
    // Load persisted audio settings
    try {
      const saved = localStorage.getItem('pumpkin_panic_audio_settings');
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.settings.masterMuted ? 0 : this.settings.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.settings.musicMuted ? 0 : 0.4, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.settings.sfxMuted ? 0 : 0.7, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public saveSettings() {
    try {
      localStorage.setItem('pumpkin_panic_audio_settings', JSON.stringify(this.settings));
    } catch {
      // ignore
    }
    this.updateGains();
  }

  public updateGains() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.settings.masterMuted ? 0 : this.settings.volume, now);
    }
    if (this.musicGain) {
      this.musicGain.gain.setValueAtTime(this.settings.musicMuted ? 0 : 0.35, now);
    }
    if (this.sfxGain) {
      this.sfxGain.gain.setValueAtTime(this.settings.sfxMuted ? 0 : 0.65, now);
    }
  }

  public setVolume(vol: number) {
    this.settings.volume = Math.max(0, Math.min(1, vol));
    this.saveSettings();
  }

  public toggleMute() {
    this.settings.masterMuted = !this.settings.masterMuted;
    this.saveSettings();
    return this.settings.masterMuted;
  }

  public toggleMusic() {
    this.settings.musicMuted = !this.settings.musicMuted;
    this.saveSettings();
    return this.settings.musicMuted;
  }

  public toggleSfx() {
    this.settings.sfxMuted = !this.settings.sfxMuted;
    this.saveSettings();
    return this.settings.sfxMuted;
  }

  /* ----------------- SFX GENERATORS ----------------- */

  public playButton() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.settings.sfxMuted || this.settings.masterMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  public playPickupNormal() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.settings.sfxMuted || this.settings.masterMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.12); // A5

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.19);
  }

  public playPickupGolden() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.settings.sfxMuted || this.settings.masterMuted) return;

    const now = this.ctx.currentTime;
    // Ascending celebratory arpeggio: D5, F#5, A5, D6
    const notes = [587.33, 739.99, 880.0, 1174.66];
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + idx * 0.06;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.26);
    });
  }

  public playPickupMagic() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.settings.sfxMuted || this.settings.masterMuted) return;

    const now = this.ctx.currentTime;
    // Healing chime: A4, C#5, E5, A5 with gentle swell
    const notes = [440.0, 554.37, 659.25, 880.0];
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + idx * 0.07;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.01, t);
      gain.gain.exponentialRampToValueAtTime(0.35, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.36);
    });
  }

  public playPickupSpeed() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.settings.sfxMuted || this.settings.masterMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.22);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.26);
  }

  public playPickupShield() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.settings.sfxMuted || this.settings.masterMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(330, now);
    osc.frequency.linearRampToValueAtTime(660, now + 0.15);
    osc.frequency.linearRampToValueAtTime(550, now + 0.3);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.36);
  }

  public playPlayerHurt() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.settings.sfxMuted || this.settings.masterMuted) return;

    const now = this.ctx.currentTime;
    // Punchy noise impact + low pitch drop
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.2);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.26);
  }

  public playShieldBreak() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.settings.sfxMuted || this.settings.masterMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(900, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.2);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.23);
  }

  public playFireExplosion() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.settings.sfxMuted || this.settings.masterMuted) return;

    const now = this.ctx.currentTime;
    // Low rumble boom
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.5);

    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.61);

    // Crackle noise burst
    try {
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.12));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.4, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      noise.connect(noiseGain);
      noiseGain.connect(this.sfxGain);
      noise.start(now);
    } catch {
      // fallback
    }
  }

  public playSpecialNova() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.settings.sfxMuted || this.settings.masterMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(700, now + 0.15);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.5);

    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.56);
  }

  public playEnemyDeath() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.settings.sfxMuted || this.settings.masterMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.14);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.17);
  }

  public playStageAdvance() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.settings.sfxMuted || this.settings.masterMuted) return;

    const now = this.ctx.currentTime;
    // Ominous gong / bell
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.8);

    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.95);
  }

  public playGameOver() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.settings.sfxMuted || this.settings.masterMuted) return;

    const now = this.ctx.currentTime;
    const notes = [293.66, 261.63, 233.08, 196.0, 146.83]; // D4, C4, Bb3, G3, D3
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + idx * 0.18;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.45);
    });
  }

  public playVictory() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.settings.sfxMuted || this.settings.masterMuted) return;

    const now = this.ctx.currentTime;
    // Triumphant fanfare
    const notes = [
      { f: 587.33, d: 0.12 }, // D5
      { f: 587.33, d: 0.12 },
      { f: 587.33, d: 0.12 },
      { f: 783.99, d: 0.35 }, // G5
      { f: 880.00, d: 0.2 },  // A5
      { f: 987.77, d: 0.2 },  // B5
      { f: 1174.66, d: 0.7 }  // D6
    ];

    let t = now;
    notes.forEach((note) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, t);

      gain.gain.setValueAtTime(0.45, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + note.d + 0.05);

      t += note.d + 0.04;
    });
  }

  /* ----------------- PROCEDURAL HALLOWEEN BGM ----------------- */

  public startMusic(stage: number = 1) {
    this.initContext();
    this.currentStage = stage;
    if (this.isMusicPlaying) {
      this.updateMusicTempo();
      return;
    }

    this.isMusicPlaying = true;
    this.startBassDrone();

    // Spooky minor arpeggio sequence (D Minor / Halloween melody)
    // D3, F3, A3, Bb3, A3, F3, G3, E3, D3, C#3, D3
    const melodyStage1 = [146.83, 174.61, 220.0, 233.08, 220.0, 174.61, 196.0, 164.81, 146.83, 138.59, 146.83, 0];
    const melodyStage2 = [293.66, 349.23, 440.0, 466.16, 440.0, 349.23, 392.0, 329.63, 293.66, 277.18, 293.66, 0];
    const melodyStage3 = [293.66, 349.23, 466.16, 523.25, 587.33, 466.16, 440.0, 349.23, 392.0, 329.63, 293.66, 349.23];

    const stepDuration = stage === 1 ? 260 : stage === 2 ? 200 : 150; // ms

    this.musicInterval = window.setInterval(() => {
      if (!this.ctx || !this.musicGain || this.settings.musicMuted || this.settings.masterMuted) {
        return;
      }

      const activeMelody = this.currentStage === 1 ? melodyStage1 : this.currentStage === 2 ? melodyStage2 : melodyStage3;
      const freq = activeMelody[this.musicNoteIndex % activeMelody.length];
      this.musicNoteIndex++;

      if (freq > 0) {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Eerie organ / sine
        osc.type = this.currentStage === 3 ? 'sawtooth' : 'sine';
        osc.frequency.setValueAtTime(freq, now);

        // Theremin subtle vibrato
        const vibrato = this.ctx.createOscillator();
        const vibratoGain = this.ctx.createGain();
        vibrato.frequency.setValueAtTime(5.5, now);
        vibratoGain.gain.setValueAtTime(6.0, now);
        vibrato.connect(vibratoGain);
        vibratoGain.connect(osc.frequency);
        vibrato.start(now);
        vibrato.stop(now + stepDuration / 1000);

        const noteVol = this.currentStage === 3 ? 0.15 : 0.22;
        gain.gain.setValueAtTime(noteVol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + (stepDuration * 0.9) / 1000);

        osc.connect(gain);
        gain.connect(this.musicGain);

        osc.start(now);
        osc.stop(now + stepDuration / 1000);
      }
    }, stepDuration);
  }

  private startBassDrone() {
    if (!this.ctx || !this.musicGain || this.musicDroneOsc) return;

    try {
      this.musicDroneOsc = this.ctx.createOscillator();
      this.musicDroneGain = this.ctx.createGain();

      this.musicDroneOsc.type = 'triangle';
      this.musicDroneOsc.frequency.setValueAtTime(73.42, this.ctx.currentTime); // D2

      this.musicDroneGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

      this.musicDroneOsc.connect(this.musicDroneGain);
      this.musicDroneGain.connect(this.musicGain);

      this.musicDroneOsc.start();
    } catch {
      // ignore
    }
  }

  public setStage(stage: number) {
    if (this.currentStage !== stage) {
      this.currentStage = stage;
      this.playStageAdvance();
      if (this.isMusicPlaying) {
        this.stopMusic();
        this.startMusic(stage);
      }
    }
  }

  private updateMusicTempo() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    this.isMusicPlaying = false;
    this.startMusic(this.currentStage);
  }

  public stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    if (this.musicDroneOsc) {
      try {
        this.musicDroneOsc.stop();
        this.musicDroneOsc.disconnect();
      } catch {
        // ignore
      }
      this.musicDroneOsc = null;
    }
    this.isMusicPlaying = false;
  }
}

export const sound = new SoundEngine();
