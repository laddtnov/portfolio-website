const bus = new EventTarget();

export const EVENTS = {
  MOTION_CHANGED: "app:motion-changed",
  NAV_SECTION_CHANGED: "app:nav-section-changed",
  PROJECT_FOCUSED: "app:project-focused",
  PROJECT_OPENED: "app:project-opened",
  PROJECT_FILTER_CHANGED: "app:project-filter-changed",
  PROJECT_SORT_CHANGED: "app:project-sort-changed",
  PROJECT_MODAL_OPENED: "app:project-modal-opened",
  PROJECT_MODAL_CLOSED: "app:project-modal-closed",
};

export function emit(type, detail = {}) {
  bus.dispatchEvent(new CustomEvent(type, { detail }));
}

export function on(type, handler) {
  const wrapped = (event) => handler(event.detail, event);
  bus.addEventListener(type, wrapped);
  return () => bus.removeEventListener(type, wrapped);
}
