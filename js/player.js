/* =========================================================================
 *  player.js  —  the walking character
 * ========================================================================= */

function createPlayer() {
  const { TILE } = window.WORLD;
  return {
    x: 11 * TILE,        // pixel position (top-left of 16x16 sprite)
    y: 11 * TILE,
    speed: 1.1,          // pixels per frame
    facing: "down",
    moving: false,
    animTime: 0,         // accumulates while walking, drives 2-frame cycle

    /* Feet hitbox (smaller than the sprite) for nicer collision. */
    hitbox() {
      return { x: this.x + 3, y: this.y + 10, w: 10, h: 5 };
    },
  };
}

/* Axis-separated movement so the player slides along walls. */
function updatePlayer(p, input, solid) {
  const { TILE, COLS, ROWS } = window.WORLD;
  let dx = 0, dy = 0;
  if (input.left) dx -= 1;
  if (input.right) dx += 1;
  if (input.up) dy -= 1;
  if (input.down) dy += 1;

  p.moving = dx !== 0 || dy !== 0;

  if (dy < 0) p.facing = "up";
  else if (dy > 0) p.facing = "down";
  else if (dx < 0) p.facing = "left";
  else if (dx > 0) p.facing = "right";

  if (!p.moving) { p.animTime = 0; return; }

  // normalise diagonal so it isn't faster
  const len = Math.hypot(dx, dy) || 1;
  const vx = (dx / len) * p.speed;
  const vy = (dy / len) * p.speed;

  tryMove(p, vx, 0, solid, COLS, ROWS, TILE);
  tryMove(p, 0, vy, solid, COLS, ROWS, TILE);

  p.animTime += 1;
}

function tryMove(p, vx, vy, solid, COLS, ROWS, TILE) {
  p.x += vx; p.y += vy;
  const hb = p.hitbox();
  // sample the four corners of the hitbox
  const corners = [
    { x: hb.x, y: hb.y },
    { x: hb.x + hb.w, y: hb.y },
    { x: hb.x, y: hb.y + hb.h },
    { x: hb.x + hb.w, y: hb.y + hb.h },
  ];
  let blocked = false;
  for (const pt of corners) {
    const c = Math.floor(pt.x / TILE);
    const r = Math.floor(pt.y / TILE);
    if (r < 0 || c < 0 || r >= ROWS || c >= COLS || (solid[r] && solid[r][c])) {
      blocked = true; break;
    }
  }
  if (blocked) { p.x -= vx; p.y -= vy; }
}

function drawPlayer(ctx, p) {
  const S = window.SPRITES;
  const frame = p.moving ? Math.floor(p.animTime / 8) % 2 : 0;

  let key = p.facing;
  let mirror = false;
  if (key === "left") { key = "right"; mirror = true; }
  const grid = S.PLAYER[key][frame];

  // soft shadow under the feet
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(p.x + 3, p.y + 15, 10, 2);

  if (!mirror) {
    S.drawPixels(ctx, grid, S.PAL, p.x, p.y, 1);
  } else {
    // draw mirrored by flipping the canvas around the sprite centre
    ctx.save();
    ctx.translate(p.x + 16, p.y);
    ctx.scale(-1, 1);
    S.drawPixels(ctx, grid, S.PAL, 0, 0, 1);
    ctx.restore();
  }
}

/* Which interactive object (if any) is the player standing in front of? */
function nearbyObject(p, objects) {
  const { TILE } = window.WORLD;
  const fb = p.hitbox();
  const cx = fb.x + fb.w / 2, cy = fb.y + fb.h / 2;
  const c = Math.floor(cx / TILE), r = Math.floor(cy / TILE);
  for (const o of objects) {
    if (!o.front) continue;
    if (Math.abs(o.front.c - c) <= 1 && Math.abs(o.front.r - r) <= 1) return o;
  }
  return null;
}

window.PLAYER_API = { createPlayer, updatePlayer, drawPlayer, nearbyObject };
