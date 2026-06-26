/* =========================================================================
 *  sprites.js  —  programmatic pixel art (warm, Stardew-flavoured)
 * =========================================================================
 *  Art is defined as arrays of strings ("pixel grids"). Each character maps
 *  to a colour in a palette. "." or " " means transparent. Zero image assets.
 * ========================================================================= */

/* Draw a pixel grid at (x, y) in world pixels. `scale` is pixels-per-cell.
 * opts.sway = { amp, speed, time } gently shifts upper rows sideways so
 * things like plants appear to wave in a breeze. */
function drawPixels(ctx, grid, palette, x, y, scale = 1, opts) {
  const sway = opts && opts.sway;
  const rows = grid.length;
  for (let r = 0; r < rows; r++) {
    const row = grid[r];
    let off = 0;
    if (sway) {
      const lean = (rows - r) / rows;
      off = Math.round(Math.sin(sway.time * sway.speed) * sway.amp * lean);
    }
    for (let c = 0; c < row.length; c++) {
      const ch = row[c];
      if (ch === "." || ch === " ") continue;
      const color = palette[ch];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(x + c * scale + off, y + r * scale, scale, scale);
    }
  }
}

/* ---- Player palette: cosy farmer (warm skin, brown hair, denim) ---- */
const PAL = {
  k: "#3a2a1a", // warm outline
  s: "#f4c08a", // skin
  S: "#d99a64", // skin shadow
  h: "#7a4a22", // hair
  H: "#5c3414", // hair shadow
  b: "#3f8f5a", // shirt (green)
  B: "#2f6b42", // shirt shadow
  p: "#3f6193", // overalls (denim)
  P: "#2d4870", // overalls shadow
  w: "#f6e9c9", // collar / buttons
  o: "#5a3a22", // shoes
  e: "#3a2a1a", // eyes
};

/* =========================================================================
 *  PLAYER  (16x16) — facings down/up/right (left = mirror of right),
 *  two walk frames each.
 * ========================================================================= */
const PLAYER = {
  down: [
    [
      "....hhhhhhhh....",
      "...hhhhhhhhhh...",
      "..hhhhhhhhhhhh..",
      "..hhssssssshhh..",
      "..hsssssssssh...",
      "..hsesssssesh...",
      "..hsssssssssh...",
      "...Sssssssss....",
      "...wpbbbbpw.....",
      "..ppbbbbbbpp....",
      "..pbwbbbbwbp....",
      "..pbbbbbbbbp....",
      "...pp....pp.....",
      "...pp....pp.....",
      "...oo....oo.....",
      "...oo....oo.....",
    ],
    [
      "....hhhhhhhh....",
      "...hhhhhhhhhh...",
      "..hhhhhhhhhhhh..",
      "..hhssssssshhh..",
      "..hsssssssssh...",
      "..hsesssssesh...",
      "..hsssssssssh...",
      "...Sssssssss....",
      "...wpbbbbpw.....",
      "..ppbbbbbbpp....",
      "..pbwbbbbwbp....",
      "..pbbbbbbbbp....",
      "....pp..pp......",
      "...pp....pp.....",
      "...oo....oo.....",
      "..oo......oo....",
    ],
  ],
  up: [
    [
      "....hhhhhhhh....",
      "...hhhhhhhhhh...",
      "..hhhhhhhhhhhh..",
      "..hhhhhhhhhhhh..",
      "..hhhhhhhhhhh...",
      "..hhhhhhhhhhh...",
      "..hhhhhhhhhh....",
      "...hhhhhhhh.....",
      "...ppbbbbpp.....",
      "..ppbbbbbbpp....",
      "..pbbbbbbbbp....",
      "..pbbbbbbbbp....",
      "...pp....pp.....",
      "...pp....pp.....",
      "...oo....oo.....",
      "...oo....oo.....",
    ],
    [
      "....hhhhhhhh....",
      "...hhhhhhhhhh...",
      "..hhhhhhhhhhhh..",
      "..hhhhhhhhhhhh..",
      "..hhhhhhhhhhh...",
      "..hhhhhhhhhhh...",
      "..hhhhhhhhhh....",
      "...hhhhhhhh.....",
      "...ppbbbbpp.....",
      "..ppbbbbbbpp....",
      "..pbbbbbbbbp....",
      "..pbbbbbbbbp....",
      "....pp..pp......",
      "...pp....pp.....",
      "...oo....oo.....",
      "..oo......oo....",
    ],
  ],
  right: [
    [
      "....hhhhhhh.....",
      "...hhhhhhhhh....",
      "..hhhhhhhhhh....",
      "..hhsssssshh....",
      "..hssssssshh....",
      "..hsessssh......",
      "..hssssssh......",
      "...Sssssss......",
      "...wpbbbbp......",
      "..ppbbbbbbp.....",
      "..pbbbbbbbsp....",
      "..pbbbbbbbp.....",
      "...ppp.pp.......",
      "...pp..pp.......",
      "...oo..oo.......",
      "...oo..oo.......",
    ],
    [
      "....hhhhhhh.....",
      "...hhhhhhhhh....",
      "..hhhhhhhhhh....",
      "..hhsssssshh....",
      "..hssssssshh....",
      "..hsessssh......",
      "..hssssssh......",
      "...Sssssss......",
      "...wpbbbbp......",
      "..ppbbbbbbp.....",
      "..pbbbbbbbsp....",
      "..pbbbbbbbp.....",
      "....pp.ppp......",
      "...pp..pp.......",
      "..oo...oo.......",
      "..oo....oo......",
    ],
  ],
};

/* =========================================================================
 *  CAT  (12x10) — orange tabby napping on the rug. Two tail frames; the
 *  game adds an occasional blink on top.
 * ========================================================================= */
const CAT_PAL = {
  c: "#e0954a", C: "#b56f30", w: "#f6e9c9", p: "#d96a8a", e: "#3a2a1a", k: "#5a3a22",
};
const CAT = [
  [
    ".cc....cc...",
    ".cCc..cCc...",
    ".cccccccc...",
    ".cececec c..",
    ".ccccpccc...",
    ".cwwwwwwc.t.",
    ".cwwwwwwct t",
    "..cwwwwc..t.",
    "..cccccc....",
    "............",
  ],
  [
    ".cc....cc...",
    ".cCc..cCc...",
    ".cccccccc...",
    ".cececec c..",
    ".ccccpccc...",
    ".cwwwwwwc...",
    ".cwwwwwwc.t.",
    "..cwwwwc.tt.",
    "..cccccc.t..",
    "............",
  ],
];

/* =========================================================================
 *  FURNITURE & DECOR  (warm palettes)
 * ========================================================================= */
const WOOD = { f: "#9c6630", F: "#7a4a22", M: "#5c3414" };

const ART = {
  /* Bulletin board (CV + achievements) */
  board: {
    pal: {
      f: "#9c6630", F: "#7a4a22", c: "#caa873", C: "#b08f5a",
      p: "#f6ecd6", t: "#4a90d6", r: "#e06a5a", g: "#5aa86a", k: "#3a2a1a",
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

  /* Desk + PC monitor (projects). Screen is animated by world.js. */
  desk: {
    pal: {
      d: "#9c6630", D: "#7a4a22", m: "#2b2233", M: "#473a52",
      g: "#3aa0d8", G: "#a7f3ff", t: "#6a7a8c", T: "#46566a",
      w: "#e9e2d0", k: "#3a2a1a",
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

  /* Fireplace (animated flames drawn by world.js into `fire` region) */
  fireplace: {
    fire: { cx: 4, cy: 5, cw: 14, ch: 7 },
    pal: {
      m: "#9c6630", M: "#7a4a22", s: "#a89a8c", S: "#867a6e",
      b: "#a8553a", B: "#7d3a26", d: "#160d06", g: "#4a4038", k: "#3a2a1a",
    },
    grid: [
      "mmmmmmmmmmmmmmmmmmmmmm",
      "MMMMMMMMMMMMMMMMMMMMMM",
      "ssssssssssssssssssssss",
      "sSssSssSssSssSssSssSss",
      "ss bbbbbbbbbbbbbbbb ss",
      "ss bdddddddddddddb ss.",
      "ss bdddddddddddddb ss.",
      "ss bdddddddddddddb ss.",
      "ss bdddddddddddddb ss.",
      "ss bdddddddddddddb ss.",
      "sS bdddddddddddddb Ss.",
      "ss bgggggggggggggb ss.",
      "ss bbbbbbbbbbbbbbbb ss",
      "ssssssssssssssssssssss",
      "SSSSSSSSSSSSSSSSSSSSSS",
    ],
  },

  /* Window with sky + sun (clouds animated by world.js) */
  window: {
    pal: {
      f: "#9c6630", F: "#7a4a22", s: "#7fc6f0", S: "#5aa8df",
      y: "#ffd977", c: "#f6ecd6", t: "#c98a4a", k: "#3a2a1a",
    },
    grid: [
      "ffffffffffffffffffffffffffff",
      "fFFFFFFFFFFFFFFFFFFFFFFFFFFf",
      "fFssssssssssssssssssssssssFf",
      "fFssssyyyssssssssssssssssSFf",
      "fFsssyyyyysssssssssssssSSSFf",
      "fFssssyyysssssssssssSSSSSSFf",
      "fFssssssssssssssSSSSSSSSSSFf",
      "fFFFFFFFFFFFFFFFFFFFFFFFFFFf",
      "fttttttttttttttttttttttttttf",
    ],
  },

  /* Mailbox (contact) */
  mailbox: {
    pal: { r: "#e06a5a", R: "#b5443a", w: "#f6ecd6", p: "#9c6630", P: "#7a4a22", k: "#3a2a1a" },
    grid: [
      "...rrrrrr...",
      "..rRRRRRRRr.",
      ".rRrrrrrrRRr",
      ".RrwwwwwwrRR",
      ".RrwwwwwwrRR",
      ".rRrrrrrrRRr",
      "..rRRRRRRRr.",
      "....pPPp....",
      "....pPPp....",
      "....pPPp....",
      "....pPPp....",
      "...pPPPPp...",
    ],
  },

  /* Door (room portal) */
  door: {
    pal: { f: "#9c6630", F: "#7a4a22", d: "#b5814a", D: "#8a5e34", h: "#ffd977", k: "#3a2a1a" },
    grid: [
      "ffffffffffffffff",
      "fFFFFFFFFFFFFFFf",
      "fFddddddddddddFf",
      "fFdDDDDddDDDDdFf",
      "fFdDddddddddDhFf",
      "fFdDddddddddDdFf",
      "fFdDDDDddDDDDdFf",
      "fFddddddddddddFf",
      "fFdDDDDddDDDDdFf",
      "fFdDddddddddDdFf",
      "fFdDddddddddDdFf",
      "fFdDDDDddDDDDdFf",
      "fFFFFFFFFFFFFFFf",
    ],
  },

  /* Potted plant */
  plant: {
    pal: { g: "#4aa85a", G: "#2f7d42", p: "#c46a3a", P: "#9c4f29", k: "#3a2a1a" },
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

  /* Bookshelf */
  shelf: {
    pal: {
      f: "#7a4a22", F: "#5c3414",
      a: "#e06a5a", b: "#4a90d6", c: "#5aa86a", d: "#ffd977", e: "#a86ad0",
      k: "#3a2a1a",
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

  /* Patterned rug (Stardew-ish: border + diamond centre) */
  rug: {
    pal: { a: "#c0533f", b: "#9c3f30", c: "#e8b86a", d: "#d98a4a", k: "#3a2a1a" },
    grid: [
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "abbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbba",
      "abccccccccccccccccccccccccccccccccccccccccccccba",
      "abccdddddddddddddddddddddddddddddddddddddddccccba".slice(0, 48),
      "abccddddddddddddddddaaddddddddddddddddddddcccccba".slice(0, 48),
      "abccdddddddddddddddaccaddddddddddddddddddcccccba".slice(0, 48),
      "abccdddddddddddddddaccaddddddddddddddddddcccccba".slice(0, 48),
      "abccddddddddddddddddaaddddddddddddddddddddcccccba".slice(0, 48),
      "abccdddddddddddddddddddddddddddddddddddddddccccba".slice(0, 48),
      "abccccccccccccccccccccccccccccccccccccccccccccba",
      "abbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbba",
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    ],
  },
};

window.SPRITES = { drawPixels, PAL, PLAYER, CAT, CAT_PAL, ART, WOOD };
