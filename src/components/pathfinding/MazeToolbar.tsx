"use client";

import { Shuffle, Trash2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Select } from "@/components/ui/Select";
import { SOUND_STYLES, type GridSize, type SoundStyle } from "@/lib/constants";

export function MazeToolbar({
  gridSize,
  soundStyle,
  onGridSize,
  onSoundStyle,
  onGenerate,
  onClear,
  onRandomPoints,
}: {
  gridSize: GridSize;
  soundStyle: SoundStyle;
  onGridSize: (size: GridSize) => void;
  onSoundStyle: (style: SoundStyle) => void;
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
      <Field label="Sound">
        <Select
          value={soundStyle}
          onChange={(event) => onSoundStyle(event.target.value as SoundStyle)}
        >
          {SOUND_STYLES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
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
