/* =========================================================================
 *  audio.js  —  generated 8-bit music + SFX (Web Audio, no asset files)
 * =========================================================================
 *  All sound is synthesised from oscillators and noise. Music is scheduled
 *  with a small look-ahead clock so it loops seamlessly. Honour the browser
 *  rule that audio may only start after a user gesture (we init on Start).
 * ========================================================================= */
(function () {
  let ctx = null, master = null, musicGain = null, sfxGain = null;
  let muted = localStorage.getItem("portfolio-muted") === "1";
  let started = false;

  /* ---- note tables ---- */
  const A2 = 110, F2 = 87.31, C3 = 130.81, G2 = 98;
  const C4 = 261.63, D4 = 293.66, E4 = 329.63, G4 = 392.0, A4 = 440.0;
  const C5 = 523.25, E5 = 659.25, G5 = 783.99;
  const _ = null;

  // 32-step loop, A-minor pentatonic — calm and loopable
  const LEAD = [
    A4, _, C5, E5, A4, _, G4, E4,
    D4, _, E4, G4, A4, _, C5, _,
    G4, _, E4, D4, C4, _, D4, E4,
    A4, _, E4, C4, A4, _, _, _,
  ];
  const BASS = [A2, F2, C3, G2]; // one per 8 steps (Am – F – C – G)

  const BPM = 104;
  const stepDur = 60 / BPM / 2; // eighth notes
  let step = 0, nextTime = 0, timer = null;
  const LOOKAHEAD = 0.1, INTERVAL = 25;

  function init() {
    if (ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 1;
    master.connect(ctx.destination);
    musicGain = ctx.createGain(); musicGain.gain.value = 0.16; musicGain.connect(master);
    sfxGain = ctx.createGain(); sfxGain.gain.value = 0.35; sfxGain.connect(master);
  }

  function tone(freq, start, dur, type, vol, target, glideTo) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, start);
    if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, start + dur);
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(vol, start + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    o.connect(g); g.connect(target || sfxGain);
    o.start(start); o.stop(start + dur + 0.02);
  }

  function noise(start, dur, vol, target) {
    const n = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, n, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < n; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const src = ctx.createBufferSource(); src.buffer = buf;
    const g = ctx.createGain(); g.gain.value = vol;
    src.connect(g); g.connect(target || sfxGain);
    src.start(start);
  }

  function scheduleStep(s, time) {
    const lead = LEAD[s];
    if (lead) tone(lead, time, stepDur * 0.9, "square", 0.5, musicGain);
    if (s % 8 === 0) {
      tone(BASS[(s / 8) | 0], time, stepDur * 3.6, "triangle", 0.7, musicGain); // bass
      noise(time, 0.06, 0.18, musicGain);                                        // kick-ish
    }
    if (s % 2 === 0) noise(time, 0.02, 0.05, musicGain);                         // hat
  }

  function loop() {
    while (nextTime < ctx.currentTime + LOOKAHEAD) {
      scheduleStep(step, nextTime);
      nextTime += stepDur;
      step = (step + 1) % LEAD.length;
    }
  }

  function startMusic() {
    if (!ctx || started) return;
    started = true;
    if (ctx.state === "suspended") ctx.resume();
    step = 0; nextTime = ctx.currentTime + 0.1;
    timer = setInterval(loop, INTERVAL);
  }

  /* ---- one-shot sound effects ---- */
  const SFX = {
    step() { tone(140, ctx.currentTime, 0.05, "square", 0.18); },
    open() { const t = ctx.currentTime; [C5, E5, G5].forEach((f, i) => tone(f, t + i * 0.05, 0.12, "square", 0.3)); },
    close() { const t = ctx.currentTime; [G5, E5, C5].forEach((f, i) => tone(f, t + i * 0.045, 0.1, "square", 0.28)); },
    door() { const t = ctx.currentTime; tone(A4, t, 0.12, "triangle", 0.35); tone(E5, t + 0.1, 0.18, "triangle", 0.32); },
    bump() { tone(70, ctx.currentTime, 0.08, "square", 0.22, null, 50); },
  };
  function sfx(name) { if (ctx && !muted && SFX[name]) SFX[name](); }

  function toggleMute() {
    muted = !muted;
    localStorage.setItem("portfolio-muted", muted ? "1" : "0");
    if (master) master.gain.value = muted ? 0 : 1;
    return muted;
  }

  window.AUDIO = {
    init, startMusic, sfx, toggleMute,
    isMuted: () => muted,
  };
})();
