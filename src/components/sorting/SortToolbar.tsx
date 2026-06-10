"use client";

import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import type { ArraySize } from "@/lib/constants";

export function SortToolbar({
  arraySize,
  onArraySize,
  onShuffle,
}: {
  arraySize: ArraySize;
  onArraySize: (size: ArraySize) => void;
  onShuffle: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={arraySize}
        onChange={(event) => onArraySize(Number(event.target.value) as ArraySize)}
      >
        <option value={32}>32 items</option>
        <option value={64}>64 items</option>
        <option value={128}>128 items</option>
      </Select>
      <Button onClick={onShuffle}>
        <RefreshCcw size={16} strokeWidth={1.5} />
        Shuffle data
      </Button>
    </div>
  );
}
