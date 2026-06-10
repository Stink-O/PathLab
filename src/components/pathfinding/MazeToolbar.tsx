"use client";

import { Shuffle, Trash2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import type { GridSize } from "@/lib/constants";

export function MazeToolbar({
  gridSize,
  onGridSize,
  onGenerate,
  onClear,
  onRandomPoints,
}: {
  gridSize: GridSize;
  onGridSize: (size: GridSize) => void;
  onGenerate: () => void;
  onClear: () => void;
  onRandomPoints: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={gridSize} onChange={(event) => onGridSize(event.target.value as GridSize)}>
        <option value="small">Small grid</option>
        <option value="medium">Medium grid</option>
        <option value="large">Large grid</option>
        <option value="xl">XL grid</option>
        <option value="xxl">XXL grid</option>
      </Select>
      <Button onClick={onGenerate}>
        <Wand2 size={16} strokeWidth={1.5} />
        Generate maze
      </Button>
      <Button onClick={onClear}>
        <Trash2 size={16} strokeWidth={1.5} />
        Clear walls
      </Button>
      <Button onClick={onRandomPoints}>
        <Shuffle size={16} strokeWidth={1.5} />
        Random start/end
      </Button>
    </div>
  );
}
