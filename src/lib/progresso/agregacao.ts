import {
  startOfDay,
  endOfDay,
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

export interface ContagemPeriodo {
  semana: number;
  mes: number;
}

const DIAS_JANELA = 7;
export const JANELA_SEMANA = 7;
export const JANELA_MES = 30;

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

function dentroDosUltimosDias(
  dataISO: string | undefined,
  hoje: Date,
  dias: number,
): boolean {
  if (!dataISO) return false;
  const data = new Date(dataISO);
  if (isNaN(data.getTime())) return false;
  const inicio = startOfDay(subDays(hoje, dias - 1));
  const fim = endOfDay(hoje);
  return data >= inicio && data <= fim;
}

export function tarefasCriadasPorPeriodo(
  tarefas: Task[],
  hoje: Date,
): ContagemPeriodo {
  return {
    semana: tarefas.filter((t) => dentroDosUltimosDias(t.criadaEm, hoje, JANELA_SEMANA))
      .length,
    mes: tarefas.filter((t) => dentroDosUltimosDias(t.criadaEm, hoje, JANELA_MES))
      .length,
  };
}

// Uma tarefa que voltou ao pool mantém concluidaEm antigo (devolverAoPool não o
// limpa) — por isso exige-se também estado === "concluida", senão uma tarefa
// reaberta seria contada como concluída indevidamente.
export function tarefasConcluidasPorPeriodo(
  tarefas: Task[],
  hoje: Date,
): ContagemPeriodo {
  const concluidas = tarefas.filter((t) => t.estado === "concluida");
  return {
    semana: concluidas.filter((t) =>
      dentroDosUltimosDias(t.concluidaEm, hoje, JANELA_SEMANA),
    ).length,
    mes: concluidas.filter((t) =>
      dentroDosUltimosDias(t.concluidaEm, hoje, JANELA_MES),
    ).length,
  };
}

export function tarefasCriadasNoDia(tarefas: Task[], dia: Date): Task[] {
  return tarefas.filter((t) => {
    if (!t.criadaEm) return false;
    const data = new Date(t.criadaEm);
    return !isNaN(data.getTime()) && isSameDay(data, dia);
  });
}

export function tarefasConcluidasNoDia(tarefas: Task[], dia: Date): Task[] {
  return tarefas.filter((t) => {
    if (t.estado !== "concluida" || !t.concluidaEm) return false;
    const data = new Date(t.concluidaEm);
    return !isNaN(data.getTime()) && isSameDay(data, dia);
  });
}
