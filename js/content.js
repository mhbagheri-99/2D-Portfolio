/* =========================================================================
 *  content.js  —  EDIT THIS FILE TO MAKE THE PORTFOLIO YOURS
 * =========================================================================
 *  Everything the visitor reads lives here. No code knowledge required:
 *  just change the text inside the quotes. Add or remove items freely.
 * ========================================================================= */

window.CONTENT = {
  /* Shown on the title screen and the little name plate. */
  profile: {
    name: "YOUR NAME",
    title: "Software Developer",
    intro: "Welcome to my room. Use the board for my CV, the PC for my work.",
  },

  /* ----- THE BULLETIN BOARD: CV + ACHIEVEMENTS ----- */
  cv: {
    summary:
      "Short bio goes here. A sentence or two about who you are, what you " +
      "build, and what you care about. Keep it punchy.",

    skills: [
      "JavaScript / TypeScript",
      "React",
      "Node.js",
      "Python",
      "Git",
      "SQL",
    ],

    experience: [
      {
        role: "Job Title",
        org: "Company Name",
        period: "2023 — Present",
        notes: "What you did and the impact you had. One or two lines.",
      },
      {
        role: "Earlier Job Title",
        org: "Previous Company",
        period: "2021 — 2023",
        notes: "Another highlight from your career.",
      },
    ],

    education: [
      {
        degree: "B.Sc. in Computer Science",
        org: "Your University",
        period: "2017 — 2021",
      },
    ],
  },

  achievements: [
    { year: "2024", text: "An award, certification, or milestone you're proud of." },
    { year: "2023", text: "Another notable achievement." },
    { year: "2022", text: "Something else worth bragging about (a little)." },
  ],

  /* ----- THE PC: PROJECTS ----- */
  projects: [
    {
      name: "Project One",
      tech: "React · Node · Postgres",
      blurb: "What it does and why it's cool. One or two sentences.",
      link: "https://github.com/yourname/project-one",
    },
    {
      name: "Project Two",
      tech: "Python · FastAPI",
      blurb: "A short description of this project.",
      link: "https://github.com/yourname/project-two",
    },
    {
      name: "Project Three",
      tech: "TypeScript · Canvas",
      blurb: "Like this very portfolio — built from scratch.",
      link: "",
    },
  ],

  /* ----- THE DOOR: contact / links ----- */
  contact: {
    email: "you@example.com",
    links: [
      { label: "GitHub", url: "https://github.com/yourname" },
      { label: "LinkedIn", url: "https://linkedin.com/in/yourname" },
    ],
  },
};
