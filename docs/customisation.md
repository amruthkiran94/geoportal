# Customisation Guide

All customisation work lives inside `terriamap-source/TerriaMap/`. Never edit files inside `node_modules/` unless there is no config/CSS alternative — changes there are lost on `yarn install`.

---

## Applied Customisations

### Primary Colour

**File:** `lib/Styles/variables-overrides.scss`

Set to `#881802`. Hover states auto-derive via `color.adjust($color-primary, $lightness: 10%)`.

```scss
@forward "~terriajs/lib/Sass/common/_default_variables.scss" with (
  $color-primary: #881802
);
```

### Logo

**File:** `wwwroot/config.json` → `brandBarElements`

The IIHS logo has two versions in `wwwroot/images/`:

- `iihs_logo_rgb_color.svg` — original, untouched
- `iihs_logo_white.svg` — white fill (`fill="white"` on SVG root), viewBox cropped to `51 51 513 132`

The branding bar uses `iihs_logo_white.svg` at height 52px.

### 2D-Only Mode

**Files:** `lib/Views/global.scss`, `wwwroot/config.json`, `wwwroot/init/simple.json`

Three layers of enforcement:

1. CSS hides the 3D Terrain and 3D Smooth buttons in the settings panel
2. `config.json` sets `defaultViewerMode: "2d"` and `mobileDefaultViewerMode: "2d"`
3. `init/simple.json` sets `viewerMode: "2d"`

The CSS selector in `global.scss`:

```scss
.tjs-setting-panel__dropdown-inner
  .tjs-panel__content
  > div
  > div:first-child
  + div
  > *:nth-child(-n + 2) {
  display: none;
}
```

This uses the stable `tjs-[filename]__[classname]` CSS module naming pattern.

### Home Camera (India)

**File:** `wwwroot/init/simple.json`

```json
"homeCamera": {
  "north": 37.1,
  "east": 97.4,
  "south": 7.9,
  "west": 68.1
}
```

### Basemaps

**File:** `wwwroot/init/simple.json` → `baseMaps`

Three basemaps are enabled. Natural Earth has been removed.

```json
"baseMaps": {
  "defaultBaseMapId": "basemap-openstreetmap",
  "previewBaseMapId": "basemap-openstreetmap",
  "enabledBaseMaps": ["basemap-openstreetmap", "basemap-positron-light", "basemap-positron-dark"],
  "items": [...]
}
```

| Basemap        | Tile URL                                                  | Preview                              |
| -------------- | --------------------------------------------------------- | ------------------------------------ |
| OpenStreetMap  | `https://tile.openstreetmap.org/`                         | `images/basemaps/openstreetmap.png`  |
| Positron Light | `https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png` | `images/basemaps/positron-light.png` |
| Positron Dark  | `https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png`  | `images/basemaps/positron-dark.png`  |

Preview images are 256×256 PNG tiles showing Bengaluru (zoom 10, tile x=732 y=474).

To regenerate previews for a different location:

```js
// Calculate tile coords: lat=12.9716, lon=77.5946, zoom=10
x = floor((lon + 180) / 360 * 2^z)
y = floor((1 - ln(tan(lat°) + sec(lat°)) / π) / 2 * 2^z)
```

---

## How To

### Change the primary colour

Edit `lib/Styles/variables-overrides.scss` → `$color-primary`.

### Add a new basemap

1. Add an entry to `baseMaps.items` in `wwwroot/init/simple.json`
2. Drop a 256×256 PNG preview in `wwwroot/images/basemaps/`
3. Add the basemap ID to `enabledBaseMaps`

### Change home camera

Edit `homeCamera` in `wwwroot/init/simple.json`.

### Add a custom CSS override

Use `lib/Views/global.scss`. Target TerriaJS components using the `tjs-[filename]__[classname]` class pattern. All rules must be inside the `:global {}` block.

### Add a custom menu item

Edit `lib/Views/UserInterface.jsx`. Add items inside `<MenuLeft>` — these slot into the top-left nav bar.

### Add proxy domains

Edit `serverconfig.json` → `allowProxyFor`. Required for external data sources blocked by CORS.

### Add to the help panel

Edit `config.json` → `helpContent`. Each entry takes a `title`, `itemName`, `icon`, and `markdownText`.

### Change the page title / favicon

Edit `wwwroot/index.ejs`.

---

## TODO / Pending

- Update `appName` in `config.json` (currently `"Terria Map"`)
- Update `supportEmail` in `config.json` (currently `"help@example.com"`)
- Fork TerriaJS for any future node_modules-level changes (see [Architecture](architecture.md))
