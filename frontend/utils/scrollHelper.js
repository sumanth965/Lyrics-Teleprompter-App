export function getCenteredScrollTop(container, target) {
  if (!container || !target) {
    return 0;
  }

  const top = target.offsetTop - container.clientHeight / 2 + target.clientHeight / 2;
  const maxScroll = Math.max(0, container.scrollHeight - container.clientHeight);

  return Math.min(Math.max(top, 0), maxScroll);
}

export function smoothScrollTo(container, destination, duration = 250) {
  if (!container) return () => {};

  const start = container.scrollTop;
  const distance = destination - start;
  const startedAt = performance.now();
  let frameId = null;

  const easeOutCubic = (t) => 1 - (1 - t) ** 3;

  const step = (now) => {
    const elapsed = now - startedAt;
    const progress = Math.min(elapsed / duration, 1);
    container.scrollTop = start + distance * easeOutCubic(progress);

    if (progress < 1) {
      frameId = requestAnimationFrame(step);
    }
  };

  frameId = requestAnimationFrame(step);

  return () => {
    if (frameId) {
      cancelAnimationFrame(frameId);
    }
  };
}
