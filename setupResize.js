export function setupResize(state, sidebar) {
  sidebar.addEventListener("pointerdown", resizePanel);

  function resizePanel(e) {
    if (!e.target.classList.contains("resize-bar")) return;

    e.preventDefault();

    window.getSelection
      ? window.getSelection().removeAllRanges()
      : document.selection.empty();

    state.resizing = true;

    const elToResize = document.getElementById(e.target.dataset.resize);
    const resizeDir = e.target.dataset.resizedir;

    const moveListener = (e) => {
      if (resizeDir === "ns") {
        elToResize.style.height = `${elToResize.offsetHeight - e.movementY}px`;
      } else if (resizeDir === "ew") {
        elToResize.style.width = `${e.clientX}px`;
      }
    };
    const stopResize = (e) => {
      window.removeEventListener("pointermove", moveListener);
      state.resizing = false;
    };

    window.addEventListener("pointermove", moveListener);
    window.addEventListener("pointerup", stopResize);
  }
}
