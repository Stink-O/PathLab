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
        "inline-flex h-10 items-center justify-center gap-2 rounded-[4px] px-3.5 text-[15px] font-medium transition-colors duration-150",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]",
        variant === "primary" &&
          "bg-[var(--accent)] text-[var(--on-accent)] hover:brightness-110",
        variant === "secondary" &&
          "border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-2)]",
        variant === "ghost" &&
          "bg-transparent text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]",
        disabled && "cursor-not-allowed opacity-40",
        className,
      )}
      disabled={disabled}
      {...props}
    />
  );
}
