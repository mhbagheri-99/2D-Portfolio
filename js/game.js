/* =========================================================================
 *  game.js  —  boot, input, render loop, overlay control
 * ========================================================================= */
(function () {
  const W = window.WORLD;
  const P = window.PLAYER_API;

  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  canvas.width = W.WIDTH;
  canvas.height = W.HEIGHT;

  const prompt = document.getElementById("prompt");
  const overlay = document.getElementById("overlay");
  const panel = document.getElementById("panel");
  const title = document.getElementById("title");

  const solid = W.buildRoom();
  const objects = W.buildObjects(solid);
  const player = P.createPlayer();

  const input = { up: false, down: false, left: false, right: false };
  let overlayOpen = false;
  let started = false;
  let near = null;

  /* ---------- integer scaling to fill the window crisply ---------- */
  function resize() {
    const scale = Math.max(
      1,
      Math.floor(Math.min(window.innerWidth / W.WIDTH, window.innerHeight / W.HEIGHT))
    );
    canvas.style.width = W.WIDTH * scale + "px";
    canvas.style.height = W.HEIGHT * scale + "px";
  }
  window.addEventListener("resize", resize);
  resize();

  /* ---------- input ---------- */
  const KEYS = {
    ArrowUp: "up", KeyW: "up",
    ArrowDown: "down", KeyS: "down",
    ArrowLeft: "left", KeyA: "left",
    ArrowRight: "right", KeyD: "right",
  };

  window.addEventListener("keydown", (e) => {
    if (!started) { if (e.code === "Enter" || e.code === "Space") startGame(); return; }
    if (overlayOpen) { if (e.code === "Escape") closeOverlay(); return; }
    if (KEYS[e.code]) { input[KEYS[e.code]] = true; e.preventDefault(); }
    if ((e.code === "KeyE" || e.code === "Enter" || e.code === "Space") && near) {
      openOverlay(near.action);
      e.preventDefault();
    }
  });
  window.addEventListener("keyup", (e) => {
    if (KEYS[e.code]) { input[KEYS[e.code]] = false; e.preventDefault(); }
  });

  /* ---------- touch / click controls ---------- */
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
    if (near && !overlayOpen) openOverlay(near.action);
  });

  /* ---------- overlay ---------- */
  function openOverlay(action) {
    panel.innerHTML = window.INTERACTIONS.buildPanel(action);
    overlay.classList.add("open");
    overlayOpen = true;
    for (const k in input) input[k] = false;
  }
  function closeOverlay() {
    overlay.classList.remove("open");
    overlayOpen = false;
  }
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay || e.target.id === "overlay-close") closeOverlay();
  });

  function startGame() {
    started = true;
    title.classList.add("hidden");
  }
  document.getElementById("start-btn").addEventListener("click", startGame);

  /* show the visitor's name on the title screen */
  const prof = window.CONTENT.profile;
  document.getElementById("title-name").textContent = prof.name;
  document.getElementById("title-role").textContent = prof.title;
  document.getElementById("title-intro").textContent = prof.intro;
  document.getElementById("nameplate").textContent = prof.name;

  /* ---------- main loop ---------- */
  function frame() {
    if (started && !overlayOpen) {
      P.updatePlayer(player, input, solid);
      near = P.nearbyObject(player, objects);
    }

    // render
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    W.drawRoom(ctx);
    for (const o of objects) o.draw(ctx);
    P.drawPlayer(ctx, player);

    // interaction prompt
    if (near && near.label && started && !overlayOpen) {
      prompt.textContent = "▶ " + near.label + "  [E]";
      prompt.classList.add("show");
    } else {
      prompt.classList.remove("show");
    }

    requestAnimationFrame(frame);
  }
  frame();
})();
