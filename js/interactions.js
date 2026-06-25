/* =========================================================================
 *  interactions.js  —  the content overlays (CV, projects, contact)
 * ========================================================================= */

function buildPanel(action) {
  const C = window.CONTENT;
  switch (action) {
    case "cv":       return cvPanel(C);
    case "projects": return projectsPanel(C);
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
  const skills = cv.skills.map((s) => `<span class="tag">${esc(s)}</span>`).join("");
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
    </div>`).join("");
  const ach = C.achievements.map((a) => `
    <li><span class="year">${esc(a.year)}</span> ${esc(a.text)}</li>`).join("");

  return `
    <h2>★ Curriculum Vitae</h2>
    <p class="summary">${esc(cv.summary)}</p>
    <h3>Skills</h3><div class="tags">${skills}</div>
    <h3>Experience</h3>${exp}
    <h3>Education</h3>${edu}
    <h3>Achievements</h3><ul class="achievements">${ach}</ul>`;
}

function projectsPanel(C) {
  const cards = C.projects.map((p) => {
    const link = p.link
      ? `<a href="${esc(p.link)}" target="_blank" rel="noopener">visit →</a>`
      : "";
    return `
      <div class="card">
        <div class="card-head"><b>${esc(p.name)}</b> ${link}</div>
        <div class="card-tech">${esc(p.tech)}</div>
        <div class="card-blurb">${esc(p.blurb)}</div>
      </div>`;
  }).join("");
  return `<h2>▣ Projects</h2><div class="cards">${cards}</div>`;
}

function contactPanel(C) {
  const links = C.contact.links.map((l) =>
    `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join("");
  return `
    <h2>✉ Get in touch</h2>
    <p>Email: <a href="mailto:${esc(C.contact.email)}">${esc(C.contact.email)}</a></p>
    <div class="tags">${links}</div>`;
}

window.INTERACTIONS = { buildPanel };
