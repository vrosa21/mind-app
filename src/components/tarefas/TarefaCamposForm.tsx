import { POOLS, POOL_LABELS } from "@/lib/tarefas/pools";
import type { Pool, UnidadeEstimativa } from "@/types";

interface TarefaCamposFormProps {
  titulo: string;
  setTitulo: (v: string) => void;
  notas: string;
  setNotas: (v: string) => void;
  pool: Pool;
  setPool: (v: Pool) => void;
  estimativaValor: string;
  setEstimativaValor: (v: string) => void;
  estimativaUnidade: UnidadeEstimativa;
  setEstimativaUnidade: (v: UnidadeEstimativa) => void;
  emergencial: boolean;
  setEmergencial: (v: boolean) => void;
  // Ausentes = não exibe o controle (edição de tarefa existente; a flag só
  // se aplica na criação).
  quebrarEmMicrometas?: boolean;
  setQuebrarEmMicrometas?: (v: boolean) => void;
  autoFocus?: boolean;
}

export function TarefaCamposForm({
  titulo,
  setTitulo,
  notas,
  setNotas,
  pool,
  setPool,
  estimativaValor,
  setEstimativaValor,
  estimativaUnidade,
  setEstimativaUnidade,
  emergencial,
  setEmergencial,
  quebrarEmMicrometas,
  setQuebrarEmMicrometas,
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
          type="text"
          inputMode="decimal"
          value={estimativaValor}
          onChange={(e) => setEstimativaValor(e.target.value)}
          placeholder="Estimativa (opcional)"
          className="w-36 rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
        />
        <select
          value={estimativaUnidade}
          onChange={(e) => setEstimativaUnidade(e.target.value as UnidadeEstimativa)}
          className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm"
        >
          <option value="min">minutos</option>
          <option value="horas">horas</option>
        </select>
      </div>
      {quebrarEmMicrometas !== undefined && setQuebrarEmMicrometas && (
        <label className="flex items-center gap-2 text-sm opacity-80">
          <input
            type="checkbox"
            checked={quebrarEmMicrometas}
            onChange={(e) => setQuebrarEmMicrometas(e.target.checked)}
          />
          Quebrar em microtarefas?
        </label>
      )}
      <label className="flex items-center gap-2 text-sm opacity-80">
        <input
          type="checkbox"
          checked={emergencial}
          onChange={(e) => setEmergencial(e.target.checked)}
        />
        Emergencial
      </label>
    </>
  );
}
