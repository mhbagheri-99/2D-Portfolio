/* =========================================================================
 *  sprites.js  —  programmatic 8-bit pixel art
 * =========================================================================
 *  Art is defined as arrays of strings ("pixel grids"). Each character maps
 *  to a colour in a palette. "." or " " means transparent. This is how we
 *  "generate everything ourselves" with zero image assets.
 * ========================================================================= */

/* Draw a pixel grid at (x, y) in world pixels. `scale` is pixels-per-cell. */
function drawPixels(ctx, grid, palette, x, y, scale = 1) {
  for (let r = 0; r < grid.length; r++) {
    const row = grid[r];
    for (let c = 0; c < row.length; c++) {
      const ch = row[c];
      if (ch === "." || ch === " ") continue;
      const color = palette[ch];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(x + c * scale, y + r * scale, scale, scale);
    }
  }
}

/* ---- Shared 8-bit-ish palette (NES/PICO-8 flavoured) ---- */
const PAL = {
  k: "#1a1c2c", // outline / near-black
  d: "#333c57", // dark shadow blue
  s: "#ffcd75", // skin
  S: "#ef7d57", // skin shadow
  h: "#a05b53", // hair (brown)
  H: "#8b4a44", // hair shadow
  b: "#41a6f6", // shirt blue
  B: "#3b5dc9", // shirt shadow
  p: "#566c86", // pants
  P: "#3b4a63", // pants shadow
  o: "#422433", // shoes
  w: "#f4f4f4", // white
  e: "#1a1c2c", // eyes
};

/* =========================================================================
 *  PLAYER CHARACTER  (16x16) — 4 facings, 2 walk frames each.
 *  Left is the mirror of right (handled at draw time).
 * ========================================================================= */
const PLAYER = {
  down: [
    [
      "................",
      "....hhhhhhhh....",
      "...hhhhhhhhhh...",
      "..hHhhhhhhhhHh..",
      "..hsssssssssh...",
      "..hseskkseshh...",
      "..hssssssssh....",
      "..hsSsssSsSh....",
      "...hssⁿⁿssh.....".replace(/ⁿ/g, "k"),
      "....bbbbbbbb....",
      "...bBbbbbbbBb...",
      "...bbbssssbbb...",
      "...bb ssss bb...",
      "....pppppppp....",
      "....pp....pp....",
      "....oo....oo....",
    ],
    [
      "................",
      "....hhhhhhhh....",
      "...hhhhhhhhhh...",
      "..hHhhhhhhhhHh..",
      "..hsssssssssh...",
      "..hseskkseshh...",
      "..hssssssssh....",
      "..hsSsssSsSh....",
      "...hsskkssh.....",
      "....bbbbbbbb....",
      "...bBbbbbbbBb...",
      "...bbbssssbbb...",
      "...bb ssss bb...",
      "....pppppppp....",
      "...pp......pp...",
      "...oo......oo...",
    ],
  ],
  up: [
    [
      "................",
      "....hhhhhhhh....",
      "...hhhhhhhhhh...",
      "..hHhhhhhhhhHh..",
      "..hhhhhhhhhhh...",
      "..hhhhhhhhhhh...",
      "..hhhhhhhhhh....",
      "..hhhhhhhhhh....",
      "...hhhhhhhh.....",
      "....bbbbbbbb....",
      "...bBbbbbbbBb...",
      "...bbbbbbbbbb...",
      "...bb bbbb bb...",
      "....pppppppp....",
      "....pp....pp....",
      "....oo....oo....",
    ],
    [
      "................",
      "....hhhhhhhh....",
      "...hhhhhhhhhh...",
      "..hHhhhhhhhhHh..",
      "..hhhhhhhhhhh...",
      "..hhhhhhhhhhh...",
      "..hhhhhhhhhh....",
      "..hhhhhhhhhh....",
      "...hhhhhhhh.....",
      "....bbbbbbbb....",
      "...bBbbbbbbBb...",
      "...bbbbbbbbbb...",
      "...bb bbbb bb...",
      "....pppppppp....",
      "...pp......pp...",
      "...oo......oo...",
    ],
  ],
  right: [
    [
      "................",
      "....hhhhhhh.....",
      "...hhhhhhhhh....",
      "..hHhhhhhhhh....",
      "..hssssshhh.....",
      "..hsseskhh......",
      "..hsssssh.......",
      "..hsSssSh.......",
      "...hsssh........",
      "....bbbbb.......",
      "...bBbbbbb......",
      "...bbbbssss.....",
      "...bb bssss.....",
      "....pppp........",
      "....pppp........",
      "....ooo.........",
    ],
    [
      "................",
      "....hhhhhhh.....",
      "...hhhhhhhhh....",
      "..hHhhhhhhhh....",
      "..hssssshhh.....",
      "..hsseskhh......",
      "..hsssssh.......",
      "..hsSssSh.......",
      "...hsssh........",
      "....bbbbb.......",
      "...bBbbbbb......",
      "...bbbbssss.....",
      "...bb bssss.....",
      ".....ppp........",
      "....pppp........",
      "...ooo..........",
    ],
  ],
};

/* =========================================================================
 *  FURNITURE & DECOR  — bigger grids, drawn once into the room.
 * ========================================================================= */

const ART = {
  /* Bulletin board (CV + achievements). 32 wide x 26 tall cells. */
  board: {
    pal: {
      f: "#8b5a2b", // frame
      F: "#6b4421", // frame shadow
      c: "#d9c39a", // cork
      C: "#c4ad84", // cork shadow
      p: "#f4f4f4", // paper
      t: "#41a6f6", // pin blue
      r: "#ef5253", // pin red
      g: "#38b764", // pin green
      k: "#1a1c2c",
    },
    grid: [
      "ffffffffffffffffffffffffffffffff",
      "fFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFf",
      "fFccccccccccccccccccccccccccccFf",
      "fFcccccrcccccccccccctccccccccCFf",
      "fFccppppppppccccppppppppppcccCFf",
      "fFccppppppppccccppppppppppcccCFf",
      "fFccppppppppccccppppppppppcccCFf",
      "fFccppppppppccccppppppppppcccCFf",
      "fFccppppppppccccppppppppppcccCFf",
      "fFcccccccccccccccccccccccccccCFf",
      "fFccgccccccccccccccccccrccccCFf.",
      "fFcccpppppppppppppppppppppccCFf.",
      "fFcccpppppppppppppppppppppccCFf.",
      "fFcccpppppppppppppppppppppccCFf.",
      "fFcccpppppppppppppppppppppccCFf.",
      "fFcccpppppppppppppppppppppccCFf.",
      "fFcccccccccccccccccccccccccccCFf",
      "fFccccccccccccccccccccccccccccFf",
      "fFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFf",
      "ffffffffffffffffffffffffffffffff",
    ],
  },

  /* Desk + PC monitor (projects). 34 wide. */
  desk: {
    pal: {
      d: "#8b5a2b", // desk top
      D: "#6b4421", // desk shadow / legs
      m: "#1a1c2c", // monitor bezel
      M: "#333c57", // bezel light
      g: "#41a6f6", // screen glow
      G: "#a7f3ff", // screen highlight
      t: "#566c86", // tower
      T: "#3b4a63",
      w: "#f4f4f4", // keyboard
      k: "#1a1c2c",
    },
    grid: [
      "..........mmmmmmmmmmmm..........",
      "..........mMMMMMMMMMMm..........",
      "..........mMggggggggMm..........",
      "..........mMgGgggggGgMm.........".slice(0, 32),
      "..........mMggggggggMm..........",
      "..........mMggggggggMm..........",
      "..........mMMMMMMMMMMm..........",
      "............mm....mm............",
      "...........mmmmmmmmmm...........",
      "dddddddddddddddddddddddddddddddd",
      "DdddddddddddddddddddddddddddddDD",
      "Dwwwwwwwwwwww...tttt.........ⁿDD".replace(/ⁿ/g, "D"),
      "Dwwwwwwwwwwww...tTtt.........⁰DD".replace(/⁰/g, "D"),
      "DD............ⁿtttt.........DD..".replace(/ⁿ/g, "."),
      "DD.........................DD...",
      "DD.........................DD...",
    ],
  },

  /* Potted plant. 12 wide. */
  plant: {
    pal: { g: "#38b764", G: "#257179", p: "#c44b3a", P: "#8b3527", k: "#1a1c2c" },
    grid: [
      "...gg..gg...",
      "..gGggggGg..",
      ".gggGggggGg.",
      "gggggGgggggg",
      ".gggggggGgg.",
      "..ggGgggg g.",
      "...gg gg....",
      "....pppp....",
      "...pppppp...",
      "...pPPPPp...",
      "...pppppp...",
      "....pPPp....",
    ],
  },

  /* Window with sky + sun. 28 wide. */
  window: {
    pal: {
      f: "#8b5a2b", F: "#6b4421", s: "#41a6f6", S: "#73c2ff",
      y: "#ffcd75", c: "#f4f4f4", k: "#1a1c2c",
    },
    grid: [
      "ffffffffffffffffffffffffffff",
      "fFFFFFFFFFFFFFFFFFFFFFFFFFFf",
      "fFssssssssssssssssssssssssFf",
      "fFsssssyysssssssssccccsssSFf",
      "fFssssyyyysscccsssccccssSSFf",
      "fFsssssyysssccccccsssssSSSFf",
      "fFsssssssssssssssssssSSSSSFf",
      "fFFFFFFFFFFFFFFFFFFFFFFFFFFf",
      "ffffffffffffffffffffffffffff",
    ],
  },

  /* Door (contact). 16 wide. */
  door: {
    pal: { f: "#8b5a2b", F: "#6b4421", d: "#a06a36", h: "#ffcd75", k: "#1a1c2c" },
    grid: [
      "ffffffffffffffff",
      "fFFFFFFFFFFFFFFf",
      "fFddddddddddddFf",
      "fFddddddddddddFf",
      "fFdddddddddhdFf.",
      "fFddddddddddddFf",
      "fFddddddddddddFf",
      "fFddddddddddddFf",
      "fFddddddddddddFf",
      "fFddddddddddddFf",
      "fFddddddddddddFf",
      "fFddddddddddddFf",
      "fFFFFFFFFFFFFFFf",
    ],
  },

  /* Bookshelf. 24 wide. */
  shelf: {
    pal: {
      f: "#6b4421", F: "#4a2f17",
      a: "#ef5253", b: "#41a6f6", c: "#38b764", d: "#ffcd75", e: "#a05b53",
      k: "#1a1c2c",
    },
    grid: [
      "ffffffffffffffffffffffff",
      "fFabcdabceabcdabcdeabcaFf".slice(0, 24),
      "fFabcdabceabcdabcdeabcaFf".slice(0, 24),
      "ffffffffffffffffffffffff",
      "fFdcbaedcbaedcbaedcbaedFf".slice(0, 24),
      "fFdcbaedcbaedcbaedcbaedFf".slice(0, 24),
      "ffffffffffffffffffffffff",
      "fFbceadbceadbceadbceadbFf".slice(0, 24),
      "fFbceadbceadbceadbceadbFf".slice(0, 24),
      "ffffffffffffffffffffffff",
    ],
  },

  /* Rug (drawn on the floor). 48 wide. */
  rug: {
    pal: { a: "#ef5253", b: "#c43a3a", c: "#ffcd75", k: "#1a1c2c" },
    grid: [
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "abbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbba",
      "abcccccccccccccccccccccccccccccccccccccccccccba",
      "abccaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaccccba".slice(0, 48),
      "abccaccccccccccccccccccccccccccccccccccccacccba".slice(0, 48),
      "abccacccccccccccccccccccccccccccccccccccacccccba".slice(0, 48),
      "abccacccccccccccccccccccccccccccccccccccacccccba".slice(0, 48),
      "abccaccccccccccccccccccccccccccccccccccccacccba".slice(0, 48),
      "abccaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaccccba".slice(0, 48),
      "abcccccccccccccccccccccccccccccccccccccccccccba",
      "abbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbba",
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    ],
  },
};

window.SPRITES = { drawPixels, PAL, PLAYER, ART };
