"use client";

import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import {
  ARRAY_SIZES,
  SORT_DISTRIBUTIONS,
  SOUND_STYLES,
  type ArraySize,
  type SortDistribution,
  type SoundStyle,
} from "@/lib/constants";

export function SortToolbar({
  arraySize,
  distribution,
  soundStyle,
  onArraySize,
  onDistribution,
  onSoundStyle,
  onShuffle,
}: {
  arraySize: ArraySize;
  distribution: SortDistribution;
  soundStyle: SoundStyle;
  onArraySize: (size: ArraySize) => void;
  onDistribution: (distribution: SortDistribution) => void;
  onSoundStyle: (style: SoundStyle) => void;
  onShuffle: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={arraySize}
        onChange={(event) => onArraySize(Number(event.target.value) as ArraySize)}
        aria-label="Array size"
      >
        {ARRAY_SIZES.map((size) => (
          <option key={size} value={size}>
            {size} items
          </option>
        ))}
      </Select>
      <Select
        value={distribution}
        onChange={(event) => onDistribution(event.target.value as SortDistribution)}
        aria-label="Input distribution"
      >
        {SORT_DISTRIBUTIONS.map((item) => (
          <option key={item.id} value={item.id}>
            {item.label}
          </option>
        ))}
      </Select>
      <Select
        value={soundStyle}
        onChange={(event) => onSoundStyle(event.target.value as SoundStyle)}
        aria-label="Sound style"
      >
        {SOUND_STYLES.map((item) => (
          <option key={item.id} value={item.id}>
            Sound: {item.label}
          </option>
        ))}
      </Select>
      <Button onClick={onShuffle}>
        <RefreshCcw size={16} strokeWidth={1.5} />
        New data
      </Button>
    </div>
  );
}
