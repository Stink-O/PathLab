"use client";

import { Shuffle, Trash2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
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
    <>
      <Field label="Grid size">
        <Select value={gridSize} onChange={(event) => onGridSize(event.target.value as GridSize)}>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
          <option value="xl">XL</option>
          <option value="xxl">XXL</option>
        </Select>
      </Field>
      <Button onClick={onGenerate}>
        <Wand2 size={17} strokeWidth={1.5} />
        Generate maze
      </Button>
      <Button onClick={onClear}>
        <Trash2 size={17} strokeWidth={1.5} />
        Clear walls
      </Button>
      <Button onClick={onRandomPoints}>
        <Shuffle size={17} strokeWidth={1.5} />
        Random start/end
      </Button>
    </>
  );
}
