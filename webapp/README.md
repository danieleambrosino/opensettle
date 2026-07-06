# OpenSettle Webapp

Solid + Vite SPA. Same pipeline as the CLI, but visual and interactive. Runs entirely in the browser.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production → `dist/` |
| `npm run check` | Run ultracite (Biome) check |
| `npm run fix` | Auto-fix formatting/lint |

### Feature: edit any stage

Each stage auto-syncs from the previous one. Toggle off auto-sync and edit the data by hand — useful when the equal split doesn't fit reality and someone should pay a bit less.
