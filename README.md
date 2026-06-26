# 🕹️ 8-bit Portfolio

A tiny **2D, 8-bit style portfolio** you explore like a retro game. Walk your
character around a pixel-art **house**, move between rooms through a door, and
step up to objects to reveal your CV, achievements, and projects — with
animated scenery and generated chiptune music.

Everything is **generated in code** — the room, furniture, and character are
all drawn from pixel grids. There are **no image assets and no build step or
dependencies**. Just plain HTML, CSS, and vanilla JavaScript.

| Room | Object | Walk up + press **E** | Shows |
| --- | --- | --- | --- |
| Living Room | 📌 Bulletin board | `cv` | CV summary, skills, experience, education, achievements |
| Living Room | 📮 Mailbox | `contact` | Email + social links |
| Living Room | 🚪 Door | — | Walk into the **Study** |
| Study | 🖥️ PC / desk | `projects` | Your list of projects |
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

## ✏️ Make it yours

Open **`js/content.js`** and edit the text — that single file holds your name,
bio, skills, experience, education, achievements, projects, and contact links.
No coding knowledge needed; just change the words inside the quotes. Add or
remove list items freely.

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

Ideas for later phases:
- More rooms / a second floor
- NPCs or a pet that follows you
- A minimap or quest-style hints
- Save the visitor's last room in `localStorage`
