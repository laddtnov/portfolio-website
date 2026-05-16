import { emit, EVENTS } from "./events.js";

export function initProjects() {
  const projectTiles = [...document.querySelectorAll(".project-tile")];
  const grid = document.querySelector(".projects-grid");
  const filterButtons = [...document.querySelectorAll(".filter-btn")];
  const sortSelect = document.querySelector("#project-sort");
  const projectModal = document.querySelector("#project-modal");
  const modalClose = projectModal?.querySelector(".project-modal-close");
  const modalTitle = projectModal?.querySelector("#project-modal-title");
  const modalTech = projectModal?.querySelector("#project-modal-tech");
  const modalDesc = projectModal?.querySelector("#project-modal-desc");
  const modalSummary = projectModal?.querySelector("#project-modal-summary");
  const modalLink = projectModal?.querySelector("#project-modal-link");

  if (!projectTiles.length || !grid) {
    return;
  }

  const getProjectData = (tile) => ({
    tile,
    title: tile.querySelector("h3")?.textContent?.trim() ?? "Unknown Project",
    tech: tile.querySelector(".project-tech")?.textContent?.trim() ?? "",
    desc: tile.querySelector(".project-desc")?.textContent?.trim() ?? "",
    summary: tile.dataset.summary ?? "",
    categories: (tile.dataset.category ?? "")
      .split(" ")
      .map((item) => item.trim())
      .filter(Boolean),
    year: Number(tile.dataset.year ?? 0),
    url:
      tile.querySelector(".project-visit-btn")?.getAttribute("href") ??
      "#",
  });

  let activeFilter = "all";

  const applyFilter = () => {
    projectTiles.forEach((tile) => {
      const categories = (tile.dataset.category ?? "").split(" ");
      const visible =
        activeFilter === "all" || categories.includes(activeFilter);
      tile.hidden = !visible;
    });
    emit(EVENTS.PROJECT_FILTER_CHANGED, { filter: activeFilter });
  };

  const applySort = () => {
    const sortBy = sortSelect?.value ?? "newest";
    const sorted = [...projectTiles].sort((a, b) => {
      const aName = a.querySelector("h3")?.textContent?.trim() ?? "";
      const bName = b.querySelector("h3")?.textContent?.trim() ?? "";
      const aYear = Number(a.dataset.year ?? 0);
      const bYear = Number(b.dataset.year ?? 0);

      if (sortBy === "name") {
        return aName.localeCompare(bName);
      }
      if (sortBy === "oldest") {
        return aYear - bYear || aName.localeCompare(bName);
      }
      return bYear - aYear || aName.localeCompare(bName);
    });

    sorted.forEach((tile) => grid.appendChild(tile));
    emit(EVENTS.PROJECT_SORT_CHANGED, { sortBy });
  };

  const openModal = (project) => {
    if (!projectModal || !modalTitle || !modalTech || !modalDesc || !modalSummary || !modalLink) {
      return;
    }

    modalTitle.textContent = project.title;
    modalTech.textContent = project.tech;
    modalDesc.textContent = project.desc;
    modalSummary.textContent = project.summary;
    modalLink.href = project.url;

    if (typeof projectModal.showModal === "function") {
      projectModal.showModal();
    } else {
      projectModal.setAttribute("open", "true");
    }

    emit(EVENTS.PROJECT_MODAL_OPENED, { projectName: project.title, href: project.url });
  };

  const closeModal = () => {
    if (!projectModal?.open) {
      return;
    }

    if (typeof projectModal.close === "function") {
      projectModal.close();
    } else {
      projectModal.removeAttribute("open");
    }

    emit(EVENTS.PROJECT_MODAL_CLOSED, {});
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter ?? "all";
      filterButtons.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      applyFilter();
    });
  });

  sortSelect?.addEventListener("change", applySort);

  modalClose?.addEventListener("click", closeModal);
  projectModal?.addEventListener("cancel", () => {
    emit(EVENTS.PROJECT_MODAL_CLOSED, {});
  });
  projectModal?.addEventListener("click", (event) => {
    const rect = projectModal.getBoundingClientRect();
    const clickedOutside =
      event.clientY < rect.top ||
      event.clientY > rect.bottom ||
      event.clientX < rect.left ||
      event.clientX > rect.right;

    if (clickedOutside) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && projectModal?.open) {
      closeModal();
    }
  });

  projectTiles.forEach((tile) => {
    const project = getProjectData(tile);
    tile.addEventListener("focusin", () => {
      emit(EVENTS.PROJECT_FOCUSED, { projectName: project.title, href: project.url });
    });

    tile.querySelector(".project-visit-btn")?.addEventListener("click", () => {
      emit(EVENTS.PROJECT_OPENED, { projectName: project.title, href: project.url });
    });

    tile.querySelector(".project-inspect-btn")?.addEventListener("click", () => {
      openModal(project);
    });
  });

  applySort();
  applyFilter();
}
