import {
  startOfDay,
  subDays,
  isSameDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from "date-fns";
import type { TimerSession, Task } from "@/types";

export interface PontoDiario {
  data: Date;
  valor: number;
}

const DIAS_JANELA = 7;

export function ultimosDias(hoje: Date, quantidade = DIAS_JANELA): Date[] {
  return Array.from({ length: quantidade }, (_, i) =>
    startOfDay(subDays(hoje, quantidade - 1 - i)),
  );
}

export function minutosFocadosPorDia(
  historico: TimerSession[],
  hoje: Date,
): PontoDiario[] {
  return ultimosDias(hoje).map((data) => {
    const totalSeg = historico
      .filter((h) => isSameDay(new Date(h.iniciadoEm), data))
      .reduce((soma, h) => soma + h.tempoDecorridoSeg, 0);
    return { data, valor: Math.round(totalSeg / 60) };
  });
}

export function tarefasConcluidasPorDia(tarefas: Task[], hoje: Date): PontoDiario[] {
  return ultimosDias(hoje).map((data) => {
    const total = tarefas.filter(
      (t) => t.concluidaEm && isSameDay(new Date(t.concluidaEm), data),
    ).length;
    return { data, valor: total };
  });
}

export function minutosFocadosPorTarefa(
  historico: TimerSession[],
  taskId: string,
): number {
  const totalSeg = historico
    .filter((h) => h.taskId === taskId)
    .reduce((soma, h) => soma + h.tempoDecorridoSeg, 0);
  return Math.round(totalSeg / 60);
}

export function tarefasConcluidasPorDiaDoMes(
  tarefas: Task[],
  mesReferencia: Date,
): PontoDiario[] {
  const dias = eachDayOfInterval({
    start: startOfMonth(mesReferencia),
    end: endOfMonth(mesReferencia),
  });
  return dias.map((data) => {
    const total = tarefas.filter(
      (t) => t.concluidaEm && isSameDay(new Date(t.concluidaEm), data),
    ).length;
    return { data, valor: total };
  });
}
