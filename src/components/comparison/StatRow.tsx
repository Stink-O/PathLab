export function StatRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] py-2 last:border-b-0">
      <span className="text-xs text-[var(--muted)]">{label}</span>
      <span className="font-mono text-xs text-[var(--text)]">{value}</span>
    </div>
  );
}
