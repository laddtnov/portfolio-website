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
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // private mode or quota exceeded
  }
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
