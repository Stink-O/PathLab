"use client";

import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
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
    <>
      <Field label="Array size">
        <Select
          value={arraySize}
          onChange={(event) => onArraySize(Number(event.target.value) as ArraySize)}
        >
          {ARRAY_SIZES.map((size) => (
            <option key={size} value={size}>
              {size} items
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Distribution">
        <Select
          value={distribution}
          onChange={(event) => onDistribution(event.target.value as SortDistribution)}
        >
          {SORT_DISTRIBUTIONS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
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
      <Button onClick={onShuffle}>
        <RefreshCcw size={17} strokeWidth={1.5} />
        New data
      </Button>
    </>
  );
}
