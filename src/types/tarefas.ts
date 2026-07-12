export type Pool = "deep" | "admin" | "pessoal" | "urgente-flexivel";

// Estados intencionalmente não incluem nenhuma noção de "falha" —
// tarefas não concluídas apenas retornam para 'disponivel'.
export type EstadoTarefa = "disponivel" | "em-andamento" | "concluida";

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
  estimativaMin: number;
  microMetas: MicroMeta[];
  estado: EstadoTarefa;
  criadaEm: string;
  ultimaAtividadeEm?: string;
  concluidaEm?: string;
}
