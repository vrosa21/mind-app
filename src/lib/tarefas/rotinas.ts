import { isSameDay, startOfDay } from "date-fns";
import type { Task } from "@/types";

export function ehRotina(tarefa: Task): boolean {
  return !!tarefa.diasSemana && tarefa.diasSemana.length > 0;
}

// Ordem seg→dom para o seletor (convenção brasileira), com o valor salvo
// em 0=domingo..6=sábado.
export const DIAS_SELETOR: { valor: number; label: string; nome: string }[] = [
  { valor: 1, label: "S", nome: "Segunda" },
  { valor: 2, label: "T", nome: "Terça" },
  { valor: 3, label: "Q", nome: "Quarta" },
  { valor: 4, label: "Q", nome: "Quinta" },
  { valor: 5, label: "S", nome: "Sexta" },
  { valor: 6, label: "S", nome: "Sábado" },
  { valor: 0, label: "D", nome: "Domingo" },
];

export const DIAS_NOME_CURTO: Record<number, string> = {
  0: "dom",
  1: "seg",
  2: "ter",
  3: "qua",
  4: "qui",
  5: "sex",
  6: "sáb",
};

export function formatarDiasSemana(diasSemana: number[]): string {
  return DIAS_SELETOR.filter((d) => diasSemana.includes(d.valor))
    .map((d) => DIAS_NOME_CURTO[d.valor])
    .join(", ");
}

// "Repetir até" inclui o próprio dia: repetirAte no dia 30 ainda aparece
// no dia 30, para de aparecer no dia 31.
export function dentroDoRepetirAte(tarefa: Task, dia: Date): boolean {
  if (!tarefa.repetirAte) return true;
  const limite = new Date(tarefa.repetirAte);
  if (isNaN(limite.getTime())) return true;
  return startOfDay(dia) <= startOfDay(limite);
}

export function rotinaAtivaEm(tarefa: Task, dia: Date): boolean {
  return (
    ehRotina(tarefa) &&
    tarefa.diasSemana!.includes(dia.getDay()) &&
    dentroDoRepetirAte(tarefa, dia)
  );
}

export function feitoHoje(tarefa: Task, hoje: Date): boolean {
  return !!tarefa.ultimaConclusao && isSameDay(new Date(tarefa.ultimaConclusao), hoje);
}
