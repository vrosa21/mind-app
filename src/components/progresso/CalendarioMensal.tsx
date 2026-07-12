"use client";

import { useState } from "react";
import {
  format,
  getDay,
  isSameMonth,
  isToday,
  startOfMonth,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Task } from "@/types";
import { tarefasConcluidasPorDiaDoMes } from "@/lib/progresso/agregacao";

interface CalendarioMensalProps {
  tarefas: Task[];
}

const DIAS_SEMANA = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

function opacidadePara(valor: number, maximo: number): number {
  if (valor === 0) return 0;
  return 0.25 + 0.75 * (valor / maximo);
}

export function CalendarioMensal({ tarefas }: CalendarioMensalProps) {
  const [mesAtual, setMesAtual] = useState(() => startOfMonth(new Date()));
  const [diaAtivo, setDiaAtivo] = useState<string | null>(null);

  const pontos = tarefasConcluidasPorDiaDoMes(tarefas, mesAtual);
  const maximo = Math.max(1, ...pontos.map((p) => p.valor));
  const total = pontos.reduce((soma, p) => soma + p.valor, 0);
  const offsetInicio = getDay(pontos[0].data);
  const noMesAtualReal = isSameMonth(mesAtual, new Date());

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[var(--border)] p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold opacity-70">
            Tarefas concluídas no mês
          </h3>
          <p className="text-xs opacity-50 capitalize">
            {format(mesAtual, "MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>
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
            onClick={() => setMesAtual((m) => subMonths(m, -1))}
            disabled={noMesAtualReal}
            className="rounded-md border border-[var(--border)] px-2 py-1 text-xs opacity-70 hover:opacity-100 disabled:opacity-20 disabled:hover:opacity-20"
            aria-label="Próximo mês"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {DIAS_SEMANA.map((dia) => (
          <div
            key={dia}
            className="text-center text-[10px] uppercase opacity-40"
          >
            {dia}
          </div>
        ))}

        {Array.from({ length: offsetInicio }, (_, i) => (
          <div key={`vazio-${i}`} aria-hidden />
        ))}

        {pontos.map((p) => {
          const chave = p.data.toISOString();
          const ativo = diaAtivo === chave;
          const preenchimento = opacidadePara(p.valor, maximo);
          const textoClaro = preenchimento >= 0.6;
          return (
            <div
              key={chave}
              tabIndex={0}
              onPointerEnter={() => setDiaAtivo(chave)}
              onPointerLeave={() => setDiaAtivo(null)}
              onFocus={() => setDiaAtivo(chave)}
              onBlur={() => setDiaAtivo(null)}
              className="relative flex aspect-square flex-col items-center justify-center gap-0.5 rounded-md border border-[var(--border)] text-xs outline-none"
              style={{
                backgroundColor:
                  p.valor === 0
                    ? "transparent"
                    : "var(--accent)",
                opacity: p.valor === 0 ? undefined : preenchimento,
              }}
            >
              {ativo && (
                <div className="absolute -top-8 z-10 whitespace-nowrap rounded-md bg-[var(--foreground)] px-2 py-1 text-xs text-[var(--background)]">
                  {format(p.data, "d 'de' MMMM", { locale: ptBR })}:{" "}
                  {p.valor} tarefa(s)
                </div>
              )}
              <span
                className={
                  textoClaro
                    ? "text-[10px] text-[var(--background)]"
                    : isToday(p.data)
                      ? "text-[10px] font-semibold underline opacity-90"
                      : "text-[10px] opacity-50"
                }
              >
                {format(p.data, "d")}
              </span>
              {p.valor > 0 && (
                <span
                  className={
                    textoClaro
                      ? "font-semibold text-[var(--background)]"
                      : "font-semibold opacity-80"
                  }
                >
                  {p.valor}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs opacity-60">
        {total > 0
          ? `Total observado no mês: ${total} tarefa(s) concluída(s). Quanto mais escuro o quadrado, mais tarefas naquele dia.`
          : "Nada registrado nesse mês — os dados aparecem aqui conforme você usa o app."}
      </p>

      <table className="sr-only">
        <caption>
          Tarefas concluídas — {format(mesAtual, "MMMM 'de' yyyy", { locale: ptBR })}
        </caption>
        <thead>
          <tr>
            <th>Dia</th>
            <th>Tarefas concluídas</th>
          </tr>
        </thead>
        <tbody>
          {pontos.map((p) => (
            <tr key={p.data.toISOString()}>
              <td>{format(p.data, "d 'de' MMMM", { locale: ptBR })}</td>
              <td>{p.valor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
