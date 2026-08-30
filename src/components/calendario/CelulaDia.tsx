"use client";

import { useState } from "react";
import { format, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CelulaDiaProps {
  data: Date;
  criadas: number;
  concluidas: number;
}

// Cor nunca é o único sinal (decisão travada) — todo dia com atividade
// mostra os NÚMEROS, não apenas um preenchimento. Sem vermelho: o único
// destaque cromático é --accent, reservado ao dia de hoje.
export function CelulaDia({ data, criadas, concluidas }: CelulaDiaProps) {
  const [ativo, setAtivo] = useState(false);
  const hoje = isToday(data);
  const temAtividade = criadas > 0 || concluidas > 0;

  const partesLabel = [`dia ${format(data, "d 'de' MMMM", { locale: ptBR })}`];
  if (criadas > 0) partesLabel.push(`${criadas} criada(s)`);
  if (concluidas > 0) partesLabel.push(`${concluidas} concluída(s)`);
  if (!temAtividade) partesLabel.push("sem atividade");
  if (hoje) partesLabel.push("hoje");

  return (
    <div
      tabIndex={0}
      onPointerEnter={() => setAtivo(true)}
      onPointerLeave={() => setAtivo(false)}
      onFocus={() => setAtivo(true)}
      onBlur={() => setAtivo(false)}
      aria-label={partesLabel.join(", ")}
      aria-current={hoje ? "date" : undefined}
      className="relative flex aspect-square flex-col items-center justify-center gap-0.5 rounded-md border text-xs outline-none"
      style={{
        borderColor: hoje ? "var(--accent)" : "var(--border)",
        backgroundColor: temAtividade ? "var(--muted)" : "transparent",
      }}
    >
      {ativo && (
        <div className="absolute -top-8 z-10 whitespace-nowrap rounded-md bg-[var(--foreground)] px-2 py-1 text-xs text-[var(--background)]">
          {format(data, "d 'de' MMMM", { locale: ptBR })}: {criadas} criada(s),{" "}
          {concluidas} concluída(s)
        </div>
      )}
      <span
        className={
          hoje
            ? "text-[10px] font-semibold underline opacity-90"
            : "text-[10px] opacity-50"
        }
      >
        {format(data, "d")}
      </span>
      {temAtividade && (
        <div className="flex gap-1 text-[10px] font-semibold">
          {criadas > 0 && <span>+{criadas}</span>}
          {concluidas > 0 && <span>✓{concluidas}</span>}
        </div>
      )}
    </div>
  );
}
