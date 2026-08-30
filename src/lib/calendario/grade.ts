import { eachDayOfInterval, endOfMonth, getDay, startOfMonth } from "date-fns";

// Módulo PURO (sem JSX, sem React) — fonte única da grade mensal para toda a
// Fase 8 (8a mês; 8b/8c consumem o mesmo helper para dia/semana).

export const DIAS_SEMANA_CURTO = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

export interface GradeMensal {
  dias: Date[];
  offsetInicio: number;
}

// eachDayOfInterval entrega meia-noite local — exatamente a borda que a
// convenção do projeto evita (ver dataInputParaISOMeioDia em
// src/lib/tarefas/formato.ts). Ancorar cada dia ao meio-dia deixa a grade
// imune a fuso/horário de verão e comparável a qualquer data persistida.
export function aoMeioDiaLocal(data: Date): Date {
  return new Date(
    data.getFullYear(),
    data.getMonth(),
    data.getDate(),
    12,
    0,
    0,
    0,
  );
}

export function gradeDoMes(mesReferencia: Date): GradeMensal {
  const dias = eachDayOfInterval({
    start: startOfMonth(mesReferencia),
    end: endOfMonth(mesReferencia),
  }).map(aoMeioDiaLocal);
  const offsetInicio = getDay(dias[0]);
  return { dias, offsetInicio };
}
