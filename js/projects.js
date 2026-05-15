import { emit, EVENTS } from "./events.js";

export function initProjects() {
  const projectTiles = [...document.querySelectorAll(".project-tile")];

  projectTiles.forEach((tile) => {
    const projectName =
      tile.querySelector("h3")?.textContent?.trim() ?? "Unknown Project";

    tile.addEventListener("focusin", () => {
      emit(EVENTS.PROJECT_FOCUSED, { projectName, href: tile.href });
    });

    tile.addEventListener("click", () => {
      emit(EVENTS.PROJECT_OPENED, { projectName, href: tile.href });
    });
  });
}
