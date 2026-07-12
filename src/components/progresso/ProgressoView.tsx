"use client";

import { useTimerStore } from "@/stores/timerStore";
import { useTarefasStore } from "@/stores/tarefasStore";
import { useHidratado } from "@/hooks/useHidratado";
import { TelaCarregando } from "@/components/layout/TelaCarregando";
import { GraficoBarras } from "./GraficoBarras";
import { CalendarioMensal } from "./CalendarioMensal";
import {
  minutosFocadosPorDia,
  tarefasConcluidasPorDia,
} from "@/lib/progresso/agregacao";

export function ProgressoView() {
  const timerHidratado = useHidratado(useTimerStore.persist);
  const tarefasHidratado = useHidratado(useTarefasStore.persist);
  const hidratado = timerHidratado && tarefasHidratado;

  const historico = useTimerStore((s) => s.historico);
  const tarefas = useTarefasStore((s) => s.tarefas);

  if (!hidratado) return <TelaCarregando />;

  const hoje = new Date();

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm opacity-60">
        Uma observação da sua semana — sem metas, sem comparação, só o que
        aconteceu.
      </p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <GraficoBarras
          titulo="Tempo focado"
          pontos={minutosFocadosPorDia(historico, hoje)}
          unidade="min"
        />
        <GraficoBarras
          titulo="Tarefas concluídas"
          pontos={tarefasConcluidasPorDia(tarefas, hoje)}
          unidade="tarefa(s)"
        />
      </div>
      <CalendarioMensal tarefas={tarefas} />
    </div>
  );
}
