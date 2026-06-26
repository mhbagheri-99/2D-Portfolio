/* =========================================================================
 *  world.js  —  a little house: multiple rooms, tiles, furniture,
 *               collision, interaction triggers, and animated objects
 * ========================================================================= */

const TILE = 16;            // pixels per tile (before scaling)
const COLS = 24;            // room width in tiles
const ROWS = 16;            // room height in tiles

/* ---- tile drawing (colours come from the current room's theme) ---- */
function drawFloorTile(ctx, x, y, col) {
  ctx.fillStyle = col.floor;
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = col.floorSeam;
  ctx.fillRect(x, y + TILE - 2, TILE, 2);
  ctx.fillStyle = col.floorFleck;
  ctx.fillRect(x + 2, y + 2, 3, 1);
  ctx.fillRect(x + 9, y + 6, 4, 1);
}

function drawWallTile(ctx, x, y, baseboard, col) {
  ctx.fillStyle = col.wall;
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = col.wallTop;
  ctx.fillRect(x, y, TILE, 3);
  if (baseboard) {
    ctx.fillStyle = col.wallBase;
    ctx.fillRect(x, y + TILE - 3, TILE, 3);
  }
}

/* ===================== ROOM DEFINITIONS ===================== */
const THEMES = {
  living: {
    floor: "#7a5230", floorSeam: "#6b4626", floorFleck: "#86603a",
    wall: "#3a4a63", wallTop: "#4a5d7e", wallBase: "#2b3850",
    rugPal: { a: "#ef5253", b: "#c43a3a", c: "#ffcd75", k: "#1a1c2c" },
  },
  study: {
    floor: "#6e4a2c", floorSeam: "#5d3d23", floorFleck: "#7d5634",
    wall: "#3a5a4a", wallTop: "#4a7a5d", wallBase: "#2b4030",
    rugPal: { a: "#3b6ea5", b: "#2d5683", c: "#a7d8ff", k: "#1a1c2c" },
  },
};

function roomDefs() {
  const A = window.SPRITES.ART;
  return {
    living: {
      name: "Living Room",
      theme: THEMES.living,
      spawn: { x: 176, y: 176, facing: "down" },
      objects: [
        { id: "window", art: A.window, x: 16, y: 6, scale: 3, decor: true, solidRows: 0,
          clouds: { cx: 2, cy: 2, cw: 24, ch: 5 } },
        { id: "board", art: A.board, x: 120, y: 6, scale: 3, action: "cv",
          label: "Read CV & Achievements", solidRows: 1 },
        { id: "door", art: A.door, x: 292, y: 2, scale: 3, label: "Enter the Study",
          portal: { to: "study", spawn: { x: 54, y: 64, facing: "down" } }, solidRows: 1 },
        { id: "mailbox", art: A.mailbox, x: 300, y: 150, scale: 3, action: "contact",
          label: "Check the Mailbox", solidRows: 2 },
        { id: "plant", art: A.plant, x: 24, y: 150, scale: 3, decor: true, solidRows: 2,
          sway: { amp: 2, speed: 2.1 } },
      ],
    },
    study: {
      name: "Study",
      theme: THEMES.study,
      spawn: { x: 176, y: 176, facing: "down" },
      objects: [
        { id: "door", art: A.door, x: 24, y: 2, scale: 3, label: "Back to Living Room",
          portal: { to: "living", spawn: { x: 300, y: 64, facing: "down" } }, solidRows: 1 },
        { id: "desk", art: A.desk, x: 132, y: 6, scale: 3, action: "projects",
          label: "Browse Projects", solidRows: 1, screen: { cx: 12, cy: 2, cw: 8, ch: 4 } },
        { id: "window", art: A.window, x: 290, y: 6, scale: 3, decor: true, solidRows: 0,
          clouds: { cx: 2, cy: 2, cw: 24, ch: 5 } },
        { id: "shelf", art: A.shelf, x: 8, y: 150, scale: 3, decor: true, solidRows: 1 },
        { id: "plant", art: A.plant, x: 340, y: 150, scale: 3, decor: true, solidRows: 2,
          sway: { amp: 2, speed: 1.7 } },
      ],
    },
  };
}

/* grid size in cells (rows may vary → widest row wins) */
function gridSize(grid) {
  let cols = 0;
  for (const row of grid) cols = Math.max(cols, row.length);
  return { cols, rows: grid.length };
}

/* Build a room's collision grid + ready-to-draw objects from its definition. */
function buildRoom(key) {
  const def = roomDefs()[key];
  const solid = [];
  for (let r = 0; r < ROWS; r++) {
    solid[r] = [];
    for (let c = 0; c < COLS; c++)
      solid[r][c] = r < 2 || c === 0 || c === COLS - 1 || r === ROWS - 1;
  }

  const objects = def.objects.map((d) => {
    const { cols, rows } = gridSize(d.art.grid);
    const w = cols * d.scale, h = rows * d.scale;
    const o = { ...d, w, h, draw: makeDraw(d) };

    const c0 = Math.floor(d.x / TILE), c1 = Math.floor((d.x + w - 1) / TILE);
    const r1 = Math.floor((d.y + h - 1) / TILE);
    const r0 = Math.max(0, r1 - (d.solidRows ?? 1) + 1);
    for (let r = r0; r <= r1; r++)
      for (let c = c0; c <= c1; c++)
        if (solid[r] && solid[r][c] !== undefined) solid[r][c] = true;

    if (!d.decor) {
      const cc = Math.floor((d.x + w / 2) / TILE);
      o.front = { c: cc, r: Math.min(ROWS - 2, r1 + 1) };
    }
    return o;
  });

  return { key, name: def.name, theme: def.theme, spawn: def.spawn, solid, objects };
}

/* Each object draws its static art (optionally swaying) plus any animation. */
function makeDraw(d) {
  return function (ctx, t) {
    const opts = d.sway ? { sway: { amp: d.sway.amp, speed: d.sway.speed, time: t } } : undefined;
    window.SPRITES.drawPixels(ctx, d.art.grid, d.art.pal, d.x, d.y, d.scale, opts);
    if (d.screen) animScreen(ctx, d, t);
    if (d.clouds) animClouds(ctx, d, t);
  };
}

function cellRect(o, c) {
  return { x: o.x + c.cx * o.scale, y: o.y + c.cy * o.scale, w: c.cw * o.scale, h: c.ch * o.scale };
}

/* Animated PC screen: scrolling "code" bars, scanline, blinking cursor. */
function animScreen(ctx, o, t) {
  const r = cellRect(o, o.screen);
  ctx.save();
  ctx.beginPath(); ctx.rect(r.x, r.y, r.w, r.h); ctx.clip();
  ctx.fillStyle = "#0b2a3a"; ctx.fillRect(r.x, r.y, r.w, r.h);

  const lineH = 3, gap = 2, step = lineH + gap;
  const scroll = (t * 14) % step;
  const cols = ["#7ee3ff", "#41a6f6", "#ffcd75", "#38b764"];
  let i = 0;
  for (let yy = r.y - step + scroll; yy < r.y + r.h; yy += step, i++) {
    const seed = Math.floor((yy - scroll) / step) + 7;
    const indent = (seed % 3) * 4;
    const wd = 6 + ((seed * 7) % Math.max(6, r.w - indent - 6));
    ctx.fillStyle = cols[seed % cols.length];
    ctx.fillRect(r.x + 3 + indent, yy, Math.min(wd, r.w - 6 - indent), lineH);
  }
  // blinking cursor block
  if (Math.floor(t * 2) % 2 === 0) {
    ctx.fillStyle = "#a7f3ff";
    ctx.fillRect(r.x + 4, r.y + r.h - 6, 4, 4);
  }
  // soft scanline
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  const sl = r.y + ((t * 40) % r.h);
  ctx.fillRect(r.x, sl, r.w, 2);
  ctx.restore();
}

/* Animated window clouds drifting across the sky. */
function animClouds(ctx, o, t) {
  const r = cellRect(o, o.clouds);
  ctx.save();
  ctx.beginPath(); ctx.rect(r.x, r.y, r.w, r.h); ctx.clip();
  ctx.fillStyle = "rgba(244,244,244,0.92)";
  const puffs = [
    { w: 22, h: 7, y: 0.30, sp: 7, ph: 0 },
    { w: 16, h: 6, y: 0.62, sp: 5, ph: 0.5 },
  ];
  for (const p of puffs) {
    const span = r.w + p.w;
    let x = r.x - p.w + ((t * p.sp + p.ph * span) % span);
    const y = r.y + r.h * p.y;
    ctx.fillRect(x, y, p.w, p.h);
    ctx.fillRect(x + 5, y - 3, p.w - 10, 3);   // little bump on top
  }
  ctx.restore();
}

/* Draw the static room (walls, floor, rug) for the given room state. */
function drawRoom(ctx, room) {
  const col = room.theme;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = c * TILE, y = r * TILE;
      if (r < 2) drawWallTile(ctx, x, y, r === 1, col);
      else if (c === 0 || c === COLS - 1 || r === ROWS - 1) drawWallTile(ctx, x, y, false, col);
      else drawFloorTile(ctx, x, y, col);
    }
  }
  window.SPRITES.drawPixels(ctx, window.SPRITES.ART.rug.grid, col.rugPal, 6 * TILE, 9 * TILE, 3);
}

window.WORLD = {
  TILE, COLS, ROWS,
  buildRoom, drawRoom,
  WIDTH: COLS * TILE, HEIGHT: ROWS * TILE,
};
