# TODO — Pre-Production & Ongoing

Status key: ✅ Done · 🔲 Pending · ⏸ Deferred

---

## Branding & Identity

| #   | Task                          | Status | Notes                                                                   |
| --- | ----------------------------- | ------ | ----------------------------------------------------------------------- |
| 1   | App name                      | ✅     | `"IIHS Geospatial Lab Geoportal"` in `config.json` + `index.ejs`        |
| 2   | Support email                 | ✅     | `geospatial.lab@iihs.ac.in` in `config.json`                            |
| 3   | About button URL              | ✅     | Redirects to `https://gis.iihs.co.in`                                   |
| 4   | Page title + meta description | ✅     | Updated in `index.ejs`                                                  |
| 5   | IIHS logo (white, cropped)    | ✅     | `iihs_logo_white.svg` in branding bar                                   |
| 6   | Favicon                       | 🔲     | Still TerriaJS default — create IIHS favicon set and update `index.ejs` |
| 7   | Loading screen                | ⏸      | Hardcoded dark grey — revisit with brand guidelines                     |
| 8   | Legal disclaimer              | ⏸      | `lib/Views/GlobalDisclaimer.html` — replace with actual legal text      |

---

## Map Configuration

| #   | Task                | Status | Notes                                                                        |
| --- | ------------------- | ------ | ---------------------------------------------------------------------------- |
| 9   | 2D-only mode        | ✅     | 3D buttons hidden via CSS; `defaultViewerMode: "2d"`                         |
| 10  | Home camera (India) | ✅     | Bounding box `{ north:37.1, east:97.4, south:7.9, west:68.1 }`               |
| 11  | Primary colour      | ✅     | `#881802` in `variables-overrides.scss`                                      |
| 12  | Basemaps            | ✅     | OSM, Positron Light, Positron Dark — Bengaluru preview tiles                 |
| 13  | Example catalog     | 🔲     | `init/simple.json` still has TerriaJS test data — replace with IIHS datasets |
| 14  | Proxy allowlist     | ⏸      | `serverconfig.json` — update once prod data sources are known                |

---

## Help & Content

| #   | Task               | Status | Notes                                                                   |
| --- | ------------------ | ------ | ----------------------------------------------------------------------- |
| 15  | Help panel content | ⏸      | Still uses TerriaJS translation keys — write IIHS-specific help content |
| 16  | About page         | ⏸      | Currently redirects to `gis.iihs.co.in` — build dedicated page later    |

---

## Analytics & Monitoring

| #   | Task             | Status | Notes                                                                                |
| --- | ---------------- | ------ | ------------------------------------------------------------------------------------ |
| 17  | Google Analytics | ⏸      | Set `googleAnalyticsKey` in `config.json`, switch to `GoogleAnalytics` in `index.js` |

---

## Infrastructure & Deployment

| #   | Task              | Status | Notes                                                                      |
| --- | ----------------- | ------ | -------------------------------------------------------------------------- |
| 18  | Docker setup      | ✅     | `docker-compose.yml`, Node 22, port 3020, health checks                    |
| 19  | Production build  | ✅     | `yarn gulp release` runs inside Docker build stage                         |
| 20  | nginx config      | ✅     | `deploy/nginx/geoportal.gis.iihs.co.in.conf` — HTTP proxy, gzip, caching   |
| 21  | MinIO share links | ✅     | Self-hosted S3 via MinIO, `terriajs-shares` bucket, console via SSH tunnel |
| 22  | SSL / HTTPS       | ⏸      | Add certbot when ready — see `docs/deployment.md`                          |
| 23  | TerriaJS fork     | ⏸      | Fork `terriajs/terriajs` if node_modules-level edits are needed            |

---

## Code Quality

| #   | Task                             | Status | Notes                                                |
| --- | -------------------------------- | ------ | ---------------------------------------------------- |
| 24  | Remove husky deprecation warning | 🔲     | Remove two deprecated lines from `.husky/pre-commit` |

---

## Completed (Archive)

- ✅ Primary colour `#881802`
- ✅ IIHS logo white variant with cropped viewBox
- ✅ Hide 3D viewer buttons (2D-only portal)
- ✅ Set home camera to India bounding box
- ✅ Add Positron Light + Dark basemaps (CartoDB)
- ✅ Basemap previews showing Bengaluru (zoom 10)
- ✅ Remove Natural Earth basemap
- ✅ Remove exposed NSW Transport API key from example catalog
- ✅ Remove unused Bing/topo basemap preview images
- ✅ Set `defaultViewerMode` and `mobileDefaultViewerMode` to `2d`
- ✅ App name, support email, about URL, page title set
- ✅ Git setup: TerriaMap fork (`iihs-gsl/geospatial-lab-geoportal
- ✅ Dockerised: Node 22, port 3020, health check, `yarn gulp release` build
- ✅ nginx HTTP reverse proxy for `geoportal.gis.iihs.co.in`
- ✅ Deployed to production at `http://geoportal.gis.iihs.co.in`
- ✅ MinIO share link storage — self-hosted S3, console via SSH tunnel on port 9001
