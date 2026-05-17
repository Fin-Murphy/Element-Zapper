(() => {
  let active = false;
  let hovered = null;
  let overlay = null;
  let prevCursor = "";

  function ensureOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement("div");
    overlay.className = "__zap-overlay";
    return overlay;
  }

  function positionOverlay(el) {
    const rect = el.getBoundingClientRect();
    overlay.style.display = "block";
    overlay.style.top = rect.top + "px";
    overlay.style.left = rect.left + "px";
    overlay.style.width = rect.width + "px";
    overlay.style.height = rect.height + "px";
  }

  function onMouseMove(e) {
    const target = document.elementFromPoint(e.clientX, e.clientY);
    if (!target || target === overlay) return;
    if (target === document.documentElement || target === document.body) {
      hovered = null;
      overlay.style.display = "none";
      return;
    }
    hovered = target;
    positionOverlay(target);
  }

  function onContextMenu(e) {
    e.preventDefault();
    e.stopPropagation();
    disable();
  }

  function onClick(e) {
    e.preventDefault();
    e.stopPropagation();
    const victim = hovered;
    disable();
    if (victim && victim.parentNode) victim.remove();
  }

  function onKeyDown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      disable();
    }
  }

  function enable() {
    if (active) return;
    active = true;
    ensureOverlay();
    if (!overlay.isConnected) {
      (document.body || document.documentElement).appendChild(overlay);
    }
    overlay.style.display = "none";
    prevCursor = document.documentElement.style.cursor;
    document.documentElement.style.cursor = "crosshair";
    document.addEventListener("mousemove", onMouseMove, true);
    document.addEventListener("contextmenu", onContextMenu, true);
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKeyDown, true);
  }

  function disable() {
    if (!active) return;
    active = false;
    hovered = null;
    if (overlay) overlay.style.display = "none";
    document.documentElement.style.cursor = prevCursor;
    document.removeEventListener("mousemove", onMouseMove, true);
    document.removeEventListener("contextmenu", onContextMenu, true);
    document.removeEventListener("click", onClick, true);
    document.removeEventListener("keydown", onKeyDown, true);
  }

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg && msg.type === "TOGGLE_ZAP") {
      if (active) disable();
      else enable();
    }
  });
})();
