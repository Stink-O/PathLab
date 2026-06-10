"use client";

import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/cn";

type ButtonProps = HTMLMotionProps<"button"> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({
  className,
  variant = "secondary",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.98 }}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-[10px] border px-3 text-sm font-medium transition",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]",
        variant === "primary" &&
          "border-[var(--accent)] bg-[var(--accent)] text-[#16120C] shadow-[inset_0_1px_rgba(255,255,255,.28)]",
        variant === "secondary" &&
          "border-[var(--border)] bg-[var(--surface)] text-[var(--text)] shadow-[inset_0_1px_rgba(255,255,255,.45)] hover:border-[var(--accent)]",
        variant === "ghost" &&
          "border-transparent bg-transparent text-[var(--muted)] hover:text-[var(--text)]",
        disabled && "cursor-not-allowed opacity-45",
        className,
      )}
      disabled={disabled}
      {...props}
    />
  );
}
