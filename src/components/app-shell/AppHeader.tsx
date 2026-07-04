"use client";

import { ModeSwitch } from "./ModeSwitch";
import { ThemeToggle } from "./ThemeToggle";
import type { Mode } from "@/lib/constants";

export function AppHeader({
  mode,
  theme,
  onMode,
  onTheme,
}: {
  mode: Mode;
  theme: "light" | "dark";
  onMode: (mode: Mode) => void;
  onTheme: (theme: "light" | "dark") => void;
}) {
  return (
    <header className="flex min-h-14 items-stretch justify-between gap-4 border-b border-[var(--border)]">
      <div className="flex items-center gap-3">
        <h1 className="text-[19px] font-semibold tracking-[-0.01em] text-[var(--text)]">
          PathLab
        </h1>
        <p className="hidden text-[15px] text-[var(--muted)] md:block">
          Race two algorithms side by side
        </p>
      </div>
      <div className="flex items-stretch gap-2">
        <ModeSwitch mode={mode} onMode={onMode} />
        <div className="flex items-center">
          <ThemeToggle theme={theme} onTheme={onTheme} />
        </div>
      </div>
    </header>
  );
}
