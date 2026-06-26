/* =========================================================================
 *  game.js  —  boot, input, room transitions, render loop, overlay & audio
 * ========================================================================= */
(function () {
  const W = window.WORLD;
  const P = window.PLAYER_API;
  const AUDIO = window.AUDIO;

  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  canvas.width = W.WIDTH;
  canvas.height = W.HEIGHT;

  const prompt = document.getElementById("prompt");
  const overlay = document.getElementById("overlay");
  const panel = document.getElementById("panel");
  const title = document.getElementById("title");
  const roomLabel = document.getElementById("roomlabel");
  const soundBtn = document.getElementById("sound-btn");

  let room = W.buildRoom("living");
  const player = P.createPlayer();
  Object.assign(player, room.spawn);

  // floating dust motes for ambience
  const dust = Array.from({ length: 16 }, () => ({
    x: Math.random() * W.WIDTH,
    y: 32 + Math.random() * (W.HEIGHT - 48),
    s: 0.1 + Math.random() * 0.25,
    a: 0.05 + Math.random() * 0.12,
    ph: Math.random() * Math.PI * 2,
  }));

  const input = { up: false, down: false, left: false, right: false };
  let overlayOpen = false;
  let started = false;
  let near = null;
  let lastStep = 0;

  // room transition state
  const trans = { active: false, phase: "out", alpha: 0, to: null, spawn: null };

  /* ---------- integer scaling ---------- */
  function resize() {
    const scale = Math.max(1, Math.floor(
      Math.min(window.innerWidth / W.WIDTH, window.innerHeight / W.HEIGHT)));
    canvas.style.width = W.WIDTH * scale + "px";
    canvas.style.height = W.HEIGHT * scale + "px";
  }
  window.addEventListener("resize", resize);
  resize();

  /* ---------- input ---------- */
  const KEYS = {
    ArrowUp: "up", KeyW: "up", ArrowDown: "down", KeyS: "down",
    ArrowLeft: "left", KeyA: "left", ArrowRight: "right", KeyD: "right",
  };
  window.addEventListener("keydown", (e) => {
    if (!started) { if (e.code === "Enter" || e.code === "Space") startGame(); return; }
    if (e.code === "KeyM") { reflectMute(AUDIO.toggleMute()); return; }
    if (overlayOpen) { if (e.code === "Escape") closeOverlay(); return; }
    if (KEYS[e.code]) { input[KEYS[e.code]] = true; e.preventDefault(); }
    if ((e.code === "KeyE" || e.code === "Enter" || e.code === "Space") && near) {
      activate(near); e.preventDefault();
    }
  });
  window.addEventListener("keyup", (e) => {
    if (KEYS[e.code]) { input[KEYS[e.code]] = false; e.preventDefault(); }
  });

  /* ---------- touch / mouse controls ---------- */
  document.querySelectorAll("[data-dir]").forEach((btn) => {
    const dir = btn.getAttribute("data-dir");
    const on = (e) => { e.preventDefault(); input[dir] = true; };
    const off = (e) => { e.preventDefault(); input[dir] = false; };
    btn.addEventListener("touchstart", on, { passive: false });
    btn.addEventListener("touchend", off);
    btn.addEventListener("mousedown", on);
    btn.addEventListener("mouseup", off);
    btn.addEventListener("mouseleave", off);
  });
  document.getElementById("btn-action").addEventListener("click", () => {
    if (near && !overlayOpen && !trans.active) activate(near);
  });

  /* ---------- activation: overlay OR room portal ---------- */
  function activate(obj) {
    if (obj.portal) startTransition(obj.portal);
    else openOverlay(obj.action);
  }

  function openOverlay(action) {
    panel.innerHTML = window.INTERACTIONS.buildPanel(action);
    panel.scrollTop = 0;
    overlay.classList.add("open");
    overlayOpen = true;
    for (const k in input) input[k] = false;
    AUDIO.sfx("open");
  }
  function closeOverlay() {
    overlay.classList.remove("open");
    overlayOpen = false;
    AUDIO.sfx("close");
  }
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay || e.target.id === "overlay-close") closeOverlay();
  });

  function startTransition(portal) {
    if (trans.active) return;
    trans.active = true; trans.phase = "out"; trans.alpha = 0;
    trans.to = portal.to; trans.spawn = portal.spawn;
    for (const k in input) input[k] = false;
    AUDIO.sfx("door");
  }

  /* ---------- title / start ---------- */
  function startGame() {
    if (started) return;
    started = true;
    title.classList.add("hidden");
    AUDIO.init();
    AUDIO.startMusic();
    reflectMute(AUDIO.isMuted());
  }
  document.getElementById("start-btn").addEventListener("click", startGame);

  function reflectMute(isMuted) {
    soundBtn.textContent = isMuted ? "🔇" : "🔊";
    soundBtn.classList.toggle("off", isMuted);
  }
  soundBtn.addEventListener("click", () => { AUDIO.init(); reflectMute(AUDIO.toggleMute()); });

  /* title text from content */
  const prof = window.CONTENT.profile;
  document.getElementById("title-name").textContent = prof.name;
  document.getElementById("title-role").textContent = prof.title;
  document.getElementById("title-intro").textContent = prof.intro;
  document.getElementById("nameplate").textContent = prof.name;
  roomLabel.textContent = room.name;
  reflectMute(AUDIO.isMuted());

  /* ---------- helpers ---------- */
  function drawDust(t) {
    for (const d of dust) {
      d.x += d.s + Math.sin(t * 0.5 + d.ph) * 0.15;
      if (d.x > W.WIDTH + 2) d.x = -2;
      const y = d.y + Math.sin(t * 0.8 + d.ph) * 3;
      ctx.fillStyle = `rgba(255,255,240,${d.a})`;
      ctx.fillRect(d.x, y, 1, 1);
    }
  }

  /* ---------- main loop ---------- */
  let lastT = performance.now();
  function frame(now) {
    const t = now / 1000;
    const dt = (now - lastT) / 1000; lastT = now;

    // transition fade logic
    if (trans.active) {
      const SPD = 5; // alpha per second
      if (trans.phase === "out") {
        trans.alpha += SPD * dt;
        if (trans.alpha >= 1) {
          trans.alpha = 1; trans.phase = "in";
          room = W.buildRoom(trans.to);
          Object.assign(player, trans.spawn);
          player.facing = trans.spawn.facing || "down";
          near = null;
          roomLabel.textContent = room.name;
          roomLabel.classList.add("flash");
          setTimeout(() => roomLabel.classList.remove("flash"), 700);
        }
      } else {
        trans.alpha -= SPD * dt;
        if (trans.alpha <= 0) { trans.alpha = 0; trans.active = false; }
      }
    }

    const canMove = started && !overlayOpen && !trans.active;
    if (canMove) {
      const wasBlocked = !tryStep();
      near = P.nearbyObject(player, room.objects);
      // footstep cadence
      if (player.moving && t - lastStep > 0.27) { AUDIO.sfx("step"); lastStep = t; }
      if (wasBlocked && player.moving && t - lastStep > 0.18) { AUDIO.sfx("bump"); lastStep = t; }
    }

    // ---- render ----
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    W.drawRoom(ctx, room);
    for (const o of room.objects) o.draw(ctx, t);
    P.drawPlayer(ctx, player, t);
    drawDust(t);

    if (trans.active) {
      ctx.fillStyle = `rgba(8,8,14,${trans.alpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // interaction prompt
    if (near && near.label && canMove) {
      prompt.textContent = "▶ " + near.label + "  [E]";
      prompt.classList.add("show");
    } else {
      prompt.classList.remove("show");
    }

    requestAnimationFrame(frame);
  }

  /* Move and report whether the move was blocked by a wall (for bump SFX). */
  function tryStep() {
    const px = player.x, py = player.y;
    P.updatePlayer(player, input, room.solid);
    if (player.moving && px === player.x && py === player.y) return false; // blocked
    return true;
  }

  requestAnimationFrame(frame);
})();
