/* =========================================================================
 *  world.js  —  the room: tiles, walls, furniture, collision, triggers
 * ========================================================================= */

const TILE = 16;            // pixels per tile (before scaling)
const COLS = 24;            // room width in tiles
const ROWS = 16;            // room height in tiles

/* Floor (wood) and wall tiles are drawn procedurally per tile. */
function drawFloorTile(ctx, x, y) {
  ctx.fillStyle = "#7a5230";
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = "#6b4626";
  ctx.fillRect(x, y + TILE - 2, TILE, 2);          // plank seam
  ctx.fillStyle = "#86603a";
  ctx.fillRect(x + 2, y + 2, 3, 1);                // grain fleck
  ctx.fillRect(x + 9, y + 6, 4, 1);
}

function drawWallTile(ctx, x, y, baseboard) {
  ctx.fillStyle = "#3a4a63";
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = "#4a5d7e";
  ctx.fillRect(x, y, TILE, 3);
  if (baseboard) {
    ctx.fillStyle = "#2b3850";
    ctx.fillRect(x, y + TILE - 3, TILE, 3);
  }
}

/* The room is two wall rows at the top, walls on the sides, floor inside. */
function buildRoom() {
  const solid = [];
  for (let r = 0; r < ROWS; r++) {
    solid[r] = [];
    for (let c = 0; c < COLS; c++) {
      solid[r][c] = r < 2 || c === 0 || c === COLS - 1 || r === ROWS - 1;
    }
  }
  return solid;
}

/* grid dimensions in cells (rows may vary in length → use the widest) */
function gridSize(grid) {
  let cols = 0;
  for (const row of grid) cols = Math.max(cols, row.length);
  return { cols, rows: grid.length };
}

/* -------------------------------------------------------------------------
 *  Interactive + decorative objects. Positions/scale are in pixels; the
 *  collision footprint and the "stand here to interact" tile are derived
 *  from the rendered box, so art and logic can never drift apart.
 * ----------------------------------------------------------------------- */
function buildObjects(solid) {
  const A = window.SPRITES.ART;

  /* x,y = top-left in room pixels; scale = pixels per art cell.
   * solidRows: how many tile-rows up from the box bottom to block (so the
   * player can stand directly in front instead of inside the furniture). */
  const defs = [
    { id: "board",  art: A.board,  x: 92,  y: 6,   scale: 3, action: "cv",       label: "Read CV & Achievements", solidRows: 1 },
    { id: "desk",   art: A.desk,   x: 244, y: 6,   scale: 3, action: "projects", label: "Browse Projects",        solidRows: 1 },
    { id: "door",   art: A.door,   x: 180, y: 2,   scale: 3, action: "contact",  label: "Open Door (Contact)",    solidRows: 1 },
    { id: "window", art: A.window, x: 16,  y: 6,   scale: 3, decor: true,        solidRows: 0 },
    { id: "shelf",  art: A.shelf,  x: 8,   y: 150, scale: 3, decor: true,        solidRows: 1 },
    { id: "plant",  art: A.plant,  x: 340, y: 150, scale: 3, decor: true,        solidRows: 2 },
  ];

  const objects = defs.map((d) => {
    const { cols, rows } = gridSize(d.art.grid);
    const w = cols * d.scale, h = rows * d.scale;
    const o = {
      ...d,
      w, h,
      draw(ctx) { window.SPRITES.drawPixels(ctx, d.art.grid, d.art.pal, d.x, d.y, d.scale); },
    };

    // tile range covered by the box
    const c0 = Math.floor(d.x / TILE), c1 = Math.floor((d.x + w - 1) / TILE);
    const r1 = Math.floor((d.y + h - 1) / TILE);
    const r0 = Math.max(0, r1 - (d.solidRows ?? 1) + 1);

    for (let r = r0; r <= r1; r++)
      for (let c = c0; c <= c1; c++)
        if (solid[r] && solid[r][c] !== undefined) solid[r][c] = true;

    if (!d.decor) {
      // stand on the floor tile just below the centre of the box
      const cc = Math.floor((d.x + w / 2) / TILE);
      o.front = { c: cc, r: Math.min(ROWS - 2, r1 + 1) };
    }
    return o;
  });

  return objects;
}

/* Draw the static room (floor, rug, walls). */
function drawRoom(ctx) {
  const S = window.SPRITES;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = c * TILE, y = r * TILE;
      if (r < 2) drawWallTile(ctx, x, y, r === 1);
      else if (c === 0 || c === COLS - 1 || r === ROWS - 1) drawWallTile(ctx, x, y, false);
      else drawFloorTile(ctx, x, y);
    }
  }
  // rug centred on the floor (grid is 48 wide → scale 3 = 144px)
  S.drawPixels(ctx, S.ART.rug.grid, S.ART.rug.pal, 6 * TILE, 9 * TILE, 3);
}

window.WORLD = {
  TILE, COLS, ROWS,
  buildRoom, buildObjects, drawRoom,
  WIDTH: COLS * TILE, HEIGHT: ROWS * TILE,
};
