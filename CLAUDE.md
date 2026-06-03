# CLAUDE.md — IIHS Geospatial Lab Geoportal

## Project Overview

A geospatial web portal built on [TerriaJS](https://github.com/TerriaJS/terriajs) / [TerriaMap](https://github.com/TerriaJS/TerriaMap). This is a fork of TerriaMap with IIHS-specific customisations. All custom source code lives in `lib/` and `wwwroot/`.

## Running the Project

```bash
yarn install        # First time only
yarn gulp dev       # Build + watch + start server on http://localhost:3001
yarn gulp build     # One-off development build
yarn gulp release   # Optimised production build (no sourcemaps)
```

Node >= 22 and yarn are required. If yarn is missing: `npm install -g yarn`.

If port 3001 is already in use:

```powershell
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess -Force
```

## Codebase Map

```
./
├── entry.js                        # Webpack entry — calls renderUi()
├── index.js                        # Terria instance setup, analytics, startup
├── plugins.ts                      # Plugin registry (dynamic imports)
├── serverconfig.json               # Dev server config — port 3020 + proxy allow-list
├── docker-compose.yml              # Production: TerriaMap + MinIO
│
├── lib/                            # All custom source code lives here
│   ├── auth/
│   │   └── keycloak.ts             # Keycloak init, role check, logout
│   ├── Core/loadPlugins.ts         # Plugin loader
│   └── Views/
│       ├── UserInterface.jsx       # Top-level UI wrapper — custom menu items here
│       ├── render.jsx              # Root React render — handles auth states
│       ├── terriaStore.ts          # MobX store — auth gate + Terria init
│       ├── AccessDenied.tsx        # IIHS-branded access denied screen
│       ├── UserMenuItem.tsx        # Sign Out button in toolbar
│       ├── user-menu.scss          # Toolbar button styles
│       ├── Loader.tsx              # Splash/loading screen
│       ├── global.scss             # CSS overrides
│       └── Styles/
│           ├── variables-overrides.scss # SCSS variable overrides
│           └── variables.scss
│
├── wwwroot/
│   ├── config.json                 # 100+ app parameters — branding, search, analytics
│   ├── index.ejs                   # HTML template (title, meta, favicon)
│   ├── init/simple.json            # Default catalog — layers, home camera bounds
│   └── images/
│       ├── iihs_logo_rgb_color.svg # Original IIHS logo (untouched)
│       ├── iihs_logo_white.svg     # White fill + cropped viewBox — used in branding bar
│       └── basemaps/               # Basemap preview thumbnails (256×256 PNG, Bengaluru)
│           ├── openstreetmap.png
│           ├── positron-light.png
│           └── positron-dark.png
│
├── deploy/
│   └── nginx/
│       └── geoportal.gis.iihs.co.in.conf  # nginx HTTP reverse proxy config
│
└── docs/                           # Project documentation
    ├── architecture.md
    ├── customisation.md
    ├── deployment.md
    └── todo.md
```

## Deployment

Live at `http://geoportal.gis.iihs.co.in` — see [docs/deployment.md](docs/deployment.md) for full instructions.

- **Stack:** TerriaMap + MinIO in Docker, nginx as reverse proxy
- **Port:** `127.0.0.1:3020` (internal), nginx proxies from port 80
- **Share links:** stored as JSON blobs in MinIO (`terriajs-shares` bucket)
- **MinIO console:** SSH tunnel → `ssh -L 9001:127.0.0.1:9001 user@server` → http://localhost:9001
- **Update:** `git pull origin main && docker compose build && docker compose up -d`
- **Credentials:** `.env` and `serverconfig.production.json` on server (gitignored, never committed)
- **SSL:** pending — certbot when ready

## Outstanding Work

See [docs/todo.md](docs/todo.md) for the full task list. Key pending items:

- **Catalog** — `init/simple.json` still has TerriaJS example data, needs IIHS datasets
- **Favicon** — still TerriaJS default
- **Legal disclaimer** — `lib/Views/GlobalDisclaimer.html` is placeholder
- **Analytics** — Google Analytics key not configured

## Customisations Applied

### Branding

- App name: `"IIHS Geospatial Lab Geoportal"` in `wwwroot/config.json` + `wwwroot/index.ejs`
- Logo: `wwwroot/images/iihs_logo_white.svg` (white paths, cropped viewBox `51 51 513 132`)
- Support email: `geospatial.lab@iihs.ac.in`
- About button: redirects to `https://gis.iihs.co.in`

### Colours

- Primary colour (buttons, hover states): `#881802`
- Set in `lib/Styles/variables-overrides.scss` via `$color-primary`

### Authentication (Keycloak)

- Server: `https://login.gis.iihs.co.in`, realm `iihs-gsl`, client `app-geoportal`
- Required role: `app-geoportal-access` (at `realm_access.roles` in token)
- PKCE S256, public client (no client secret)
- Sign Out button in toolbar; access denied screen if role missing
- Dev logout → `window.location.origin + pathname`; prod logout → `https://gis.iihs.co.in/`

### Map Viewer

- 2D only — 3D buttons hidden via CSS in `lib/Views/global.scss`
- `defaultViewerMode: "2d"` in `config.json`; `viewerMode: "2d"` in `init/simple.json`

### Home Camera

- Centred on India: `{ north: 37.1, east: 97.4, south: 7.9, west: 68.1 }`

### Basemaps

| ID                       | Name           | Type                             |
| ------------------------ | -------------- | -------------------------------- |
| `basemap-openstreetmap`  | OpenStreetMap  | `open-street-map`                |
| `basemap-positron-light` | Positron Light | `url-template-imagery` (CartoDB) |
| `basemap-positron-dark`  | Positron Dark  | `url-template-imagery` (CartoDB) |

## Key Customisation Points

| What                      | File                                                       |
| ------------------------- | ---------------------------------------------------------- |
| App name, branding bar    | `wwwroot/config.json` → `appName`, `brandBarElements`      |
| Catalogue / map layers    | `wwwroot/init/simple.json`                                 |
| Home camera bounds        | `wwwroot/init/simple.json` → `homeCamera`                  |
| Colours, fonts, logo size | `lib/Styles/variables-overrides.scss`                      |
| CSS overrides             | `lib/Views/global.scss`                                    |
| Custom React menu items   | `lib/Views/UserInterface.jsx`                              |
| Auth logic                | `lib/auth/keycloak.ts` + `lib/Views/terriaStore.ts`        |
| Proxy allow-list          | `serverconfig.json` → `allowProxyFor`                      |
| Analytics                 | `index.js` — swap `ConsoleAnalytics` for `GoogleAnalytics` |

## Development Conventions

- All source customisations belong in `lib/` — avoid editing `node_modules/terriajs/`.
- CSS module class names follow `tjs-[filename]__[classname]` — stable and targetable from `global.scss`.
- SCSS: override variables in `variables-overrides.scss` first; fall back to `global.scss` for structural overrides.
- Catalog data (`init/*.json`) and `config.json` are hot-reloaded — no rebuild needed.
- JS/SCSS changes trigger a webpack rebuild (~10–30s incremental). Run `yarn gulp build-app` to force a full rebuild.
- The two Sass `@import` deprecation warnings at build time are upstream TerriaJS issues — ignore them.
- TerriaJS docs: https://docs.terria.io/guide/
- TerriaJS source (for reading component internals): `node_modules/terriajs/lib/`

## Upstream Sync

```bash
git fetch upstream
git merge upstream/main
# Resolve conflicts in: package.json, lib/Views/terriaStore.ts,
# lib/Views/render.jsx, lib/Views/UserInterface.jsx, Dockerfile
git push origin main
```

High-conflict files when merging upstream: `terriaStore.ts` (Keycloak gate), `render.jsx` (AccessDenied), `UserInterface.jsx` (Menu slot), `package.json` (dependencies).
