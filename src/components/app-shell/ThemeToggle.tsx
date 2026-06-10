"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ThemeToggle({
  theme,
  onTheme,
}: {
  theme: "light" | "dark";
  onTheme: (theme: "light" | "dark") => void;
}) {
  return (
    <Button
      variant="ghost"
      aria-label="Theme"
      onClick={() => onTheme(theme === "light" ? "dark" : "light")}
      className="w-10 px-0"
    >
      {theme === "light" ? (
        <Moon size={17} strokeWidth={1.5} />
      ) : (
        <Sun size={17} strokeWidth={1.5} />
      )}
    </Button>
  );
}
