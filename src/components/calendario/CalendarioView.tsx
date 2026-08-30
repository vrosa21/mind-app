"use client";

import { useState } from "react";
import { format, isAfter, isSameMonth, startOfMonth, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useTarefasStore } from "@/stores/tarefasStore";
import { useHidratado } from "@/hooks/useHidratado";
import { TelaCarregando } from "@/components/layout/TelaCarregando";
import { ehRotina } from "@/lib/tarefas/rotinas";
import { DIAS_SEMANA_CURTO, gradeDoMes } from "@/lib/calendario/grade";
import { contagensPorDiaDoMes } from "@/lib/calendario/contagens";
import { CelulaDia } from "./CelulaDia";

export function CalendarioView() {
  const hidratado = useHidratado(useTarefasStore.persist);
  const todasTarefas = useTarefasStore((s) => s.tarefas);
  const [mesAtual, setMesAtual] = useState(() => startOfMonth(new Date()));

  if (!hidratado) return <TelaCarregando />;

  // Mesmo contrato do /progresso (ProgressoView.tsx) — rotinas nunca entram
  // nas contagens de tarefas: não têm estado terminal `concluida` e não são
  // "tarefas comuns" para efeito de análise.
  const tarefas = todasTarefas.filter((t) => !ehRotina(t));

  const hojeMes = startOfMonth(new Date());
  const { offsetInicio } = gradeDoMes(mesAtual);
  const pontos = contagensPorDiaDoMes(tarefas, mesAtual);
  const totalCriadas = pontos.reduce((soma, p) => soma + p.criadas, 0);
  const totalConcluidas = pontos.reduce((soma, p) => soma + p.concluidas, 0);
  const noMesFuturo = isAfter(mesAtual, hojeMes);
  const noMesAtualReal = isSameMonth(mesAtual, new Date());

  let mensagemRodape: string;
  if (noMesFuturo) {
    mensagemRodape = "Este mês ainda não começou.";
  } else if (totalCriadas === 0 && totalConcluidas === 0) {
    mensagemRodape =
      "Nada registrado neste mês — os números aparecem conforme você usa o app.";
  } else {
    mensagemRodape = `Neste mês: ${totalCriadas} criada(s) e ${totalConcluidas} concluída(s).`;
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[var(--border)] p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium capitalize opacity-80">
          {format(mesAtual, "MMMM 'de' yyyy", { locale: ptBR })}
        </p>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setMesAtual((m) => subMonths(m, 1))}
            className="rounded-md border border-[var(--border)] px-2 py-1 text-xs opacity-70 hover:opacity-100"
            aria-label="Mês anterior"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => setMesAtual(hojeMes)}
            disabled={noMesAtualReal}
            className="rounded-md border border-[var(--border)] px-2 py-1 text-xs opacity-70 hover:opacity-100 disabled:opacity-20 disabled:hover:opacity-20"
          >
            Hoje
          </button>
          <button
            type="button"
            onClick={() => setMesAtual((m) => subMonths(m, -1))}
            className="rounded-md border border-[var(--border)] px-2 py-1 text-xs opacity-70 hover:opacity-100"
            aria-label="Próximo mês"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {DIAS_SEMANA_CURTO.map((dia) => (
          <div key={dia} className="text-center text-[10px] uppercase opacity-40">
            {dia}
          </div>
        ))}

        {Array.from({ length: offsetInicio }, (_, i) => (
          <div key={`vazio-${i}`} aria-hidden />
        ))}

        {pontos.map((p) => (
          <CelulaDia
            key={p.data.toISOString()}
            data={p.data}
            criadas={p.criadas}
            concluidas={p.concluidas}
          />
        ))}
      </div>

      <p className="text-xs opacity-50">
        <span className="font-semibold">+N</span> tarefas criadas ·{" "}
        <span className="font-semibold">✓N</span> tarefas concluídas
      </p>

      <p className="text-xs opacity-60">{mensagemRodape}</p>

      <table className="sr-only">
        <caption>
          Tarefas por dia — {format(mesAtual, "MMMM 'de' yyyy", { locale: ptBR })}
        </caption>
        <thead>
          <tr>
            <th>Dia</th>
            <th>Criadas</th>
            <th>Concluídas</th>
          </tr>
        </thead>
        <tbody>
          {pontos.map((p) => (
            <tr key={p.data.toISOString()}>
              <td>{format(p.data, "d 'de' MMMM", { locale: ptBR })}</td>
              <td>{p.criadas}</td>
              <td>{p.concluidas}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
