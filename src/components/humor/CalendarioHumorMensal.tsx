"use client";

import { useState } from "react";
import { format, getDay, isSameMonth, isToday, startOfMonth, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Reflexao } from "@/types";
import { saldoDoDiaPorDiaDoMes } from "@/lib/reflexao/calendario";
import { OPCOES_HUMOR } from "@/lib/reflexao/humor";

interface CalendarioHumorMensalProps {
  reflexoes: Reflexao[];
}

const DIAS_SEMANA = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

function labelHumor(humor: string | undefined): string | undefined {
  return OPCOES_HUMOR.find((op) => op.valor === humor)?.label;
}

function emojiHumor(humor: string | undefined): string | undefined {
  return OPCOES_HUMOR.find((op) => op.valor === humor)?.emoji;
}

export function CalendarioHumorMensal({ reflexoes }: CalendarioHumorMensalProps) {
  const [mesAtual, setMesAtual] = useState(() => startOfMonth(new Date()));
  const [diaAtivo, setDiaAtivo] = useState<string | null>(null);

  const dias = saldoDoDiaPorDiaDoMes(reflexoes, mesAtual);
  const offsetInicio = getDay(dias[0].data);
  const noMesAtualReal = isSameMonth(mesAtual, new Date());
  const totalComRegistro = dias.filter((d) => d.humor).length;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[var(--border)] p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold opacity-70">
            Saldo do dia no mês
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
          <div key={dia} className="text-center text-[10px] uppercase opacity-40">
            {dia}
          </div>
        ))}

        {Array.from({ length: offsetInicio }, (_, i) => (
          <div key={`vazio-${i}`} aria-hidden />
        ))}

        {dias.map((d) => {
          const chave = d.data.toISOString();
          const ativo = diaAtivo === chave;
          const emoji = emojiHumor(d.humor);
          return (
            <div
              key={chave}
              tabIndex={0}
              onPointerEnter={() => setDiaAtivo(chave)}
              onPointerLeave={() => setDiaAtivo(null)}
              onFocus={() => setDiaAtivo(chave)}
              onBlur={() => setDiaAtivo(null)}
              className="relative flex aspect-square flex-col items-center justify-center gap-0.5 rounded-md border border-[var(--border)] text-xs outline-none"
            >
              {ativo && (
                <div className="absolute -top-8 z-10 whitespace-nowrap rounded-md bg-[var(--foreground)] px-2 py-1 text-xs text-[var(--background)]">
                  {format(d.data, "d 'de' MMMM", { locale: ptBR })}
                  {d.humor ? `: ${labelHumor(d.humor)}` : ": sem registro"}
                </div>
              )}
              <span
                className={
                  isToday(d.data)
                    ? "text-[10px] font-semibold underline opacity-90"
                    : "text-[10px] opacity-50"
                }
              >
                {format(d.data, "d")}
              </span>
              {emoji && <span className="text-base leading-none">{emoji}</span>}
            </div>
          );
        })}
      </div>

      <p className="text-xs opacity-60">
        {totalComRegistro > 0
          ? `${totalComRegistro} dia(s) com saldo registrado neste mês.`
          : "Nada registrado nesse mês — os dados aparecem aqui conforme você usa o app."}
      </p>

      <table className="sr-only">
        <caption>
          Saldo do dia — {format(mesAtual, "MMMM 'de' yyyy", { locale: ptBR })}
        </caption>
        <thead>
          <tr>
            <th>Dia</th>
            <th>Saldo do dia</th>
          </tr>
        </thead>
        <tbody>
          {dias.map((d) => (
            <tr key={d.data.toISOString()}>
              <td>{format(d.data, "d 'de' MMMM", { locale: ptBR })}</td>
              <td>{labelHumor(d.humor) ?? "Sem registro"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
