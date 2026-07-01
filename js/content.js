/* =========================================================================
 *  content.js  —  Mohammad H. Bagheri's portfolio data
 * =========================================================================
 *  Everything the visitor reads lives here. Edit freely — no code
 *  knowledge required beyond changing the text inside the quotes.
 * ========================================================================= */

window.CONTENT = {
  profile: {
    name: "Mohammad H. Bagheri",
    title: "Software Engineer · Milan, Italy",
    intro:
      "Welcome to my little pixel home! Check the board for my CV, " +
      "the PC for my web work, and the arcade machine for my games.",
  },

  /* ----- THE BULLETIN BOARD: CV + ACHIEVEMENTS ----- */
  cv: {
    summary:
      "Software Engineer with 3+ years of experience building scalable web " +
      "applications — backend systems, API development, and AI integration. " +
      "Currently at MotorK, driving system modernization and designing " +
      "agentic workflows. Also a game developer (UE5/Unity) and a Rust " +
      "hobbyist with a soft spot for open source.",

    skillGroups: [
      {
        name: "Programming",
        items: ["Python", "JS / TS", "PHP", "C/C++", "Java", "Rust"],
      },
      {
        name: "Web",
        items: ["Symfony", "FastAPI", "Django", "Next.js", "React", "Vue.js",
                "Node.js", "REST & GraphQL", "SQL / NoSQL"],
      },
      {
        name: "AI & Data",
        items: ["MS Agent Framework (AutoGen)", "Pandas", "NumPy"],
      },
      {
        name: "Game Dev",
        items: ["Unreal Engine 5 (C++ & Blueprints)", "Unity"],
      },
      {
        name: "Infra & Tools",
        items: ["AWS", "Docker & Kubernetes", "Grafana", "Git", "Linux",
                "UI/UX Design", "Figma"],
      },
    ],

    experience: [
      {
        role: "Software Engineer",
        org: "MotorK",
        period: "Nov 2024 — Present · Milan, Italy",
        notes:
          "Building and maintaining critical integrations across core product " +
          "ecosystems. Designed an internal automation tool that cut team " +
          "overhead by 30–40% on a key integration step, pioneered AI-driven " +
          "development workflows, and built Grafana dashboards + alerting " +
          "that reduced mean time to resolution.",
      },
      {
        role: "Full-Stack Developer / Advisor",
        org: "Pet24-7 (contract)",
        period: "May 2025 — Present · Remote, UK",
        notes:
          "Own the health of the core application end to end. Expanded API " +
          "test coverage by 75%, automated demo-data management to speed up " +
          "developer onboarding, and mentored new engineers through the " +
          "team's shift to AI-assisted development.",
      },
      {
        role: "Full-Stack Developer",
        org: "MeNEW (part-time)",
        period: "Jun 2024 — Aug 2024 · Remote",
        notes:
          "Maintained and extended a food-service app: new features like " +
          "food labels and a package-purchase onboarding flow. Django + " +
          "Graphene (GraphQL) + PostgreSQL backend, Next.js frontend.",
      },
    ],

    education: [
      {
        degree: "M.Sc. ICT for Internet and Multimedia",
        org: "University of Padova",
        period: "2022 — 2024 · GPA 103/110",
        notes:
          "Thesis: “Advancing VR Interaction Paradigms: A User Experience " +
          "Evaluation of Haptic Feedback”",
      },
      {
        degree: "B.Sc. Computer Engineering",
        org: "Tabriz University",
        period: "2017 — 2021",
        notes: "Final project: “Mocha Coffee Shop Platform Design” — 20/20",
      },
    ],

    languages: [
      "English (C2 — IELTS 8.0)",
      "Persian (native)",
      "Italian (B1, learning)",
    ],
  },

  achievements: [
    { year: "2025", text: "Contributed a project-setup customization feature to Tauri (open source)." },
    { year: "2025", text: "Expanded API test coverage by 75% at Pet24-7, hardening every endpoint." },
    { year: "2024", text: "Built an internal automation tool at MotorK cutting team overhead by 30–40%." },
    { year: "2024", text: "M.Sc. from University of Padova with GPA 103/110 and a VR haptics thesis." },
    { year: "2021", text: "IELTS Academic 8.0 overall (Reading 9.0) — C2 English." },
    { year: "2021", text: "B.Sc. final project graded 20/20 (Mocha Coffee Shop Platform)." },
  ],

  /* ----- THE PC: web, open-source & academic work ----- */
  /* group: "oss" | "web" | "academic" appear on the PC ·
   *        "game" appears on the arcade machine            */
  projects: [
    {
      name: "Tauri (open source)",
      group: "oss",
      year: "2025",
      tech: "Rust · TypeScript",
      blurb:
        "Contributed a feature that simplifies and expands project setup, " +
        "giving developers more ways to tailor their build environment.",
      link: "https://github.com/mhbagheri-99",
    },
    {
      name: "Horizon",
      group: "web",
      year: "2024",
      tech: "Next.js · Plaid",
      blurb:
        "A banking & finance manager that aggregates real bank data " +
        "through the Plaid API.",
      link: "https://github.com/mhbagheri-99",
    },
    {
      name: "Vroom",
      group: "web",
      year: "2024",
      tech: "Next.js · Clerk · Stream",
      blurb:
        "A Zoom clone with full meeting functionality — auth via Clerk, " +
        "real-time communication via Stream.",
      link: "https://github.com/mhbagheri-99",
    },
    {
      name: "E-Commerce Platform",
      group: "web",
      year: "2024",
      tech: "Next.js · PostgreSQL",
      blurb:
        "Digital-products store with email receipts, a coupon system for " +
        "limited offers, and a clean admin dashboard.",
      link: "https://github.com/mhbagheri-99",
    },
    {
      name: "Conway's Game of Life Analyzer",
      group: "academic",
      year: "2024",
      tech: "Python",
      blurb: "Implements the Game of Life, renders runs as GIFs, and analyzes the emerging patterns.",
      link: "https://github.com/mhbagheri-99",
    },
    {
      name: "Image Enhancement",
      group: "academic",
      year: "2023",
      tech: "Python · OpenCV",
      blurb: "Digital-forensics final project on image enhancement with a legal integrity report.",
      link: "https://github.com/mhbagheri-99",
    },
    {
      name: "Fixing Corrupted Images",
      group: "academic",
      year: "2023",
      tech: "Python · SIFT",
      blurb: "Restored corrupted images by extracting and matching SIFT features across patches.",
      link: "https://github.com/mhbagheri-99",
    },

    /* ----- THE ARCADE MACHINE: games ----- */
    {
      name: "Aura",
      group: "game",
      year: "in dev",
      tech: "UE5 · C++ · Blueprints",
      blurb:
        "An RPG built around the Gameplay Ability System with a complex " +
        "data-driven UI. Coming to itch.io when ready — progress on GitHub.",
      link: "https://github.com/mhbagheri-99",
    },
    {
      name: "Grandpa's Secret",
      group: "game",
      year: "2023",
      tech: "UE5 · C++ · Blueprints",
      blurb:
        "A first-person mystery puzzle prototype — published, with full " +
        "feature documentation on GitHub.",
      link: "https://github.com/mhbagheri-99",
    },
    {
      name: "Tank and Towers",
      group: "game",
      year: "2023",
      tech: "UE5 · C++",
      blurb: "A tank-shooter demo built mostly in C++ with select features in Blueprints.",
      link: "https://github.com/mhbagheri-99",
    },
    {
      name: "VR Puzzle Application",
      group: "game",
      year: "2024",
      tech: "Unity · VR",
      blurb:
        "A puzzle platform for studying how input & interaction methods " +
        "shape user experience and involvement in VR (M.Sc. research).",
      link: "https://github.com/mhbagheri-99",
    },
  ],

  /* ----- THE MAILBOX: contact ----- */
  contact: {
    email: "mhbagheri3@gmail.com",
    location: "Milan, Italy",
    links: [
      { label: "GitHub", url: "https://github.com/mhbagheri-99" },
      { label: "LinkedIn", url: "https://www.linkedin.com/in/mhbagheri" },
    ],
  },
};
