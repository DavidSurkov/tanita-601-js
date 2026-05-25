# Tanita 601 Scales App — Design System

## 1. Product Design Direction

The app should feel like a clean health-tech dashboard: precise, calm, technical, and trustworthy. It will contain many tables, buttons, metric cards, and graphs, so the design must prioritize readability, spacing, contrast, and predictable visual hierarchy.

The visual direction is based on **Option 1: Tanita Tech Blue**, extended with a matching dark theme.

### Design Keywords

- Health-tech
- Body metrics
- Digital scale
- Clean dashboard
- Data-heavy
- Precise
- Calm
- Professional
- Minimal
- Table-friendly

### Avoid

- Too many bright colors
- Overuse of gradients
- Low-contrast text
- Tiny table text
- Heavy shadows everywhere
- Overly playful fitness-app styling
- Charts with many unrelated colors

---

## 2. Core UI Principles

### Tables are for exact values

Use tables when the user needs to inspect exact measurements, dates, historical values, imported rows, or user-specific measurement records.

### Cards are for current state

Use metric cards for the latest measurement, summary values, calculated differences, and current health/body indicators.

### Graphs are for trends

Use graphs to show how values change over time. Avoid putting too many body metrics into a single chart.

### Badges are for quick interpretation

Use badges for statuses like `Improved`, `Stable`, `High`, `Low`, `Healthy`, `Warning`, or `Invalid`.

---

## 3. Color System

The app must support both **light** and **dark** themes.

Use semantic tokens instead of hardcoding colors inside components.

---

## 4. Light Theme — Tanita Tech Blue

```css
:root,
[data-theme="light"] {
  color-scheme: light;

  --bg: #f6f9fc;
  --surface: #ffffff;
  --surface-muted: #eef4f8;
  --surface-raised: #ffffff;

  --text: #0f1f33;
  --text-muted: #64748b;
  --text-soft: #94a3b8;
  --text-inverted: #ffffff;

  --primary: #0ea5e9;
  --primary-hover: #0284c7;
  --primary-active: #0369a1;
  --primary-soft: #e0f2fe;
  --primary-border: #7dd3fc;

  --accent: #14b8a6;
  --accent-hover: #0d9488;
  --accent-soft: #ccfbf1;

  --success: #22c55e;
  --success-soft: #dcfce7;
  --success-text: #166534;

  --warning: #f59e0b;
  --warning-soft: #fef3c7;
  --warning-text: #92400e;

  --danger: #ef4444;
  --danger-soft: #fee2e2;
  --danger-text: #991b1b;

  --border: #d8e2ea;
  --border-strong: #b8c7d4;

  --table-header: #eef4f8;
  --table-row-hover: #f1f7fb;
  --table-row-selected: #e0f2fe;

  --chart-grid: #d8e2ea;
  --chart-axis: #94a3b8;

  --shadow-sm: 0 1px 2px rgba(15, 31, 51, 0.06);
  --shadow-md: 0 6px 20px rgba(15, 31, 51, 0.08);
}
```

---

## 5. Dark Theme — Tanita Tech Blue Dark

```css
[data-theme="dark"] {
  color-scheme: dark;

  --bg: #08111f;
  --surface: #0f1b2d;
  --surface-muted: #16263d;
  --surface-raised: #13243a;

  --text: #e5edf6;
  --text-muted: #94a3b8;
  --text-soft: #64748b;
  --text-inverted: #08111f;

  --primary: #38bdf8;
  --primary-hover: #0ea5e9;
  --primary-active: #0284c7;
  --primary-soft: #082f49;
  --primary-border: #075985;

  --accent: #2dd4bf;
  --accent-hover: #14b8a6;
  --accent-soft: #134e4a;

  --success: #4ade80;
  --success-soft: #14532d;
  --success-text: #bbf7d0;

  --warning: #fbbf24;
  --warning-soft: #422006;
  --warning-text: #fde68a;

  --danger: #f87171;
  --danger-soft: #450a0a;
  --danger-text: #fecaca;

  --border: #24364f;
  --border-strong: #39516f;

  --table-header: #16263d;
  --table-row-hover: #13233a;
  --table-row-selected: #082f49;

  --chart-grid: #24364f;
  --chart-axis: #64748b;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.28);
  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.35);
}
```

---

## 6. Chart Color Tokens

Use a limited and predictable palette for graphs.

```css
:root {
  --chart-weight: #0ea5e9;
  --chart-fat: #f97316;
  --chart-muscle: #14b8a6;
  --chart-water: #38bdf8;
  --chart-bmi: #8b5cf6;
  --chart-bone: #64748b;
  --chart-metabolic-age: #eab308;
}

[data-theme="dark"] {
  --chart-weight: #38bdf8;
  --chart-fat: #fb923c;
  --chart-muscle: #2dd4bf;
  --chart-water: #7dd3fc;
  --chart-bmi: #a78bfa;
  --chart-bone: #94a3b8;
  --chart-metabolic-age: #facc15;
}
```

### Recommended Metric-to-Color Mapping

| Metric | Color Token |
|---|---|
| Weight | `--chart-weight` |
| Body Fat % | `--chart-fat` |
| Muscle Mass | `--chart-muscle` |
| Body Water % | `--chart-water` |
| BMI | `--chart-bmi` |
| Bone Mass | `--chart-bone` |
| Metabolic Age | `--chart-metabolic-age` |

---

## 7. Typography

Use **Inter** as the primary font.

```css
:root {
  --font-sans: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

body {
  font-family: var(--font-sans);
}
```

### Numeric Alignment

For tables, metric cards, chart labels, and body measurements, enable tabular numbers.

```css
td,
.metric-value,
.chart-label,
.numeric {
  font-variant-numeric: tabular-nums;
}
```

### Font Scale

```css
:root {
  --font-xs: 12px;
  --font-sm: 14px;
  --font-md: 16px;
  --font-lg: 20px;
  --font-xl: 28px;
  --font-2xl: 36px;
}
```

### Typography Usage

| Usage | Size | Weight |
|---|---:|---:|
| Page title | `28px` | `700` |
| Section title | `20px` | `650` |
| Card title | `14px` | `650` |
| Body text | `16px` | `400` |
| Table body | `14px` | `400` |
| Table header | `12px` | `700` |
| Button text | `14px` | `600` |
| Metric value | `28px–36px` | `700–750` |
| Chart labels | `12px` | `500` |

---

## 8. Spacing and Radius

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-pill: 999px;
}
```

### Shape Rules

| Component | Radius |
|---|---:|
| Buttons | `10px–12px` |
| Inputs | `10px–12px` |
| Cards | `16px` |
| Tables | `14px–16px` |
| Badges | `999px` |
| Dialogs / panels | `20px` |

---

## 9. App Layout

Recommended primary layout:

```text
Header
├── App title
├── Import button
├── Export button
└── Settings button

User Tabs
├── User 1
├── User 2
└── User 3

Summary Metric Cards
├── Weight
├── Body Fat
├── Muscle Mass
└── BMI

Graph Area
└── Trend chart with metric tabs

Measurements Table
└── Full historical data
```

### Suggested Navigation

- Dashboard
- Measurements
- Trends
- Users
- Import History
- Settings

For the first version, a full sidebar may be unnecessary. A simple top header and user tabs are enough.

---

## 10. Buttons

### Base Button

```css
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 36px;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  transition:
    background-color 120ms ease,
    border-color 120ms ease,
    color 120ms ease,
    box-shadow 120ms ease,
    transform 80ms ease;
}

.button:active {
  transform: translateY(1px);
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
```

### Primary Button

Use for main actions: `Import`, `Choose Folder`, `Sync`, `Save`, `Export`.

```css
.button-primary {
  background: var(--primary);
  color: var(--text-inverted);
  border: 1px solid var(--primary-hover);
}

.button-primary:hover {
  background: var(--primary-hover);
}
```

### Secondary Button

Use for secondary actions: `Cancel`, `Reset Filters`, `View Details`, `Switch User`.

```css
.button-secondary {
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
}

.button-secondary:hover {
  background: var(--surface-muted);
  border-color: var(--border-strong);
}
```

### Ghost Button

Use for compact table actions or low-emphasis actions.

```css
.button-ghost {
  background: transparent;
  color: var(--primary);
  border: 1px solid transparent;
}

.button-ghost:hover {
  background: var(--primary-soft);
}
```

---

## 11. Tables

Tables are a primary UI element in this app. They should be compact, readable, and visually calm.

### Table Container

```css
.table-container {
  width: 100%;
  overflow: auto;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--surface);
  box-shadow: var(--shadow-sm);
}
```

### Table

```css
.table {
  width: 100%;
  min-width: 900px;
  border-collapse: separate;
  border-spacing: 0;
  background: var(--surface);
  font-size: 14px;
}

.table th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: var(--table-header);
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}

.table td {
  padding: 10px 12px;
  color: var(--text);
  border-bottom: 1px solid var(--border);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.table tr:hover td {
  background: var(--table-row-hover);
}

.table tr.is-selected td {
  background: var(--table-row-selected);
}

.table tr:last-child td {
  border-bottom: none;
}
```

### Recommended Measurement Table Columns

Start with:

| Column | Notes |
|---|---|
| Date | Measurement date/time |
| Weight | kg |
| Body Fat | percent |
| Muscle Mass | kg |
| Body Water | percent |
| BMI | calculated/indexed |
| Visceral Fat | score/index |
| Bone Mass | kg |
| Metabolic Age | years |
| Physique Rating | score/category |

### Table Rules

- Use horizontal scrolling for large measurement tables.
- Keep the date column visible if possible.
- Use sticky headers.
- Use `tabular-nums` for all numeric values.
- Align text left by default.
- Right-align numbers only if the table becomes dense and spreadsheet-like.
- Do not use heavy row borders.
- Prefer subtle row hover instead of strong outlines.

---

## 12. Metric Cards

Metric cards show the latest known state.

```css
.metric-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 16px;
  box-shadow: var(--shadow-sm);
}

.metric-label {
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 650;
}

.metric-value {
  margin-top: 8px;
  color: var(--text);
  font-size: 30px;
  font-weight: 750;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
}

.metric-unit {
  color: var(--text-muted);
  font-size: 14px;
  font-weight: 600;
}

.metric-delta {
  margin-top: 8px;
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 500;
}
```

### Recommended Cards

- Weight
- Body Fat %
- Muscle Mass
- BMI
- Body Water %
- Metabolic Age

Example:

```text
Weight
60.1 kg
↓ 0.4 kg from previous
```

---

## 13. Graphs

Graphs should be calm and easy to read.

### General Graph Rules

- Use one main metric per graph by default.
- Use tabs or toggles for switching metrics.
- Use maximum 2–3 lines in one graph.
- Do not show every body metric in one chart.
- Use subtle grid lines.
- Use tabular numbers in labels.
- Use tooltips for exact values.

### Recommended Graph Types

| Data | Graph Type |
|---|---|
| Weight over time | Line chart |
| Body fat over time | Line or area chart |
| Muscle mass over time | Line chart |
| Body water over time | Line chart |
| Multiple latest values | Metric cards |
| Metric comparison | Small multiples, not one crowded chart |

### Graph Styling

```css
.chart-panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 16px;
  box-shadow: var(--shadow-sm);
}

.chart-title {
  color: var(--text);
  font-size: 16px;
  font-weight: 700;
}

.chart-subtitle {
  color: var(--text-muted);
  font-size: 13px;
}
```

---

## 14. Icons

Use outline-style icons.

Recommended icon library:

- Lucide Icons
- Heroicons
- Phosphor Icons

### Icon Style

```css
.icon {
  width: 18px;
  height: 18px;
  stroke-width: 2;
  flex-shrink: 0;
}
```

### Icon Rules

- Use `18px` icons in buttons.
- Use `20px–24px` icons in cards.
- Use `16px` icons in dense tables.
- Prefer outline icons.
- Use rounded line caps where possible.
- Avoid mixing filled and outline icons unless the filled icon communicates status.

### Suggested Icons

| Feature | Icon Idea |
|---|---|
| Weight | Scale / weight |
| Body Composition | Human body / activity |
| Trends | Line chart / bar chart |
| Health | Heart pulse |
| Import | Folder open / upload |
| Export | Download |
| Bluetooth | Bluetooth |
| Users | Users |
| Settings | Cog |
| Calendar | Calendar days |
| Search | Magnifying glass |
| Filter | Funnel |

---

## 15. Badges

Use badges for compact status indicators.

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: 999px;
  padding: 3px 8px;
  font-size: 12px;
  font-weight: 650;
  line-height: 1.2;
}

.badge-good {
  background: var(--success-soft);
  color: var(--success-text);
}

.badge-warning {
  background: var(--warning-soft);
  color: var(--warning-text);
}

.badge-danger {
  background: var(--danger-soft);
  color: var(--danger-text);
}

.badge-info {
  background: var(--primary-soft);
  color: var(--primary);
}
```

### Suggested Badge Text

- Healthy
- Improved
- Stable
- High
- Low
- Warning
- Invalid
- Imported
- Synced

---

## 16. Inputs and Filters

```css
.input {
  min-height: 36px;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-size: 14px;
}

.input::placeholder {
  color: var(--text-soft);
}

.input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-soft);
}
```

Recommended filters for measurement tables:

- User
- Date range
- Metric type
- Search/import file
- Sort by latest/oldest

---

## 17. Tabs

User tabs should be simple and compact.

```css
.tabs {
  display: flex;
  gap: 8px;
  align-items: center;
  overflow-x: auto;
}

.tab {
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-muted);
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}

.tab:hover {
  background: var(--surface-muted);
  color: var(--text);
}

.tab.is-active {
  background: var(--primary-soft);
  color: var(--primary);
  border-color: var(--primary-border);
}
```

---

## 18. Scrollbars

Because the app will contain wide tables, scrollbars should be visible but not visually heavy.

```css
.scroll-area {
  scrollbar-width: thin;
  scrollbar-color: var(--border-strong) transparent;
}

.scroll-area::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.scroll-area::-webkit-scrollbar-track {
  background: transparent;
}

.scroll-area::-webkit-scrollbar-thumb {
  background: var(--border-strong);
  border-radius: 999px;
  border: 2px solid var(--surface);
}

.scroll-area::-webkit-scrollbar-thumb:hover {
  background: var(--text-soft);
}
```

For dense tables, reserve space for the scrollbar where possible so it does not cover the final row or final column.

---

## 19. Empty States

Empty states should explain what the user needs to do next.

Example:

```text
No measurements imported yet
Choose a Tanita GRAPHV1 folder to load your body composition history.
[Choose Folder]
```

Recommended empty-state icon:

- Scale + upload
- Folder + chart
- Bluetooth scale

---

## 20. App-Specific UI Recommendations

### Main Dashboard

Show:

1. Selected user
2. Latest measurement date
3. Summary metric cards
4. Main trend graph
5. Recent measurements table

### Measurements Page

Show:

1. Filters
2. Full measurements table
3. Export action
4. Row details drawer or expandable row

### Trends Page

Show:

1. Metric selector tabs
2. Line chart
3. Date range controls
4. Optional comparison against previous period

### Import Flow

Import button text should be explicit:

```text
Choose Tanita Folder
```

or

```text
Import GRAPHV1 Data
```

After import, show a small summary:

```text
Imported 124 measurements for 3 users.
Last measurement: 2026-05-20.
```

---

## 21. Accessibility Requirements

- Text should have strong contrast in both light and dark themes.
- Do not rely on color alone for statuses.
- Use icons or text labels with color-coded badges.
- Buttons must have visible hover, focus, disabled, and active states.
- Tables should remain readable at small sizes.
- Use at least `14px` for table body text.
- Use keyboard-focus styles for buttons, tabs, and inputs.

### Focus Ring

```css
:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px var(--primary-soft), 0 0 0 1px var(--primary);
}
```

---

## 22. Implementation Notes

### Theme Toggle

Use a `data-theme` attribute on the root element.

```html
<html data-theme="light">
```

or

```html
<html data-theme="dark">
```

### Component Rule

Components should only use semantic tokens:

Good:

```css
color: var(--text);
background: var(--surface);
border-color: var(--border);
```

Avoid:

```css
color: #0f1f33;
background: white;
```

### Recommended CSS File Structure

```text
styles/
├── tokens.css
├── base.css
├── buttons.css
├── tables.css
├── cards.css
├── forms.css
├── charts.css
└── utilities.css
```

---

## 23. Final Direction

Use this as the main design direction:

```text
Font: Inter
Main palette: Tanita Tech Blue
Themes: Light and Dark
Icons: Outline icons, Lucide-style
Tables: White/dark cards, compact rows, sticky headers, horizontal scrolling
Graphs: Blue/teal/orange with subtle grid lines
Buttons: Rounded, compact, clear states
Cards: Clean metric summaries with tabular numbers
```

The app should feel like a precise body-composition dashboard, not a generic spreadsheet.

