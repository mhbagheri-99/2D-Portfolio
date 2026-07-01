/* =========================================================================
 *  interactions.js  —  the content overlays (CV, projects, games, contact)
 * ========================================================================= */

function buildPanel(action) {
  const C = window.CONTENT;
  switch (action) {
    case "cv":       return cvPanel(C);
    case "projects": return projectsPanel(C);
    case "games":    return gamesPanel(C);
    case "contact":  return contactPanel(C);
    default:         return "<p>Nothing here.</p>";
  }
}

function esc(s) {
  return String(s).replace(/[&<>"]/g, (ch) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
}

function cvPanel(C) {
  const cv = C.cv;

  const skills = cv.skillGroups.map((g) => `
    <div class="skill-row">
      <span class="skill-cat">${esc(g.name)}</span>
      <span class="tags">${g.items.map((s) => `<span class="tag">${esc(s)}</span>`).join("")}</span>
    </div>`).join("");

  const exp = cv.experience.map((e) => `
    <div class="entry">
      <div class="entry-head"><b>${esc(e.role)}</b> — ${esc(e.org)}
        <span class="period">${esc(e.period)}</span></div>
      <div class="entry-notes">${esc(e.notes)}</div>
    </div>`).join("");

  const edu = cv.education.map((e) => `
    <div class="entry">
      <div class="entry-head"><b>${esc(e.degree)}</b> — ${esc(e.org)}
        <span class="period">${esc(e.period)}</span></div>
      ${e.notes ? `<div class="entry-notes">${esc(e.notes)}</div>` : ""}
    </div>`).join("");

  const langs = cv.languages.map((l) => `<span class="tag">${esc(l)}</span>`).join("");

  const ach = C.achievements.map((a) => `
    <li><span class="year">${esc(a.year)}</span> ${esc(a.text)}</li>`).join("");

  return `
    <h2>★ ${esc(C.profile.name)}</h2>
    <p class="subtitle">${esc(C.profile.title)}</p>
    <p class="summary">${esc(cv.summary)}</p>
    <h3>Experience</h3>${exp}
    <h3>Skills</h3><div class="skills">${skills}</div>
    <h3>Education</h3>${edu}
    <h3>Languages</h3><div class="tags">${langs}</div>
    <h3>Achievements</h3><ul class="achievements">${ach}</ul>`;
}

function projectCard(p) {
  const link = p.link
    ? `<a href="${esc(p.link)}" target="_blank" rel="noopener">visit →</a>`
    : "";
  return `
    <div class="card">
      <div class="card-head"><b>${esc(p.name)}</b>
        <span class="card-meta"><span class="card-year">${esc(p.year)}</span>${link}</span></div>
      <div class="card-tech">${esc(p.tech)}</div>
      <div class="card-blurb">${esc(p.blurb)}</div>
    </div>`;
}

function projectGroup(C, group, title) {
  const items = C.projects.filter((p) => p.group === group);
  if (!items.length) return "";
  return `<h3>${title}</h3><div class="cards">${items.map(projectCard).join("")}</div>`;
}

function projectsPanel(C) {
  return `
    <h2>▣ Projects</h2>
    ${projectGroup(C, "oss", "Open Source")}
    ${projectGroup(C, "web", "Web Development")}
    ${projectGroup(C, "academic", "Academic")}
    <p class="hint-line">Psst — my games live on the arcade machine!</p>`;
}

function gamesPanel(C) {
  return `
    <h2>🕹 Game Dev</h2>
    <p class="summary">Built in Unreal Engine 5 and Unity — the same love for
    games that shaped this very portfolio.</p>
    ${projectGroup(C, "game", "Games")}`;
}

function contactPanel(C) {
  const links = C.contact.links.map((l) =>
    `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join("");
  return `
    <h2>✉ Get in touch</h2>
    <p>Email: <a href="mailto:${esc(C.contact.email)}">${esc(C.contact.email)}</a></p>
    <p>Based in ${esc(C.contact.location)} — open to interesting problems anywhere.</p>
    <div class="tags">${links}</div>`;
}

window.INTERACTIONS = { buildPanel };
