# 🕹️ 8-bit Portfolio

A tiny **2D, 8-bit style portfolio** you explore like a retro game. Walk your
character around a pixel-art room and step up to objects to reveal your CV,
achievements, and projects.

Everything is **generated in code** — the room, furniture, and character are
all drawn from pixel grids. There are **no image assets and no build step or
dependencies**. Just plain HTML, CSS, and vanilla JavaScript.

| Object | Walk up + press **E** | Shows |
| --- | --- | --- |
| 📌 Bulletin board | `cv` | CV summary, skills, experience, education, achievements |
| 🖥️ PC / desk | `projects` | Your list of projects |
| 🚪 Door | `contact` | Email + social links |

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
- **Interact:** **E** (or Enter / Space) when the prompt appears
- **Close a panel:** **Esc**
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
  sprites.js        pixel-art definitions + draw helper
  world.js          room tiles, furniture placement, collision
  player.js         movement, collision, walk animation
  interactions.js   builds the CV / projects / contact panels
  game.js           input, scaling, main render loop
serve.js            optional zero-dependency local server
```

## 🗺️ Notes & roadmap

**Phase 1 (done):** explorable room, four-direction movement with a light
two-frame walk animation, collision, three interactive stations, retro content
panels, and touch controls.

Ideas for later phases:
- Multiple rooms / a small house to walk between
- Richer character and furniture animation (idle bob, flickering screen)
- Background chiptune music and sound effects
- A minimap or quest-style hints
