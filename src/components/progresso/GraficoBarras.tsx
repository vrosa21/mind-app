"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { PontoDiario } from "@/lib/progresso/agregacao";

interface GraficoBarrasProps {
  titulo: string;
  pontos: PontoDiario[];
  unidade: string;
}

function formatarValor(valor: number, unidade: string): string {
  return `${valor} ${unidade}`;
}

export function GraficoBarras({ titulo, pontos, unidade }: GraficoBarrasProps) {
  const [indiceAtivo, setIndiceAtivo] = useState<number | null>(null);
  const maximo = Math.max(1, ...pontos.map((p) => p.valor));
  const total = pontos.reduce((soma, p) => soma + p.valor, 0);

  return (
    <div className="flex flex-1 flex-col gap-3 rounded-lg border border-[var(--border)] p-4">
      <div>
        <h3 className="text-sm font-semibold opacity-70">{titulo}</h3>
        <p className="text-xs opacity-50">Últimos 7 dias</p>
      </div>

      <div
        className="flex items-end gap-2 border-b border-[var(--border)]"
        style={{ height: 140 }}
      >
        {pontos.map((p, i) => {
          const alturaPct = (p.valor / maximo) * 100;
          const ativo = indiceAtivo === i;
          return (
            <div
              key={p.data.toISOString()}
              tabIndex={0}
              onPointerEnter={() => setIndiceAtivo(i)}
              onPointerLeave={() => setIndiceAtivo(null)}
              onFocus={() => setIndiceAtivo(i)}
              onBlur={() => setIndiceAtivo(null)}
              className="relative flex h-full flex-1 flex-col items-center justify-end gap-1 outline-none"
            >
              {ativo && (
                <div className="absolute -top-7 z-10 whitespace-nowrap rounded-md bg-[var(--foreground)] px-2 py-1 text-xs text-[var(--background)]">
                  {formatarValor(p.valor, unidade)}
                </div>
              )}
              <div
                className="w-full max-w-6 rounded-t-[4px]"
                style={{
                  height: p.valor > 0 ? `${Math.max(alturaPct, 4)}%` : 0,
                  background: "var(--accent)",
                  opacity: ativo ? 1 : 0.85,
                }}
              />
              <span className="text-[10px] opacity-50">
                {format(p.data, "EEEEEE", { locale: ptBR })}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-xs opacity-60">
        {total > 0
          ? `Total observado: ${formatarValor(total, unidade)}.`
          : "Nada registrado nesse período — os dados aparecem aqui conforme você usa o app."}
      </p>

      <table className="sr-only">
        <caption>{titulo} — últimos 7 dias</caption>
        <thead>
          <tr>
            <th>Dia</th>
            <th>{unidade}</th>
          </tr>
        </thead>
        <tbody>
          {pontos.map((p) => (
            <tr key={p.data.toISOString()}>
              <td>{format(p.data, "d 'de' MMMM", { locale: ptBR })}</td>
              <td>{formatarValor(p.valor, unidade)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
