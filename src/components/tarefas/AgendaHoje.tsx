"use client";

import { isSameDay } from "date-fns";
import { useTarefasStore } from "@/stores/tarefasStore";
import { ehRotina, rotinaAtivaEm, feitoHoje, formatarDiasSemana } from "@/lib/tarefas/rotinas";
import { POOL_LABELS } from "@/lib/tarefas/pools";
import { formatarData } from "@/lib/tarefas/formato";
import type { Task } from "@/types";

interface ItemAgenda {
  tarefa: Task;
  detalhe: string;
}

export function AgendaHoje() {
  const tarefas = useTarefasStore((s) => s.tarefas);
  const hoje = new Date();

  const rotinasHoje: ItemAgenda[] = tarefas
    .filter((t) => rotinaAtivaEm(t, hoje) && !feitoHoje(t, hoje))
    .map((t) => ({ tarefa: t, detalhe: `Rotina · ${formatarDiasSemana(t.diasSemana!)}` }));

  const previsoesHoje: ItemAgenda[] = tarefas
    .filter(
      (t) =>
        !ehRotina(t) &&
        t.estado !== "concluida" &&
        t.previsaoTerminoEm &&
        isSameDay(new Date(t.previsaoTerminoEm), hoje),
    )
    .map((t) => ({
      tarefa: t,
      detalhe: `Previsão de término hoje · ${formatarData(t.previsaoTerminoEm)}`,
    }));

  const itens = [...rotinasHoje, ...previsoesHoje];

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[var(--border)] p-4">
      <h2 className="text-sm font-semibold opacity-70">Agenda de hoje</h2>
      {itens.length === 0 ? (
        <p className="text-sm opacity-50">Nada previsto para hoje.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {itens.map(({ tarefa, detalhe }) => (
            <li
              key={tarefa.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-[var(--border)] p-3"
            >
              <span className="text-sm">{tarefa.titulo}</span>
              <span className="shrink-0 text-xs opacity-60">
                {POOL_LABELS[tarefa.pool]} · {detalhe}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
