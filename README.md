# Ananya Singh — Portfolio

Personal portfolio built with Vite, React and TypeScript. Static output, no backend, no runtime data fetching.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
```

## Quality checks

```bash
npm run typecheck  # tsc -b
npm run lint       # oxlint (react, typescript, jsx-a11y)
npm test           # vitest: content integrity + "no phone number anywhere" scan
npm run build      # typecheck + production build to dist/
npm run preview    # serve the production build
```

## Where things live

```
src/content/      ← ALL copy and data (profile, experience, education, skills,
                    certifications, leadership, projects, navigation)
src/components/   ← one component per section + Nav, Footer, Reveal, Section
src/styles/       ← tokens (colours/type), base, shared components, sections
src/hooks/        ← scroll-reveal and active-section hooks
public/           ← favicon, og.png, robots.txt
```

## Adding projects later

Projects are intentionally not published yet. When ready, add entries to
`src/content/projects.ts` (shape: `Project` in `src/content/types.ts`). The
Projects section swaps from the placeholder to a card grid automatically.
Then update the test in `src/test/content.test.ts` that asserts the array is empty.

## Deploy

Any static host works (build command `npm run build`, output directory `dist`).

- **Vercel / Netlify / Cloudflare Pages:** import the repo, framework "Vite", done.
- **GitHub Pages:** build, then publish `dist/`. For a project page under
  `/repo-name/`, set `base: '/repo-name/'` in `vite.config.ts`.

After choosing a domain:

1. Set `VITE_SITE_URL` (e.g. `https://ananyasingh.dev`, no trailing slash) in the host's env vars so `og:image` is absolute.
2. Add `<link rel="canonical" href="https://your-domain/">` in `index.html` (see the comment there).

## Notes

- Fonts (DM Sans, Fraunces italic) are self-hosted through `@fontsource-variable`; no third-party requests.
- The look follows the reference: near-black canvas, gold italic accents, speech bubbles around a cut-out portrait. To reorder sections (e.g. move Projects), edit `src/App.tsx` and `src/content/navigation.ts`.
- Motion respects `prefers-reduced-motion`; content is visible without scroll-triggered reveal in that mode.

## Projects, media and case studies

- Project content (VoxMind, DevForge) lives in `src/content/projects.ts`; every figure comes from each project's case study.
- Demo videos: `public/media/voxmind-demo.mp4`, `public/media/devforge-demo.mp4` (plus `*-poster.webp`). They are only requested when "Watch Demo" is pressed.
- Case-study PDFs: `public/case-studies/`.
- There is deliberately no "Live Demo" button: both projects only ever had temporary tunnel URLs. If a permanent URL appears, add a `live` link to the project and a button in `src/components/Projects.tsx`.
