"use client";

import { useState } from "react";
import {
  tarefasCriadasNoDia,
  tarefasConcluidasNoDia,
} from "@/lib/progresso/agregacao";
import { ESTADO_LABELS, ORDEM_STATUS } from "@/lib/tarefas/estados";
import { POOL_LABELS } from "@/lib/tarefas/pools";
import type { Task } from "@/types";

interface FiltroTarefasPorDataProps {
  titulo: string;
  campo: "criacao" | "conclusao";
  tarefas: Task[];
}

function paraDiaLocal(dataYYYYMMDD: string): Date {
  const [ano, mes, dia] = dataYYYYMMDD.split("-").map(Number);
  return new Date(ano, mes - 1, dia);
}

export function FiltroTarefasPorData({
  titulo,
  campo,
  tarefas,
}: FiltroTarefasPorDataProps) {
  const [diaEscolhido, setDiaEscolhido] = useState("");

  const resultado = diaEscolhido
    ? (campo === "criacao" ? tarefasCriadasNoDia : tarefasConcluidasNoDia)(
        tarefas,
        paraDiaLocal(diaEscolhido),
      ).slice()
        .sort((a, b) => ORDEM_STATUS[a.estado] - ORDEM_STATUS[b.estado])
    : null;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[var(--border)] p-4">
      <div className="flex flex-col gap-1">
        <label
          htmlFor={`filtro-data-${campo}`}
          className="text-sm font-semibold opacity-70"
        >
          {titulo}
        </label>
        <input
          id={`filtro-data-${campo}`}
          type="date"
          value={diaEscolhido}
          onChange={(e) => setDiaEscolhido(e.target.value)}
          className="w-fit rounded-lg border border-[var(--border)] bg-transparent px-3 py-1.5 text-sm outline-none focus:border-[var(--accent)]"
        />
      </div>

      {!diaEscolhido ? (
        <p className="text-xs opacity-50">Escolha uma data para ver as tarefas.</p>
      ) : resultado!.length === 0 ? (
        <p className="text-sm opacity-50">Nenhuma tarefa nesta data.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {resultado!.map((t) => (
            <li
              key={t.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-[var(--border)] p-3"
            >
              <span className="text-sm">{t.titulo}</span>
              <span className="shrink-0 text-xs opacity-60">
                {ESTADO_LABELS[t.estado]} · {POOL_LABELS[t.pool]}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
