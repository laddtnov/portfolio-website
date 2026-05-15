import { emit, EVENTS } from "./events.js";

export function initMotionPreferences() {
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  const applyMotionPreference = () => {
    const reduced = motionQuery.matches;
    document.body.classList.toggle("reduced-motion", reduced);
    emit(EVENTS.MOTION_CHANGED, { reduced });
  };

  applyMotionPreference();

  if (typeof motionQuery.addEventListener === "function") {
    motionQuery.addEventListener("change", applyMotionPreference);
  } else {
    motionQuery.addListener(applyMotionPreference);
  }
}
