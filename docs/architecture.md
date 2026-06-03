# Architecture

## Overview

The portal is a standard [TerriaMap](https://github.com/TerriaJS/TerriaMap) instance. TerriaMap is a thin shell around the [TerriaJS](https://github.com/TerriaJS/terriajs) library. The shell (`terriamap-source/TerriaMap/`) contains only the project-specific overrides; the framework (components, map engine, catalog system) lives in `node_modules/terriajs/`.

## Runtime Stack

| Layer      | Technology                                                                 |
| ---------- | -------------------------------------------------------------------------- |
| Map engine | Leaflet (2D) — Cesium disabled for this portal                             |
| Framework  | TerriaJS (React + MobX)                                                    |
| Build      | Webpack 5 + Gulp                                                           |
| Server     | `terriajs-server` (Node, port 3001) — proxies CORS-restricted data sources |
| Language   | TypeScript + JSX                                                           |

## Request Flow

```
Browser → localhost:3001
    → terriajs-server
        → serves wwwroot/ (built JS, CSS, HTML, images)
        → proxies external data requests (WMS, WMTS, Esri, CartoDB tiles, etc.)
```

## Source Layout

### `lib/` — Custom source code

Everything in `lib/` overrides or extends TerriaJS defaults.

```
lib/
├── Core/
│   └── loadPlugins.ts        # Loads plugins listed in plugins.ts
└── Views/
    ├── render.jsx             # Root React render; lazy-loads TerriaUserInterface
    ├── UserInterface.jsx      # Wraps StandardUserInterface; custom menu items go here
    ├── Loader.tsx             # Splash screen shown during initialisation
    ├── terriaStore.ts         # MobX store — initialises Terria + ViewState
    ├── showGlobalDisclaimer.ts
    ├── AboutButton.jsx
    ├── GlobalDisclaimer.html  # Disclaimer modal body
    └── global.scss            # CSS overrides (uses :global {} to escape CSS modules)
    Styles/
    ├── variables-overrides.scss  # SCSS variable overrides (active: $color-primary)
    └── variables.scss            # @use variables-overrides
```

### `wwwroot/` — Static assets and configuration

```
wwwroot/
├── config.json           # Master app config (100+ parameters)
├── index.ejs             # HTML template → index.html
├── init/
│   └── simple.json       # Catalog, home camera, basemaps
├── images/
│   ├── iihs_logo_rgb_color.svg   # Original logo (source)
│   ├── iihs_logo_white.svg       # Edited logo used in branding bar
│   ├── terria_logo.png           # Default TerriaJS logo (kept, unused)
│   └── basemaps/                 # 256×256 PNG preview tiles
│       ├── openstreetmap.png     # Bengaluru, zoom 10
│       ├── positron-light.png    # Bengaluru, zoom 10
│       └── positron-dark.png     # Bengaluru, zoom 10
├── languages/            # i18n strings
└── build/                # Webpack output (git-ignored)
    └── TerriaJS/         # Copied TerriaJS assets
```

### `buildprocess/`

- `webpack.config.js` — Webpack config. Entry: `entry.js` → output: `wwwroot/build/TerriaMap.js`
- CSS modules use naming: `tjs-[filename]__[classname]` — stable, targetable from `global.scss`

## Initialisation Sequence

1. Browser loads `index.html` (from `wwwroot/index.ejs`)
2. `TerriaMap.js` bundle executes → `entry.js` → `renderUi()`
3. `render.jsx` mounts React tree, lazy-loads `TerriaUserInterface`
4. `index.js` creates `Terria` instance and loads `config.json`
5. Config points to `init/simple.json` → catalog, home camera, basemaps loaded
6. Plugins loaded before app state is restored
7. Map renders in 2D (Leaflet) mode

## Configuration System

### `config.json`

The primary configuration file. Active customisations:

- `appName` — application title (**TODO:** update from "Terria Map")
- `brandBarElements` — IIHS logo in top-left branding bar
- `defaultViewerMode: "2d"` — forces 2D on desktop
- `mobileDefaultViewerMode: "2d"` — forces 2D on mobile
- `supportEmail` — (**TODO:** update from "help@example.com")

### `init/simple.json`

Active customisations:

- `homeCamera` — India bounding box
- `viewerMode: "2d"`
- `baseMaps` — 3 enabled basemaps with Bengaluru preview tiles

## CSS Module Naming

TerriaJS compiles SCSS as CSS modules with the pattern:

```
tjs-[scss-filename]__[local-classname]
```

Examples:

- `setting-panel.scss` `.dropdown-inner` → `tjs-setting-panel__dropdown-inner`
- `panel.scss` `.content` → `tjs-panel__content`
- `panel.scss` `.inner` → `tjs-panel__inner`

All CSS overrides in `global.scss` must be inside `:global {}` to escape module scoping.

## Node Modules Policy

Editing `node_modules/terriajs/` is possible but changes are **lost on `yarn install`**.

**Current situation:** All customisations are in `lib/` and `wwwroot/` — no node_modules edits are active.

**Recommended path for future TerriaJS-level changes:**

1. Fork `terriajs/terriajs` on GitHub
2. Clone fork into `packages/terriajs/`
3. Add as yarn workspace — takes priority over the npm dependency
4. Edit TerriaJS source in `packages/terriajs/` (git-tracked in fork)
5. Pull upstream: `git fetch upstream && git merge upstream/main`

## Plugin System

Plugins extend TerriaJS with custom catalog item types, UI panels, or tools.

1. Add a plugin package to `package.json` devDependencies
2. Register it in `plugins.ts`
3. The plugin is loaded by `lib/Core/loadPlugins.ts` before app state restores

## Data Proxy

`serverconfig.json` → `allowProxyFor` lists domains `terriajs-server` will proxy. Add an entry here when a new external data source is blocked by CORS.
