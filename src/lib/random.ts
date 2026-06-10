export function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export function shuffle<T>(items: T[]) {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1);
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export function pairFrom<T>(items: T[]) {
  const first = randomInt(items.length);
  let second = randomInt(items.length - 1);
  if (second >= first) second += 1;
  return [items[first], items[second]] as const;
}
