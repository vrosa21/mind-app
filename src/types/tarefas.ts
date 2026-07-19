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
}
