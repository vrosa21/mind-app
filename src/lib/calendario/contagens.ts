import type { Task } from "@/types";
import {
  tarefasCriadasNoDia,
  tarefasConcluidasNoDia,
} from "@/lib/progresso/agregacao";
import { gradeDoMes } from "./grade";

// Composição fina — nenhuma lógica de contagem nova. As mesmas funções que
// alimentam os cards de 7 dias do /progresso (agregacao.ts) alimentam o
// calendário, para que os números batam por construção.

export interface ContagemDia {
  data: Date;
  criadas: number;
  concluidas: number;
}

export function contagensPorDiaDoMes(
  tarefas: Task[],
  mesReferencia: Date,
): ContagemDia[] {
  const { dias } = gradeDoMes(mesReferencia);
  return dias.map((data) => ({
    data,
    criadas: tarefasCriadasNoDia(tarefas, data).length,
    concluidas: tarefasConcluidasNoDia(tarefas, data).length,
  }));
}
