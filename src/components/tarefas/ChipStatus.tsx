import { ESTADO_LABELS, ESTADO_COR_VAR } from "@/lib/tarefas/estados";
import type { EstadoTarefa } from "@/types";

// Cor é sempre reforço, nunca o único sinal — o rótulo textual acompanha.
export function ChipStatus({ estado }: { estado: EstadoTarefa }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-2 py-0.5 text-xs font-medium"
      style={{ color: ESTADO_COR_VAR[estado] }}
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: ESTADO_COR_VAR[estado] }}
      />
      {ESTADO_LABELS[estado]}
    </span>
  );
}
