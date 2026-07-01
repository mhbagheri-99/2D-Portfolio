/* =========================================================================
 *  world.js  —  a cosy house: rooms, warm tiles, furniture, collision,
 *               interaction triggers, and animated objects
 * ========================================================================= */

const TILE = 16;
const COLS = 24;
const ROWS = 16;

/* ---------------- warm tile drawing (Stardew-ish) ---------------- */
function drawFloorTile(ctx, x, y, c, col, row) {
  const shade = (row % 2 === 0) ? c.floor : c.floorAlt;
  ctx.fillStyle = shade;
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = c.floorLight;                 // top plank highlight
  ctx.fillRect(x, y, TILE, 1);
  ctx.fillStyle = c.floorDark;                  // bottom plank seam
  ctx.fillRect(x, y + TILE - 2, TILE, 2);
  // vertical plank joins, offset like brickwork
  ctx.fillStyle = c.floorDark;
  const jx = (row % 2 === 0) ? 0 : 8;
  ctx.fillRect(x + jx, y, 1, TILE);
  // grain ticks
  ctx.fillStyle = c.floorGrain;
  ctx.fillRect(x + 3, y + 5, 4, 1);
  ctx.fillRect(x + 10, y + 10, 3, 1);
}

/* Back wall (top two rows): cosy wallpaper + crown + chair-rail / baseboard. */
function drawWallTile(ctx, x, y, c, isTop) {
  ctx.fillStyle = c.wall;
  ctx.fillRect(x, y, TILE, TILE);
  // subtle vertical wallpaper stripes
  ctx.fillStyle = c.wallStripe;
  for (let i = 2; i < TILE; i += 6) ctx.fillRect(x + i, y, 2, TILE);
  // little dot motif
  ctx.fillStyle = c.wallDot;
  ctx.fillRect(x + 5, y + 6, 1, 1);
  ctx.fillRect(x + 11, y + 11, 1, 1);
  if (isTop) {                                  // crown moulding at ceiling
    ctx.fillStyle = c.trim;
    ctx.fillRect(x, y, TILE, 3);
    ctx.fillStyle = c.trimDark;
    ctx.fillRect(x, y + 3, TILE, 1);
  } else {                                       // chair-rail / baseboard at floor
    ctx.fillStyle = c.trim;
    ctx.fillRect(x, y + TILE - 5, TILE, 4);
    ctx.fillStyle = c.trimDark;
    ctx.fillRect(x, y + TILE - 1, TILE, 1);
  }
}

/* Perimeter (sides + bottom): wooden room edge. */
function drawEdgeTile(ctx, x, y, c) {
  ctx.fillStyle = c.edge;
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = c.edgeLight;
  ctx.fillRect(x, y, TILE, 2);
  ctx.fillStyle = c.edgeDark;
  ctx.fillRect(x, y + TILE - 2, TILE, 2);
  ctx.fillRect(x + 7, y, 1, TILE);
}

/* ===================== ROOM THEMES ===================== */
const THEMES = {
  living: {
    floor: "#c89456", floorAlt: "#c08a4c", floorLight: "#d8a868",
    floorDark: "#9c6a34", floorGrain: "#a87a40",
    wall: "#e3c089", wallStripe: "#d8b078", wallDot: "#caa066",
    trim: "#8a5a2e", trimDark: "#6e4421",
    edge: "#7a4a22", edgeLight: "#9c6630", edgeDark: "#5c3414",
    rugPal: { a: "#c0533f", b: "#9c3f30", c: "#e8b86a", d: "#d98a4a", k: "#3a2a1a" },
  },
  study: {
    floor: "#b9854a", floorAlt: "#b07c42", floorLight: "#cb985a",
    floorDark: "#8a5e2e", floorGrain: "#9c6e38",
    wall: "#aec48a", wallStripe: "#9fb87a", wallDot: "#8fa86a",
    trim: "#7a5a2e", trimDark: "#5c4221",
    edge: "#6e5022", edgeLight: "#8c6a30", edgeDark: "#503914",
    rugPal: { a: "#3f6e8c", b: "#2d5469", c: "#a7d0e8", d: "#5a96b5", k: "#1a2a3a" },
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
        { id: "window", art: A.window, x: 8, y: 6, scale: 3, decor: true, solidRows: 0,
          clouds: { cx: 2, cy: 2, cw: 24, ch: 5 } },
        { id: "fireplace", art: A.fireplace, x: 104, y: 4, scale: 3, decor: true, solidRows: 1 },
        { id: "board", art: A.board, x: 184, y: 6, scale: 3, action: "cv",
          label: "Read CV & Achievements", solidRows: 1 },
        { id: "door", art: A.door, x: 300, y: 2, scale: 3, label: "Enter the Study",
          portal: { to: "study", spawn: { x: 54, y: 64, facing: "down" } }, solidRows: 1 },
        { id: "mailbox", art: A.mailbox, x: 312, y: 150, scale: 3, action: "contact",
          label: "Check the Mailbox", solidRows: 2 },
        { id: "plant", art: A.plant, x: 20, y: 150, scale: 3, decor: true, solidRows: 2,
          sway: { amp: 2, speed: 2.1 } },
        { id: "cat", cat: true, x: 128, y: 150, scale: 3, decor: true, solidRows: 0 },
      ],
    },
    study: {
      name: "Study",
      theme: THEMES.study,
      spawn: { x: 176, y: 176, facing: "down" },
      objects: [
        { id: "door", art: A.door, x: 24, y: 2, scale: 3, label: "Back to Living Room",
          portal: { to: "living", spawn: { x: 312, y: 64, facing: "down" } }, solidRows: 1 },
        { id: "desk", art: A.desk, x: 132, y: 6, scale: 3, action: "projects",
          label: "Browse Projects", solidRows: 1, screen: { cx: 12, cy: 2, cw: 8, ch: 4 } },
        { id: "window", art: A.window, x: 290, y: 6, scale: 3, decor: true, solidRows: 0,
          clouds: { cx: 2, cy: 2, cw: 24, ch: 5 } },
        { id: "shelf", art: A.shelf, x: 8, y: 150, scale: 3, decor: true, solidRows: 1 },
        { id: "arcade", art: A.arcade, x: 316, y: 128, scale: 3, action: "games",
          label: "Play: Game Dev Projects", solidRows: 2,
          pong: { cx: 2, cy: 4, cw: 12, ch: 6 } },
        { id: "plant", art: A.plant, x: 344, y: 62, scale: 3, decor: true, solidRows: 2,
          sway: { amp: 2, speed: 1.7 } },
      ],
    },
  };
}

function gridSize(grid) {
  let cols = 0;
  for (const row of grid) cols = Math.max(cols, row.length);
  return { cols, rows: grid.length };
}

function buildRoom(key) {
  const def = roomDefs()[key];
  const solid = [];
  for (let r = 0; r < ROWS; r++) {
    solid[r] = [];
    for (let c = 0; c < COLS; c++)
      solid[r][c] = r < 2 || c === 0 || c === COLS - 1 || r === ROWS - 1;
  }

  const objects = def.objects.map((d) => {
    let w, h;
    if (d.cat) { const g = gridSize(window.SPRITES.CAT[0]); w = g.cols * d.scale; h = g.rows * d.scale; }
    else { const g = gridSize(d.art.grid); w = g.cols * d.scale; h = g.rows * d.scale; }
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
      o.solidBox = { c0, c1, r0, r1 };   // for adjacency-based interaction
    }
    return o;
  });

  return { key, name: def.name, theme: def.theme, spawn: def.spawn, solid, objects };
}

/* Each object draws its art (optionally swaying) plus any animation layer. */
function makeDraw(d) {
  return function (ctx, t) {
    if (d.cat) { animCat(ctx, d, t); return; }
    const opts = d.sway ? { sway: { amp: d.sway.amp, speed: d.sway.speed, time: t } } : undefined;
    window.SPRITES.drawPixels(ctx, d.art.grid, d.art.pal, d.x, d.y, d.scale, opts);
    if (d.art.fire) animFire(ctx, d, t);
    if (d.screen) animScreen(ctx, d, t);
    if (d.pong) animPong(ctx, d, t);
    if (d.clouds) animClouds(ctx, d, t);
  };
}

function cellRect(o, c) {
  return { x: o.x + c.cx * o.scale, y: o.y + c.cy * o.scale, w: c.cw * o.scale, h: c.ch * o.scale };
}

/* ---- napping cat: slow tail flick + occasional blink ---- */
function animCat(ctx, o, t) {
  const S = window.SPRITES;
  const frame = Math.floor(t * 1.6) % 2;
  const blink = (t % 4) > 3.85;
  const pal = blink ? Object.assign({}, S.CAT_PAL, { e: S.CAT_PAL.c }) : S.CAT_PAL;
  // soft shadow
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.fillRect(o.x + 2 * o.scale, o.y + 10 * o.scale, 12 * o.scale, 3);
  S.drawPixels(ctx, S.CAT[frame], pal, o.x, o.y, o.scale);
}

/* ---- crackling fireplace flames ---- */
function animFire(ctx, o, t) {
  const r = cellRect(o, o.art.fire);
  ctx.save();
  ctx.beginPath(); ctx.rect(r.x, r.y, r.w, r.h); ctx.clip();
  // glowing log bed
  ctx.fillStyle = "#3a1d0c"; ctx.fillRect(r.x, r.y + r.h - 6, r.w, 6);
  const tongues = 5;
  const step = r.w / tongues;
  for (let i = 0; i < tongues; i++) {
    const cx = r.x + step * (i + 0.5);
    const base = r.y + r.h - 3;
    const flick = Math.sin(t * 9 + i * 1.7) * 0.5 + Math.sin(t * 14 + i) * 0.5;
    const hgt = r.h * (0.55 + 0.28 * flick);
    layer(ctx, cx, base, step * 0.9, hgt, "#d2431f");        // outer red
    layer(ctx, cx, base, step * 0.62, hgt * 0.78, "#f08a1e"); // orange
    layer(ctx, cx, base, step * 0.34, hgt * 0.5, "#ffd86a");  // yellow core
  }
  // floating embers
  ctx.fillStyle = "#ffd86a";
  for (let i = 0; i < 4; i++) {
    const ex = r.x + ((i * 37 + t * 13) % r.w);
    const ey = r.y + r.h - ((t * 22 + i * 30) % r.h);
    ctx.globalAlpha = 0.6;
    ctx.fillRect(ex, ey, 1, 1);
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}
function layer(ctx, cx, base, w, h, color) {
  ctx.fillStyle = color;
  const steps = Math.max(3, Math.round(h / 3));
  for (let s = 0; s < steps; s++) {
    const f = s / steps;
    const ww = w * (1 - f * 0.9);
    ctx.fillRect(Math.round(cx - ww / 2), Math.round(base - f * h), Math.max(1, Math.round(ww)), 3);
  }
}

/* ---- animated PC screen ---- */
function animScreen(ctx, o, t) {
  const r = cellRect(o, o.screen);
  ctx.save();
  ctx.beginPath(); ctx.rect(r.x, r.y, r.w, r.h); ctx.clip();
  ctx.fillStyle = "#0b2a3a"; ctx.fillRect(r.x, r.y, r.w, r.h);
  const lineH = 3, gap = 2, stp = lineH + gap;
  const scroll = (t * 14) % stp;
  const cols = ["#7ee3ff", "#41a6f6", "#ffd86a", "#5aa86a"];
  for (let yy = r.y - stp + scroll; yy < r.y + r.h; yy += stp) {
    const seed = Math.floor((yy - scroll) / stp) + 7;
    const indent = (seed % 3) * 4;
    const wd = 6 + ((seed * 7) % Math.max(6, r.w - indent - 6));
    ctx.fillStyle = cols[seed % cols.length];
    ctx.fillRect(r.x + 3 + indent, yy, Math.min(wd, r.w - 6 - indent), lineH);
  }
  if (Math.floor(t * 2) % 2 === 0) {
    ctx.fillStyle = "#a7f3ff";
    ctx.fillRect(r.x + 4, r.y + r.h - 6, 4, 4);
  }
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.fillRect(r.x, r.y + ((t * 40) % r.h), r.w, 2);
  ctx.restore();
}

/* ---- arcade screen: a tiny self-playing pong match ---- */
function animPong(ctx, o, t) {
  const r = cellRect(o, o.pong);
  const tri = (u) => Math.abs(((u % 1) + 1) % 1 - 0.5) * 2; // 0..1..0 wave
  ctx.save();
  ctx.beginPath(); ctx.rect(r.x, r.y, r.w, r.h); ctx.clip();
  ctx.fillStyle = "#1a1030"; ctx.fillRect(r.x, r.y, r.w, r.h);

  // dashed centre line
  ctx.fillStyle = "rgba(246,236,214,0.25)";
  for (let yy = r.y + 1; yy < r.y + r.h; yy += 5)
    ctx.fillRect(r.x + r.w / 2 - 0.5, yy, 1, 3);

  // ball bounces on two incommensurate triangle waves
  const bx = r.x + 2 + tri(t * 0.37) * (r.w - 6);
  const by = r.y + 1 + tri(t * 0.53) * (r.h - 4);
  ctx.fillStyle = "#ffd977";
  ctx.fillRect(bx, by, 2, 2);

  // paddles chase the ball (the right one lags a touch)
  const ph = 6;
  const clamp = (v) => Math.max(r.y + 1, Math.min(r.y + r.h - ph - 1, v));
  ctx.fillStyle = "#f6ecd6";
  ctx.fillRect(r.x + 1, clamp(by - ph / 2), 1.5, ph);
  const by2 = r.y + 1 + tri(t * 0.53 - 0.06) * (r.h - 4);
  ctx.fillRect(r.x + r.w - 2.5, clamp(by2 - ph / 2), 1.5, ph);
  ctx.restore();
}

/* ---- drifting window clouds ---- */
function animClouds(ctx, o, t) {
  const r = cellRect(o, o.clouds);
  ctx.save();
  ctx.beginPath(); ctx.rect(r.x, r.y, r.w, r.h); ctx.clip();
  ctx.fillStyle = "rgba(246,236,214,0.92)";
  const puffs = [{ w: 22, h: 7, y: 0.30, sp: 7, ph: 0 }, { w: 16, h: 6, y: 0.62, sp: 5, ph: 0.5 }];
  for (const p of puffs) {
    const span = r.w + p.w;
    const x = r.x - p.w + ((t * p.sp + p.ph * span) % span);
    const y = r.y + r.h * p.y;
    ctx.fillRect(x, y, p.w, p.h);
    ctx.fillRect(x + 5, y - 3, p.w - 10, 3);
  }
  ctx.restore();
}

/* Draw the static room (walls, floor, rug). */
function drawRoom(ctx, room) {
  const c = room.theme;
  for (let r = 0; r < ROWS; r++) {
    for (let col = 0; col < COLS; col++) {
      const x = col * TILE, y = r * TILE;
      if (r < 2) drawWallTile(ctx, x, y, c, r === 0);
      else if (col === 0 || col === COLS - 1 || r === ROWS - 1) drawEdgeTile(ctx, x, y, c);
      else drawFloorTile(ctx, x, y, c, col, r);
    }
  }
  window.SPRITES.drawPixels(ctx, window.SPRITES.ART.rug.grid, c.rugPal, 6 * TILE, 9 * TILE, 3);
}

window.WORLD = {
  TILE, COLS, ROWS,
  buildRoom, drawRoom,
  WIDTH: COLS * TILE, HEIGHT: ROWS * TILE,
};
