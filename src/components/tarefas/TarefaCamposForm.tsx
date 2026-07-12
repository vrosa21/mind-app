import { POOLS, POOL_LABELS } from "@/lib/tarefas/pools";
import type { Pool } from "@/types";

interface TarefaCamposFormProps {
  titulo: string;
  setTitulo: (v: string) => void;
  notas: string;
  setNotas: (v: string) => void;
  pool: Pool;
  setPool: (v: Pool) => void;
  estimativaMin: number;
  setEstimativaMin: (v: number) => void;
  autoFocus?: boolean;
}

export function TarefaCamposForm({
  titulo,
  setTitulo,
  notas,
  setNotas,
  pool,
  setPool,
  estimativaMin,
  setEstimativaMin,
  autoFocus,
}: TarefaCamposFormProps) {
  return (
    <>
      <input
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="O que você quer fazer?"
        autoFocus={autoFocus}
        className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--accent)]"
      />
      <textarea
        value={notas}
        onChange={(e) => setNotas(e.target.value)}
        placeholder="Notas (opcional)"
        rows={2}
        className="resize-none rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
      />
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={pool}
          onChange={(e) => setPool(e.target.value as Pool)}
          className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm"
        >
          {POOLS.map((p) => (
            <option key={p} value={p}>
              {POOL_LABELS[p]}
            </option>
          ))}
        </select>
        <input
          type="number"
          min={5}
          max={480}
          value={estimativaMin}
          onChange={(e) =>
            setEstimativaMin(Math.max(1, Number(e.target.value) || 1))
          }
          className="w-20 rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
        />
        <span className="text-sm opacity-60">min</span>
      </div>
    </>
  );
}
