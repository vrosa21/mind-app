"use client";

import { useTimerStore } from "@/stores/timerStore";
import { useTarefasStore } from "@/stores/tarefasStore";
import { useHidratado } from "@/hooks/useHidratado";
import { TelaCarregando } from "@/components/layout/TelaCarregando";
import { GraficoBarras } from "./GraficoBarras";
import { CalendarioMensal } from "./CalendarioMensal";
import { CartaoIndicadorPeriodo } from "./CartaoIndicadorPeriodo";
import { FiltroTarefasPorData } from "./FiltroTarefasPorData";
import { ehRotina } from "@/lib/tarefas/rotinas";
import {
  minutosFocadosPorDia,
  tarefasConcluidasPorDia,
  tarefasCriadasPorPeriodo,
  tarefasConcluidasPorPeriodo,
} from "@/lib/progresso/agregacao";

export function ProgressoView() {
  const timerHidratado = useHidratado(useTimerStore.persist);
  const tarefasHidratado = useHidratado(useTarefasStore.persist);
  const hidratado = timerHidratado && tarefasHidratado;

  const historico = useTimerStore((s) => s.historico);
  const todasTarefas = useTarefasStore((s) => s.tarefas);

  if (!hidratado) return <TelaCarregando />;

  const hoje = new Date();
  // Rotinas nunca entram nos números do /progresso — não têm estado
  // terminal `concluida` e não são "tarefas comuns" para efeito de análise.
  const tarefas = todasTarefas.filter((t) => !ehRotina(t));

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
      <div className="flex flex-col gap-4 sm:flex-row">
        <CartaoIndicadorPeriodo
          titulo="Tarefas criadas"
          contagem={tarefasCriadasPorPeriodo(tarefas, hoje)}
          unidade="tarefa(s)"
        />
        <CartaoIndicadorPeriodo
          titulo="Tarefas concluídas"
          contagem={tarefasConcluidasPorPeriodo(tarefas, hoje)}
          unidade="tarefa(s)"
        />
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <FiltroTarefasPorData
            titulo="Filtrar por data de criação"
            campo="criacao"
            tarefas={tarefas}
          />
        </div>
        <div className="flex-1">
          <FiltroTarefasPorData
            titulo="Filtrar por data de conclusão"
            campo="conclusao"
            tarefas={tarefas}
          />
        </div>
      </div>
    </div>
  );
}
