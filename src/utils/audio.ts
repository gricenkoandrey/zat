// Audio utilities: Realistic lottery scratch-off sound & magical chime
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioCtx) {
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

let lastScratchTime = 0;

/**
 * Realistic tactile coin-on-foil scratch sound.
 * Simulates the friction of metal scraping latex foil coating.
 */
export function playScratchSound(intensity: number = 1) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    if (now - lastScratchTime < 0.045) return; // Smooth throttling
    lastScratchTime = now;

    const duration = 0.05 + Math.random() * 0.03;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate textured noise simulating lottery foil friction
    for (let i = 0; i < bufferSize; i++) {
      const envelope = 1 - i / bufferSize;
      const grain = Math.random() * 2 - 1;
      data[i] = grain * envelope;
    }

    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = buffer;

    // High band-pass filter for crisp metallic scrape
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 2400 + Math.random() * 800;
    bandpass.Q.value = 2.5;

    // Gain node with soft volume
    const gainNode = ctx.createGain();
    const volume = Math.min(0.28, 0.16 * intensity);
    gainNode.gain.setValueAtTime(volume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noiseNode.connect(bandpass);
    bandpass.connect(gainNode);
    gainNode.connect(ctx.destination);

    noiseNode.start(now);
  } catch {
    // AudioContext blocked or not supported
  }
}

/**
 * Gentle magical bell chime on surprise reveal
 */
export function playChimeSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const frequencies = [587.33, 880, 1174.66, 1760]; // D5, A5, D6, A6 (warm open fifths)
    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12 / (idx + 1), now + idx * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 1.3);
    });
  } catch {
    // AudioContext blocked or not supported
  }
}

export function playCutePopSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  } catch {}
}

export function playFootstepSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Subtle wooden/parchment tapping pitch
    osc.frequency.setValueAtTime(140 + Math.random() * 30, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.05);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.055);
  } catch {}
}

export function playEnvelopeOpenSound() {
  playCutePopSound();
}

export function setSoundMuted(_muted: boolean) {}
export function getSoundMuted(): boolean {
  return false;
}
export function startRomanticMusic() {}
export function stopRomanticMusic() {}
export function isRomanticMusicActive(): boolean {
  return false;
}
