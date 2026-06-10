"use client";

import { motion } from "framer-motion";

export function ResultBadge({ label }: { label: string }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-flex min-h-10 items-center rounded-[10px] border border-[var(--result-border)] bg-[var(--result)] px-3 py-2 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--text)]"
    >
      {label}
    </motion.span>
  );
}
