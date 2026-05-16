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
