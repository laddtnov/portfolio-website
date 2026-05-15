const bus = new EventTarget();

export const EVENTS = {
  MOTION_CHANGED: "app:motion-changed",
  NAV_SECTION_CHANGED: "app:nav-section-changed",
  PROJECT_FOCUSED: "app:project-focused",
  PROJECT_OPENED: "app:project-opened",
};

export function emit(type, detail = {}) {
  bus.dispatchEvent(new CustomEvent(type, { detail }));
}

export function on(type, handler) {
  const wrapped = (event) => handler(event.detail, event);
  bus.addEventListener(type, wrapped);
  return () => bus.removeEventListener(type, wrapped);
}
