import { POOLS, POOL_LABELS } from "@/lib/tarefas/pools";
import { useTagsStore } from "@/stores/tagsStore";
import { DIAS_SELETOR } from "@/lib/tarefas/rotinas";
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
  tagIds: string[];
  setTagIds: (v: string[]) => void;
  rotina: boolean;
  setRotina: (v: boolean) => void;
  diasSemana: number[];
  setDiasSemana: (v: number[]) => void;
  repetirAte: string;
  setRepetirAte: (v: string) => void;
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
  tagIds,
  setTagIds,
  rotina,
  setRotina,
  diasSemana,
  setDiasSemana,
  repetirAte,
  setRepetirAte,
  quebrarEmMicrometas,
  setQuebrarEmMicrometas,
  autoFocus,
}: TarefaCamposFormProps) {
  const tags = useTagsStore((s) => s.tags);

  function alternarDia(dia: number) {
    setDiasSemana(
      diasSemana.includes(dia)
        ? diasSemana.filter((d) => d !== dia)
        : [...diasSemana, dia],
    );
  }

  function alternarTag(id: string) {
    setTagIds(
      tagIds.includes(id) ? tagIds.filter((t) => t !== id) : [...tagIds, id],
    );
  }
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
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag) => {
            const selecionada = tagIds.includes(tag.id);
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => alternarTag(tag.id)}
                aria-pressed={selecionada}
                className={
                  selecionada
                    ? "rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-medium text-[var(--accent-foreground)]"
                    : "rounded-full border border-[var(--border)] px-3 py-1 text-xs opacity-70 hover:opacity-100"
                }
              >
                {tag.nome}
              </button>
            );
          })}
        </div>
      )}
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
      <label className="flex items-center gap-2 text-sm opacity-80">
        <input
          type="checkbox"
          checked={rotina}
          onChange={(e) => setRotina(e.target.checked)}
        />
        Rotina?
      </label>
      {rotina && (
        <div className="flex flex-col gap-2 rounded-lg border border-[var(--border)] p-3">
          <div className="flex flex-wrap items-center gap-1">
            {DIAS_SELETOR.map((d) => {
              const selecionado = diasSemana.includes(d.valor);
              return (
                <button
                  key={d.valor}
                  type="button"
                  title={d.nome}
                  aria-label={d.nome}
                  aria-pressed={selecionado}
                  onClick={() => alternarDia(d.valor)}
                  className={
                    selecionado
                      ? "h-8 w-8 rounded-full bg-[var(--accent)] text-xs font-medium text-[var(--accent-foreground)]"
                      : "h-8 w-8 rounded-full border border-[var(--border)] text-xs opacity-70 hover:opacity-100"
                  }
                >
                  {d.label}
                </button>
              );
            })}
          </div>
          <label className="flex items-center gap-2 text-sm opacity-80">
            Repetir até (opcional)
            <input
              type="date"
              value={repetirAte}
              onChange={(e) => setRepetirAte(e.target.value)}
              className="rounded-lg border border-[var(--border)] bg-transparent px-2 py-1 text-sm outline-none focus:border-[var(--accent)]"
            />
          </label>
        </div>
      )}
    </>
  );
}
