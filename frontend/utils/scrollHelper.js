export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function computeCenteredScrollTop(container, element) {
  if (!container || !element) return 0;

  const containerRect = container.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();
  const offsetWithinContainer = elementRect.top - containerRect.top + container.scrollTop;
  const centered = offsetWithinContainer - container.clientHeight / 2 + element.clientHeight / 2;

  return clamp(centered, 0, Math.max(0, container.scrollHeight - container.clientHeight));
}

export function smoothStep(current, target, factor) {
  const delta = target - current;
  if (Math.abs(delta) < 0.5) {
    return target;
  }

  return current + delta * factor;
}
