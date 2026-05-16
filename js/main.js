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

}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
