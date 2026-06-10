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
    <header className="flex flex-col gap-4 border-b border-[var(--border)] py-5 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
          Algorithm comparison lab
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-[-0.02em] text-[var(--text)]">
          PathLab
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <ModeSwitch mode={mode} onMode={onMode} />
        <ThemeToggle theme={theme} onTheme={onTheme} />
      </div>
    </header>
  );
}
