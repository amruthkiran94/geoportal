# IIHS Geospatial Lab Geoportal

A customised geospatial web portal for the [IIHS Geospatial Lab](https://gis.iihs.co.in), built on [TerriaJS](https://github.com/TerriaJS/terriajs) / [TerriaMap](https://github.com/TerriaJS/TerriaMap).

**Live:** http://geoportal.gis.iihs.co.in

## Quick Start

**Prerequisites:** Node >= 22, yarn (`npm install -g yarn`)

```bash
yarn install        # First time only
yarn gulp dev       # Starts dev server at http://localhost:3001
```

## Documentation

- [docs/architecture.md](docs/architecture.md) — Runtime stack, source layout, config system
- [docs/customisation.md](docs/customisation.md) — Applied customisations with code examples
- [docs/deployment.md](docs/deployment.md) — Production setup (Docker + nginx + MinIO)
- [docs/todo.md](docs/todo.md) — Pending work

## Build Commands

| Command               | Description                                 |
| --------------------- | ------------------------------------------- |
| `yarn gulp dev`       | Dev server with watch + incremental rebuild |
| `yarn gulp build`     | One-off development build                   |
| `yarn gulp release`   | Optimised production build                  |
| `yarn gulp build-app` | Force full webpack rebuild                  |
| `yarn gulp clean`     | Remove `wwwroot/build/`                     |

## Upstream

This is a fork of [TerriaJS/TerriaMap](https://github.com/TerriaJS/TerriaMap).

```bash
# Pull upstream updates
git fetch upstream
git merge upstream/main
```

- [TerriaMap GitHub](https://github.com/TerriaJS/TerriaMap)
- [TerriaJS Docs](https://docs.terria.io/guide/)
