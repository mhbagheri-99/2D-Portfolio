# 🕹️ Mohammad H. Bagheri — Pixel Portfolio

A **2D, cosy pixel-art portfolio** you explore like a retro farming game.
Walk around a warm little **house** — past a crackling fireplace and a napping
cat — move between rooms through a door, and step up to objects to reveal the
CV, achievements, web projects, and games. Soft lighting, animated scenery,
and generated chiptune music throughout.

Everything is **generated in code** — the room, furniture, and character are
all drawn from pixel grids. There are **no image assets and no build step or
dependencies**. Just plain HTML, CSS, and vanilla JavaScript.

| Room | Object | Walk up + press **E** | Shows |
| --- | --- | --- | --- |
| Living Room | 📌 Bulletin board | `cv` | Summary, experience, skills, education, languages, achievements |
| Living Room | 📮 Mailbox | `contact` | Email, location + social links |
| Living Room | 🚪 Door | — | Walk into the **Study** |
| Study | 🖥️ PC / desk | `projects` | Open-source, web & academic projects |
| Study | 🕹️ Arcade cabinet | `games` | UE5 / Unity game-dev projects (it plays pong by itself!) |
| Study | 🚪 Door | — | Walk back to the **Living Room** |

## ▶ Run it

Any static server works. Two easy options:

```bash
node serve.js                 # → http://localhost:8080
# or
python3 -m http.server 8080   # → http://localhost:8080
```

Then open the printed URL in a browser.

## 🎮 Controls

- **Move:** Arrow keys or **WASD**
- **Interact / use a door:** **E** (or Enter / Space) when the prompt appears
- **Close a panel:** **Esc**
- **Toggle sound:** **M** (or the 🔊 button, top-right)
- **Touch / mouse:** on-screen D-pad and **E** button (handy on phones)

## ✏️ Updating the content

Open **`js/content.js`** — that single file holds the name, bio, skill groups,
experience, education, languages, achievements, projects (grouped into
`oss` / `web` / `academic` for the PC and `game` for the arcade machine), and
contact links. Just change the words inside the quotes; add or remove list
items freely. Project `link`s currently point at the GitHub profile — swap in
the exact repo URLs whenever you like.

## 📁 Project structure

```
index.html          page shell + on-screen controls
css/style.css       8-bit UI styling (title screen, panels, controls)
js/
  content.js        ← YOUR portfolio data (edit this)
  audio.js          synthesised chiptune music + sound effects
  sprites.js        pixel-art definitions + draw helper (with sway)
  world.js          rooms, tiles, furniture, collision, object animation
  player.js         movement, collision, walk + idle animation
  interactions.js   builds the CV / projects / contact panels
  game.js           input, scaling, room transitions, render loop, audio
serve.js            optional zero-dependency local server
```

### Adding or changing rooms

Rooms live in `roomDefs()` inside `js/world.js`. Each room lists its objects
(`x`, `y`, `scale`, plus `action`, `portal`, or `decor`). A 🚪 door is just an
object with a `portal: { to, spawn }` pointing at another room.

## 🗺️ Notes & roadmap

**Phase 1 (done):** explorable room, four-direction movement with a light
two-frame walk animation, collision, interactive stations, retro content
panels, and touch controls.

**Phase 2 (done):**
- A two-room **house** (Living Room + Study) with door transitions and a fade
- **Animated scenery:** drifting window clouds, an animated PC screen
  (scrolling "code" + blinking cursor), a swaying plant, floating dust motes,
  and character idle-breathing
- **Generated chiptune** background music + sound effects (footsteps, open /
  close, door, wall bump) with a persistent mute toggle

**Phase 3 — cosy "Stardew Valley" makeover (done):**
- Warm honey-wood **plank floors** and **wallpapered walls** with crown
  moulding and a wood baseboard, per-room themes
- **Cosy lighting:** soft sunbeams from the windows, a flickering fireplace
  glow, and a gentle vignette
- A **fireplace** with animated flames and a **napping cat** (tail flick +
  blinks) on the rug
- A friendlier farmer-style character and warmer furniture + UI palette

Ideas for later phases:
- More rooms / a second floor
- A pet that follows you around
- A minimap or quest-style hints
- Save the visitor's last room in `localStorage`
