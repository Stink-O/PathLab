export function elapsedMs(startedAt: number | null, endedAt?: number | null) {
  if (!startedAt) return 0;
  return Math.max(0, (endedAt ?? performance.now()) - startedAt);
}

export function formatMs(value: number) {
  return `${Math.round(value)}ms`;
}
