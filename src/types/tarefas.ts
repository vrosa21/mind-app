export type Pool = "deep" | "admin" | "pessoal" | "urgente-flexivel";

// Estados intencionalmente não incluem nenhuma noção de "falha" —
// tarefas não concluídas apenas retornam para 'disponivel'.
export type EstadoTarefa = "disponivel" | "em-andamento" | "concluida";

export type UnidadeEstimativa = "min" | "horas";

export interface MicroMeta {
  id: string;
  titulo: string;
  estimativaMin: number;
  concluida: boolean;
}

export interface Tag {
  id: string;
  nome: string;
}

export interface Task {
  id: string;
  titulo: string;
  notas?: string;
  pool: Pool;
  // Ausente = sem estimativa (não é o mesmo que zero). Sempre em minutos;
  // estimativaUnidade guarda só a unidade escolhida pra exibição.
  estimativaMin?: number;
  estimativaUnidade?: UnidadeEstimativa;
  microMetas: MicroMeta[];
  estado: EstadoTarefa;
  criadaEm: string;
  ultimaAtividadeEm?: string;
  concluidaEm?: string;
  // Planejamento (não é a data real de conclusão) — puramente informativo.
  previsaoTerminoEm?: string;
  emergencial?: boolean;
  // Ausente = sem tags (retrocompat com tarefas criadas antes deste campo).
  tagIds?: string[];
  // Rotina (Lote E): dias da semana em que a tarefa "aparece" (0=domingo..
  // 6=sábado). Ausente ou vazio = tarefa comum, não recorrente.
  diasSemana?: number[];
  // Fim das repetições da rotina, ISO ao meio-dia local. Ausente = eterna.
  // Não confundir com previsaoTerminoEm (estimativa de conclusão de uma
  // tarefa comum) — são campos independentes.
  repetirAte?: string;
  // "Feito hoje" da rotina: marcador leve que reseta por dia, nunca o
  // estado terminal `concluida`. Ausente ou de outro dia = não feito hoje.
  ultimaConclusao?: string;
}
