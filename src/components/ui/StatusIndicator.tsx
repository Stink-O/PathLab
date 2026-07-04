import { cn } from "@/lib/cn";
import type { SimulationStatus } from "@/store/useSimulationStore";

const STATUS: Record<SimulationStatus, { label: string; color: string }> = {
  idle: { label: "Ready", color: "var(--muted)" },
  ready: { label: "Ready", color: "var(--muted)" },
  paused: { label: "Paused", color: "var(--muted)" },
  running: { label: "Running", color: "var(--frontier)" },
  complete: { label: "Complete", color: "var(--success)" },
  failed: { label: "Failed", color: "var(--danger)" },
};

export function StatusIndicator({ status }: { status: SimulationStatus }) {
  const { label, color } = STATUS[status];
  return (
    <span className="inline-flex items-center gap-2 text-[14px] font-medium text-[var(--muted)]">
      <span
        aria-hidden="true"
        className={cn("h-2 w-2 rounded-[2px]", status === "running" && "status-dot-running")}
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}
