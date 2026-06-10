export function reconstructPath(
  parents: Map<string, string>,
  startKey: string,
  goalKey: string,
) {
  const path = [goalKey];
  let cursor = goalKey;
  while (cursor !== startKey) {
    const parent = parents.get(cursor);
    if (!parent) return [];
    cursor = parent;
    path.unshift(cursor);
  }
  return path;
}
