# Portfolio Polish & Enhancement — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship recruiter-facing polish (hero CTA + impact metrics + content rewrites) then cyberpunk settings panel (CRT + motion toggles) and lightweight analytics via the existing event bus.

**Architecture:** Phase 1 is pure HTML/CSS — no JS changes. Phase 2 adds two new ES modules (`settings.js`, `analytics.js`) wired into the existing `main.js` entry point. All state persists via `localStorage`.

**Tech Stack:** Vanilla HTML5, CSS3 (custom properties), ES Modules (no bundler), EventTarget-based event bus.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `index.html` | Modify | Hero CTA markup, metrics lines, content rewrites, settings panel markup |
| `css/welcome.css` | Modify | `.hero-cta` button styles |
| `css/projects.css` | Modify | `.project-metrics` styles |
| `css/components.css` | Modify | Settings panel styles, CRT overlay |
| `css/base.css` | Modify | `--crt-intensity` CSS variable, CRT pseudo-element on `body` |
| `js/settings.js` | Create | CRT + motion toggle logic, localStorage persistence |
| `js/analytics.js` | Create | Event bus subscriptions, localStorage recording |
| `js/main.js` | Modify | Import and call `initSettings()` and `initAnalytics()` |

---

## Task 1: Sync worktree with latest remote

The worktree may be behind `origin/main`. Pull latest before touching any files.

- [ ] **Step 1: Fetch and check status**

```bash
git fetch origin
git status
git log --oneline origin/main -5
```

Expected: shows any commits on remote that aren't local.

- [ ] **Step 2: Merge if behind**

If remote is ahead, merge it:

```bash
git merge origin/main
```

Expected: Fast-forward or clean merge. If conflicts arise in `index.html`, keep the remote version (it has the JS-linked HTML) and re-apply only the chess link change (`https://glass-chess.bynov.one/`).

- [ ] **Step 3: Verify JS files exist locally**

```bash
ls js/
```

Expected output:
```
analytics.js  events.js  main.js  motion.js  projects.js  settings.js  ui.js
```

If `js/` is missing entirely, the remote HTML has it but local doesn't — run `git checkout origin/main -- js/` to pull just that directory.

---

## Task 2: Hero CTA — markup

Add two CTA buttons to `#welcome-section` in `index.html`, below `.welcome-tagline` and above `.scroll-indicator`.

- [ ] **Step 1: Add hero CTA HTML**

In `index.html`, find the `.welcome-tagline` paragraph and insert the `.hero-cta` div immediately after it:

```html
      <p class="welcome-tagline">Building the future, one line of code at a time</p>
      <div class="hero-cta">
        <a href="#projects" class="hero-cta-btn hero-cta-primary">[ VIEW PROJECTS ]</a>
        <a href="#contact" class="hero-cta-btn hero-cta-secondary">[ CONTACT ]</a>
      </div>
      <div class="scroll-indicator" aria-hidden="true">
```

- [ ] **Step 2: Verify in browser**

Open `index.html` in a browser. Two unstyled links should appear below the tagline. Scroll anchors should work.

---

## Task 3: Hero CTA — styles

Add `.hero-cta` styles to `css/welcome.css`.

- [ ] **Step 1: Append to `css/welcome.css`**

Add at the end of the file:

```css
.hero-cta {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2.5rem;
  opacity: 0;
  animation: fadeInUp 1s ease forwards 1.4s;
}

.hero-cta-btn {
  font-family: 'Orbitron', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 0.75rem 2rem;
  border: 2px solid var(--neon-cyan);
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.hero-cta-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--neon-cyan);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
  z-index: -1;
}

.hero-cta-btn:hover::before {
  transform: scaleX(1);
}

.hero-cta-primary {
  color: var(--neon-cyan);
}

.hero-cta-primary:hover {
  color: #000;
  box-shadow: 0 0 25px rgba(0, 242, 255, 0.6);
}

.hero-cta-secondary {
  color: var(--neon-pink);
  border-color: var(--neon-pink);
}

.hero-cta-secondary::before {
  background: var(--neon-pink);
}

.hero-cta-secondary:hover {
  color: #000;
  box-shadow: 0 0 25px rgba(255, 0, 255, 0.6);
}
```

- [ ] **Step 2: Verify in browser**

Two glowing buttons appear below the tagline, animate in with the rest of the hero content. Hover fills the button. Both scroll correctly.

- [ ] **Step 3: Commit**

```bash
git add index.html css/welcome.css
git commit -m "feat: add hero CTA buttons to welcome section"
```

---

## Task 4: Impact metrics — markup

Add a `.project-metrics` line to each project tile in `index.html`.

- [ ] **Step 1: Update each project tile**

For each `<article class="project-tile">`, insert a `<p class="project-metrics">` after `.project-tech` and before `.project-desc`. The complete updated `project-info` blocks for each project:

**Solar System:**
```html
          <h3>Solar System</h3>
          <p class="project-tech">CSS Animations • Fallout Terminal • Web Audio API</p>
          <p class="project-metrics">9 planets · Web Audio API · 60fps</p>
          <p class="project-desc">3D solar system with Fallout 3-style terminal and typewriter sounds</p>
```

**Libra:**
```html
          <h3>Libra</h3>
          <p class="project-tech">Neon Design • Fallout Terminal • Progress Tracking</p>
          <p class="project-metrics">LocalStorage sync · Progress tracking</p>
          <p class="project-desc">Futuristic book tracking with terminal interface and sound effects</p>
```

**Breach OS:**
```html
          <h3>Breach OS</h3>
          <p class="project-tech">JavaScript • CSS Animations • LocalStorage • Mission System</p>
          <p class="project-metrics">6 missions · 120+ card pairs</p>
          <p class="project-desc">Cyberpunk-themed memory card game with missions and neon effects</p>
```

**Breach Engine:**
```html
          <h3>Breach Engine</h3>
          <p class="project-tech">JavaScript • PWA • Steampunk Design</p>
          <p class="project-metrics">PWA installable · 5 rank tiers</p>
          <p class="project-desc">Steampunk-themed Sudoku with rank system, survival mode and nixie tube UI</p>
```

**GEA776:**
```html
          <h3>GEA776 Project</h3>
          <p class="project-tech">Creative Design • Modern Web • Interactive</p>
          <p class="project-metrics">CSS-only animations · No frameworks</p>
          <p class="project-desc">Modular frontend experiment showcasing layout, animation, and creative CSS systems</p>
```

**Glass Chess:**
```html
          <h3>Glass Chess</h3>
          <p class="project-tech">JavaScript • CSS Glassmorphism • Game Logic</p>
          <p class="project-metrics">Full chess rules · Touch support</p>
          <p class="project-desc">Elegant glass-themed chess game with smooth animations</p>
```

---

## Task 5: Impact metrics — styles

Add `.project-metrics` styles to `css/projects.css`.

- [ ] **Step 1: Append to `css/projects.css`**

```css
.project-metrics {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.78rem;
  color: rgba(0, 242, 255, 0.6);
  margin-bottom: 10px;
  letter-spacing: 0.04em;
}
```

- [ ] **Step 2: Verify in browser**

Each project card shows a small muted-cyan metrics line between the tech tags and description.

- [ ] **Step 3: Commit**

```bash
git add index.html css/projects.css
git commit -m "feat: add impact metrics and content polish to project cards"
```

---

## Task 6: CRT variable and overlay

Add the `--crt-intensity` CSS variable and a CRT scanline pseudo-element to `css/base.css`. This gives the settings panel something to control.

- [ ] **Step 1: Add variable to `:root` in `css/base.css`**

Update the `:root` block (currently ends at `--text-gray`):

```css
:root {
  --neon-cyan: #00f2ff;
  --neon-pink: #ff00ff;
  --neon-purple: #9d00ff;
  --dark-bg: #0a0a0c;
  --dark-card: #151518;
  --text-gray: #d1d1d1;
  --crt-intensity: 0;
}
```

- [ ] **Step 2: Add CRT overlay pseudo-element**

Append at the end of `css/base.css`:

```css
body::after {
  content: '';
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.15) 2px,
    rgba(0, 0, 0, 0.15) 4px
  );
  opacity: var(--crt-intensity);
  pointer-events: none;
  z-index: 9998;
  transition: opacity 0.4s ease;
}
```

- [ ] **Step 3: Verify CRT effect**

In DevTools console run:
```js
document.documentElement.style.setProperty('--crt-intensity', '1')
```
Expected: visible horizontal scanlines across the page. Run with `'0'` to remove.

---

## Task 7: Settings panel — markup

Add the settings panel HTML to `index.html`, just before the closing `</body>` tag (before the `<script>` tag).

- [ ] **Step 1: Add settings panel HTML**

```html
  <div class="settings-panel" id="settings-panel">
    <button
      class="settings-toggle"
      id="settings-toggle"
      type="button"
      aria-label="Toggle system settings"
      aria-expanded="false"
      aria-controls="settings-content"
    >⚙</button>
    <div class="settings-content" id="settings-content" hidden>
      <p class="settings-label">[ SYSTEM SETTINGS ]</p>
      <div class="settings-group">
        <span class="settings-group-label">CRT</span>
        <div class="settings-options" role="group" aria-label="CRT intensity">
          <button type="button" class="setting-btn is-active" data-setting="crt" data-value="0">OFF</button>
          <button type="button" class="setting-btn" data-setting="crt" data-value="0.4">LOW</button>
          <button type="button" class="setting-btn" data-setting="crt" data-value="1">HIGH</button>
        </div>
      </div>
      <div class="settings-group">
        <span class="settings-group-label">MOTION</span>
        <div class="settings-options" role="group" aria-label="Motion intensity">
          <button type="button" class="setting-btn is-active" data-setting="motion" data-value="full">FULL</button>
          <button type="button" class="setting-btn" data-setting="motion" data-value="reduced">LOW</button>
          <button type="button" class="setting-btn" data-setting="motion" data-value="off">OFF</button>
        </div>
      </div>
    </div>
  </div>
  <script type="module" src="js/main.js"></script>
```

---

## Task 8: Settings panel — styles

Add all settings panel CSS to `css/components.css`.

- [ ] **Step 1: Append to `css/components.css`**

```css
/* Settings Panel */
.settings-panel {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 200;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.settings-toggle {
  width: 2.75rem;
  height: 2.75rem;
  background: var(--dark-card);
  border: 2px solid var(--neon-cyan);
  color: var(--neon-cyan);
  font-size: 1.25rem;
  cursor: pointer;
  border-radius: 4px;
  box-shadow: 0 0 12px rgba(0, 242, 255, 0.35);
  transition: box-shadow 0.3s ease, transform 0.2s ease;
}

.settings-toggle:hover {
  box-shadow: 0 0 24px rgba(0, 242, 255, 0.7);
  transform: scale(1.08);
}

.settings-toggle[aria-expanded="true"] {
  color: var(--neon-pink);
  border-color: var(--neon-pink);
  box-shadow: 0 0 16px rgba(255, 0, 255, 0.5);
}

.settings-content {
  background: var(--dark-card);
  border: 2px solid var(--neon-cyan);
  padding: 1rem 1.25rem;
  min-width: 180px;
  box-shadow: 0 0 24px rgba(0, 242, 255, 0.2);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.settings-content[hidden] {
  display: none;
}

.settings-label {
  font-family: 'Orbitron', sans-serif;
  font-size: 0.65rem;
  color: var(--neon-cyan);
  letter-spacing: 0.08em;
  margin-bottom: 0.25rem;
}

.settings-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.settings-group-label {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.7rem;
  color: var(--text-gray);
  letter-spacing: 0.1em;
}

.settings-options {
  display: flex;
  gap: 0.35rem;
}

.setting-btn {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.65rem;
  padding: 0.25rem 0.6rem;
  background: transparent;
  border: 1px solid rgba(0, 242, 255, 0.3);
  color: var(--text-gray);
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.2s ease;
  letter-spacing: 0.05em;
}

.setting-btn:hover {
  border-color: var(--neon-cyan);
  color: var(--neon-cyan);
}

.setting-btn.is-active {
  background: var(--neon-cyan);
  border-color: var(--neon-cyan);
  color: #000;
  font-weight: bold;
}
```

- [ ] **Step 2: Verify panel renders**

Open in browser. The ⚙ button is visible in the bottom-right. Clicking it should show/hide the panel (JS not wired yet — test visually by temporarily removing `hidden` attribute).

---

## Task 9: `js/settings.js` — new module

Create the settings module. Handles panel open/close, CRT and motion toggle logic, and localStorage persistence.

- [ ] **Step 1: Create `js/settings.js`**

```js
import { emit, EVENTS } from './events.js';

const STORAGE_KEY = '_settings';

const defaults = { crt: '0', motion: 'full' };

function load() {
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) };
  } catch {
    return { ...defaults };
  }
}

function save(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function applyCrt(value) {
  document.documentElement.style.setProperty('--crt-intensity', value);
}

function applyMotion(value) {
  document.body.dataset.motion = value;
  emit(EVENTS.MOTION_CHANGED, { reduced: value !== 'full' });
}

function syncButtons(panel, state) {
  panel.querySelectorAll('.setting-btn').forEach((btn) => {
    const active =
      btn.dataset.setting === 'crt'
        ? btn.dataset.value === state.crt
        : btn.dataset.value === state.motion;
    btn.classList.toggle('is-active', active);
  });
}

export function initSettings() {
  const panel = document.getElementById('settings-panel');
  const toggle = document.getElementById('settings-toggle');
  const content = document.getElementById('settings-content');

  if (!panel || !toggle || !content) return;

  const state = load();
  applyCrt(state.crt);
  applyMotion(state.motion);
  syncButtons(panel, state);

  toggle.addEventListener('click', () => {
    const open = content.hidden;
    content.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
  });

  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && !content.hidden) {
      content.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  panel.addEventListener('click', (e) => {
    const btn = e.target.closest('.setting-btn');
    if (!btn) return;

    const { setting, value } = btn.dataset;
    if (setting === 'crt') {
      state.crt = value;
      applyCrt(value);
    } else if (setting === 'motion') {
      state.motion = value;
      applyMotion(value);
    }

    save(state);
    syncButtons(panel, state);
  });
}
```

- [ ] **Step 2: Verify module is valid**

```bash
node --input-type=module < js/settings.js 2>&1 | head -5
```

Expected: no syntax errors (will throw a DOM error since `document` doesn't exist in Node — that's fine, just check for syntax errors specifically).

---

## Task 10: `js/analytics.js` — new module

Create the analytics module. Listens to the event bus and records events to `localStorage`.

- [ ] **Step 1: Create `js/analytics.js`**

```js
import { on, EVENTS } from './events.js';

const STORAGE_KEY = '_analytics';
const MAX_ENTRIES = 200;

function record(type, data = {}) {
  let entries = [];
  try {
    entries = JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    entries = [];
  }
  entries.push({ type, data, ts: Date.now() });
  if (entries.length > MAX_ENTRIES) {
    entries = entries.slice(entries.length - MAX_ENTRIES);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function initAnalytics() {
  on(EVENTS.PROJECT_OPENED, ({ projectName, href }) =>
    record('project_opened', { projectName, href })
  );

  on(EVENTS.PROJECT_MODAL_OPENED, ({ projectName, href }) =>
    record('modal_opened', { projectName, href })
  );

  on(EVENTS.NAV_SECTION_CHANGED, ({ sectionId }) =>
    record('section_viewed', { sectionId })
  );

  document.querySelectorAll('#contact .contact-btn').forEach((btn) => {
    btn.addEventListener('click', () =>
      record('contact_clicked', { href: btn.getAttribute('href') ?? '' })
    );
  });

  record('page_loaded', { referrer: document.referrer, path: location.pathname });
}
```

- [ ] **Step 2: Verify module is valid**

```bash
node --input-type=module < js/analytics.js 2>&1 | head -5
```

Expected: no syntax errors.

---

## Task 11: Wire modules into `js/main.js`

Add `initSettings` and `initAnalytics` imports and calls to the existing `main.js`.

- [ ] **Step 1: Update `js/main.js`**

Replace the current content with:

```js
import { initMotionPreferences } from './motion.js';
import { initUI } from './ui.js';
import { initProjects } from './projects.js';
import { initSettings } from './settings.js';
import { initAnalytics } from './analytics.js';
import { on, EVENTS } from './events.js';

function init() {
  initMotionPreferences();
  initUI();
  initProjects();
  initSettings();
  initAnalytics();

  on(EVENTS.NAV_SECTION_CHANGED, ({ sectionId }) => {
    document.body.dataset.activeSection = sectionId;
  });

  on(EVENTS.MOTION_CHANGED, ({ reduced }) => {
    document.body.dataset.motion = reduced ? 'reduced' : 'full';
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
```

- [ ] **Step 2: Open in browser and verify no console errors**

Open DevTools → Console. Load `index.html`. Expected: no errors. Settings panel opens/closes, toggles apply CRT and motion effects, preferences survive page reload.

- [ ] **Step 3: Verify analytics recording**

In DevTools console:
```js
JSON.parse(localStorage.getItem('_analytics'))
```
Expected: array with at least one `page_loaded` entry.

Click a project's "Visit" button. Re-run the command. Expected: a `project_opened` entry appears.

- [ ] **Step 4: Commit Phase 2**

```bash
git add index.html css/base.css css/components.css js/settings.js js/analytics.js js/main.js
git commit -m "feat: add settings panel (CRT/motion toggles) and analytics module"
```

---

## Task 12: QA checklist

Run through each item manually. No code changes — just verification gates.

- [ ] Filter buttons (ALL / GAMES / TOOLS / EXPERIMENTS) hide/show correct cards — Chrome desktop
- [ ] Sort select (Newest / Oldest / Name A–Z) reorders grid correctly — Chrome desktop
- [ ] Inspect button opens modal with correct title, tech, desc, and summary — Chrome desktop
- [ ] Modal closes on: ✕ button click, Escape key, backdrop click outside dialog
- [ ] All of the above on iOS Safari (uses `setAttribute("open")` fallback in `projects.js`)
- [ ] All of the above at 375px viewport width
- [ ] Settings panel opens/closes without overflowing screen on 375px
- [ ] CRT HIGH applies visible scanlines; OFF removes them
- [ ] Motion OFF disables CSS animations (`body[data-motion="off"]` CSS rules apply)
- [ ] OS `prefers-reduced-motion` still triggers `reduced-motion` class via `motion.js` regardless of manual toggle

---

## Task 13: Push to main

- [ ] **Step 1: Push**

```bash
git push origin HEAD:main
```

Expected: clean push, no conflicts.
