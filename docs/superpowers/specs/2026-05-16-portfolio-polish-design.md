# Portfolio Polish & Enhancement — Design Spec
**Date:** 2026-05-16
**Approach:** Option A — Recruiter-first, visual second (two-phase release)

---

## Goals

- Improve recruiter conversion: hero CTA + impact metrics visible without interaction
- Polish content for clarity (GEA776 desc, tech tags, project titles)
- Add cyberpunk settings panel: CRT intensity + manual motion toggle
- Wire lightweight analytics into the existing event bus
- QA filter/sort/modal on mobile + desktop + Safari

---

## Phase 1 — Recruiter-facing (ship first)

### 1.1 Hero CTA

Add two buttons below `.welcome-tagline` in `#welcome-section`, above `.scroll-indicator`:

```html
<div class="hero-cta">
  <a href="#projects" class="hero-cta-btn hero-cta-primary">[ VIEW PROJECTS ]</a>
  <a href="#contact" class="hero-cta-btn hero-cta-secondary">[ CONTACT ]</a>
</div>
```

- Primary: neon cyan fill, glow on hover. Reuses `--color-cyan` variable.
- Secondary: outlined, cyber pink hover. Reuses `--color-pink` variable.
- Both are plain scroll anchors — no JS required.
- CSS lives in `css/welcome.css`.

### 1.2 Impact metrics

Each `<article class="project-tile">` gets a `data-metrics` attribute and a visible `.project-metrics` `<p>` tag between `.project-tech` and `.project-desc`.

| Project | Metrics line |
|---|---|
| Solar System | `9 planets · Web Audio API · 60fps` |
| Libra | `LocalStorage sync · Progress tracking` |
| Breach OS | `6 missions · 120+ card pairs` |
| Breach Engine | `PWA installable · 5 rank tiers` |
| GEA776 | `CSS-only animations · No frameworks` |
| Glass Chess | `Full chess rules · Touch support` |

Styling: smaller font, muted cyan color, `Share Tech Mono` font to match cyberpunk aesthetic. CSS in `css/projects.css`.

### 1.3 Content polish

Three targeted rewrites in `index.html`:

- **GEA776 desc** → `"Modular frontend experiment showcasing layout, animation, and creative CSS systems"` — replaces the generic placeholder copy.
- **Breach OS tech tags** → append `· LocalStorage · Mission System` — shows state management awareness to recruiters.
- **Breach Engine h3** → shorten to `"Breach Engine"` — current long title breaks grid layout on mobile.

---

## Phase 2 — Visual/developer-facing

### 2.1 Floating cyberpunk settings panel

**HTML:** A `<div class="settings-panel">` fixed to bottom-right corner. Contains a toggle button (`⚙`) and a panel with two control groups.

**Structure:**
```html
<div class="settings-panel" id="settings-panel">
  <button class="settings-toggle" aria-label="Toggle system settings" aria-expanded="false">⚙</button>
  <div class="settings-content" hidden>
    <p class="settings-label">[ SYSTEM SETTINGS ]</p>
    <div class="settings-group">
      <span class="settings-group-label">CRT</span>
      <div class="settings-options" role="group" aria-label="CRT intensity">
        <button data-setting="crt" data-value="0" class="setting-btn is-active">OFF</button>
        <button data-setting="crt" data-value="0.4" class="setting-btn">LOW</button>
        <button data-setting="crt" data-value="1" class="setting-btn">HIGH</button>
      </div>
    </div>
    <div class="settings-group">
      <span class="settings-group-label">MOTION</span>
      <div class="settings-options" role="group" aria-label="Motion intensity">
        <button data-setting="motion" data-value="full" class="setting-btn is-active">FULL</button>
        <button data-setting="motion" data-value="reduced" class="setting-btn">LOW</button>
        <button data-setting="motion" data-value="off" class="setting-btn">OFF</button>
      </div>
    </div>
  </div>
</div>
```

**JS — `js/settings.js` (new module):**
- On load: reads `localStorage` for `crt` and `motion` values, applies them.
- CRT: sets `document.documentElement.style.setProperty('--crt-intensity', value)`.
- Motion: writes `document.body.dataset.motion = value` and fires `EVENTS.MOTION_CHANGED`.
- Panel open/close: toggles `hidden` on `.settings-content` and `aria-expanded` on the button.
- Click outside: closes panel.
- Wired into `main.js` via `import { initSettings } from './settings.js'`.

**CSS — `css/components.css`:**
- Fixed position: `bottom: 1.5rem; right: 1.5rem; z-index: 200`.
- Toggle button: neon cyan border, glow pulse animation, same aesthetic as `.contact-btn`.
- Panel: terminal-dark background, neon cyan borders, `Share Tech Mono` font.
- Active setting button: cyan fill. Inactive: outlined.
- Panel opens upward (`flex-direction: column-reverse` or transform from bottom).

### 2.2 Analytics module

**JS — `js/analytics.js` (new module):**

Subscribes to the event bus. No changes to any existing module.

```js
// Tracked events
on(EVENTS.PROJECT_OPENED,       ({ projectName }) => record('project_opened', { projectName }))
on(EVENTS.PROJECT_MODAL_OPENED, ({ projectName }) => record('modal_opened',   { projectName }))
on(EVENTS.NAV_SECTION_CHANGED,  ({ sectionId })   => record('section_viewed', { sectionId }))
```

Plus one direct DOM listener for contact link clicks (not on the event bus):
```js
document.querySelectorAll('#contact .contact-btn').forEach(btn =>
  btn.addEventListener('click', () => record('contact_clicked', { href: btn.href }))
)
```

**`record(type, data)` function:**
- Reads `localStorage.getItem('_analytics')`, parses JSON (default `[]`).
- Appends `{ type, data, ts: Date.now() }`.
- Caps array at 200 entries (drops oldest).
- Writes back to `localStorage`.

**Reading analytics:** `JSON.parse(localStorage.getItem('_analytics'))` in DevTools console.

Wired into `main.js` via `import { initAnalytics } from './analytics.js'`.

---

## QA Checklist

These are test gates, not code changes. Run after both phases are live.

- [ ] Filter buttons (ALL / GAMES / TOOLS / EXPERIMENTS) hide/show correct cards on Chrome desktop
- [ ] Sort select (Newest / Oldest / Name A–Z) reorders grid correctly
- [ ] Inspect button opens modal with correct project data
- [ ] Modal closes on: ✕ button, Escape key, backdrop click
- [ ] All of the above on iOS Safari (dialog fallback path — `setAttribute("open")`)
- [ ] All of the above at 375px viewport width
- [ ] Settings panel opens/closes on mobile without layout overflow
- [ ] Motion toggle: `data-motion="off"` stops CSS animations
- [ ] CRT toggle: `--crt-intensity: 1` visibly adds scanline effect
- [ ] OS `prefers-reduced-motion` still respected when motion toggle is "FULL"

---

## Files changed

**Phase 1:**
- `index.html` — hero CTA markup, metrics lines, content rewrites
- `css/welcome.css` — `.hero-cta` button styles
- `css/projects.css` — `.project-metrics` styles

**Phase 2:**
- `index.html` — settings panel markup
- `js/settings.js` — new module (CRT + motion toggles, localStorage persistence)
- `js/analytics.js` — new module (event bus subscriptions, localStorage recording)
- `js/main.js` — import and call `initSettings()` and `initAnalytics()`
- `css/components.css` — settings panel styles

---

## Out of scope

- Backend analytics dashboard
- Third-party analytics scripts
- New project cards (content only, no new projects)
- Redesign of existing sections
