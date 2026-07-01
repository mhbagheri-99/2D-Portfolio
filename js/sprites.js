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
 *  CAT  (16x11) — orange tabby curled up asleep, side view. The tail tip
 *  twitches between the two frames; the game adds an occasional blink.
 * ========================================================================= */
const CAT_PAL = {
  c: "#e0954a", C: "#c47a34", w: "#f6e9c9", n: "#d96a8a", e: "#3a2a1a", k: "#5a3a22",
};
const CAT = [
  [
    "....c....c......",
    "...cCc..cCc.....",
    "..cCCccccCCc....",
    ".cCccccccccCc...",
    ".ccccccccccccc..",
    "cce-cccccccccc..",
    "ccnccccccccccCc.",
    "cCcccccccccccCc.",
    "cCcccccccccccCCc",
    ".cCcccccccccCCC.",
    "..cCCcccccCCC...",
    "...cccCCCCCc....",
  ],
  [
    "....c....c......",
    "...cCc..cCc.....",
    "..cCCccccCCc....",
    ".cCccccccccCc...",
    ".ccccccccccccc..",
    "cce-cccccccccc..",
    "ccnccccccccccCc.",
    "cCccccccccccCCCc",
    "cCcccccccccCCcCc",
    ".cCccccccccCCcC.",
    "..cCCcccccCC c..",
    "...cccCCCCc.....",
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
      "fFccccctcccccccccccccrccccccccFf",
      "fFccppppppppppcccppppppppppcccFf",
      "fFccppppppppppcccppppppppppcccFf",
      "fFccppppppppppcccppppppppppcccFf",
      "fFccppppppppppcccppppppppppcccFf",
      "fFccppppppppppcccppppppppppcccFf",
      "fFccccccccccccccccccccccccccccFf",
      "fFcccgccccccccccccccccrcccccccFf",
      "fFccppppppppppcccppppppppppcccFf",
      "fFccppppppppppcccppppppppppcccFf",
      "fFccppppppppppcccppppppppppcccFf",
      "fFccppppppppppcccppppppppppcccFf",
      "fFccppppppppppcccppppppppppcccFf",
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
      "..........mMgGggggGgMm..........",
      "..........mMggggggggMm..........",
      "..........mMggggggggMm..........",
      "..........mMMMMMMMMMMm..........",
      "..............mmmm..............",
      "...........mmmmmmmmmm...........",
      "dddddddddddddddddddddddddddddddd",
      "DddddddddddddddddddddddddddddddD",
      "DDwwwwwwwwwwww...tTt..........DD",
      "DD..........................DD..",
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
      "sSsSsSsSsSsSsSsSsSsSsS",
      "sssbbbbbbbbbbbbbbbbsss",
      "sssbddddddddddddddbsss",
      "sssbddddddddddddddbsss",
      "sssbddddddddddddddbsss",
      "sssbddddddddddddddbsss",
      "sssbddddddddddddddbsss",
      "sSsbddddddddddddddbsSs",
      "sssbggggggggggggggbsss",
      "sssbbbbbbbbbbbbbbbbsss",
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

  /* Door (room portal) — tall plank door with two panels and a brass knob */
  door: {
    pal: {
      f: "#9c6630", F: "#7a4a22", d: "#b5814a", p: "#a06a36", P: "#7a4a22",
      h: "#ffd977", H: "#c98a2a", k: "#3a2a1a",
    },
    grid: [
      ".ffffffffffffff.",
      "fFFFFFFFFFFFFFFf",
      "fFddddddddddddFf",
      "fFdPPPPPPPPPPdFf",
      "fFdPppppppppPdFf",
      "fFdPppppppppPdFf",
      "fFdPppppppppPdFf",
      "fFdPPPPPPPPPPdFf",
      "fFddddddddddddFf",
      "fFddddddddhHddFf",
      "fFddddddddhHddFf",
      "fFddddddddddddFf",
      "fFdPPPPPPPPPPdFf",
      "fFdPppppppppPdFf",
      "fFdPppppppppPdFf",
      "fFdPppppppppPdFf",
      "fFdPPPPPPPPPPdFf",
      "fFddddddddddddFf",
      "fFFFFFFFFFFFFFFf",
      ".ffffffffffffff.",
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
      "fFabcdeabcdeabcdeabcdeFf",
      "fFabcdeabcdeabcdeabcdeFf",
      "ffffffffffffffffffffffff",
      "fFedcbaedcbaedcbaedcbaFf",
      "fFedcbaedcbaedcbaedcbaFf",
      "ffffffffffffffffffffffff",
      "fFcdeabcdeabcdeabcdeabFf",
      "fFcdeabcdeabcdeabcdeabFf",
      "ffffffffffffffffffffffff",
    ],
  },

  /* Arcade cabinet (game-dev projects). Screen animated by world.js. */
  arcade: {
    pal: {
      c: "#7a4aa0", C: "#5c3680", m: "#ffd977", M: "#c98a2a",
      s: "#1a1030", j: "#3a2a1a", r: "#e06a5a", g: "#5aa86a", k: "#3a2a1a",
    },
    grid: [
      ".cccccccccccccc.",
      "cCmmmmmmmmmmmmCc",
      "cCmMmMmMmMmMmMCc",
      "cccccccccccccccc",
      "cCssssssssssssCc",
      "cCssssssssssssCc",
      "cCssssssssssssCc",
      "cCssssssssssssCc",
      "cCssssssssssssCc",
      "cCssssssssssssCc",
      "cccccccccccccccc",
      "cCCCCCCCCCCCCCCc",
      "cCcjccrrcggcccCc",
      "cccccccccccccccc",
      "cCccccccccccccCc",
      "cCccccccccccccCc",
      "cCccccccccccccCc",
      "cccccccccccccccc",
      ".cc..........cc.",
      ".cc..........cc.",
    ],
  },

  /* Patterned rug (border + centred diamond) */
  rug: {
    pal: { a: "#c0533f", b: "#9c3f30", c: "#e8b86a", d: "#d98a4a", k: "#3a2a1a" },
    grid: [
      "a".repeat(48),
      "a" + "b".repeat(46) + "a",
      "ab" + "c".repeat(44) + "ba",
      "abcc" + "d".repeat(40) + "ccba",
      "abcc" + "d".repeat(19) + "cc" + "d".repeat(19) + "ccba",
      "abcc" + "d".repeat(18) + "cccc" + "d".repeat(18) + "ccba",
      "abcc" + "d".repeat(17) + "cccccc" + "d".repeat(17) + "ccba",
      "abcc" + "d".repeat(18) + "cccc" + "d".repeat(18) + "ccba",
      "abcc" + "d".repeat(19) + "cc" + "d".repeat(19) + "ccba",
      "abcc" + "d".repeat(40) + "ccba",
      "ab" + "c".repeat(44) + "ba",
      "a" + "b".repeat(46) + "a",
      "a".repeat(48),
    ],
  },
};

window.SPRITES = { drawPixels, PAL, PLAYER, CAT, CAT_PAL, ART, WOOD };
