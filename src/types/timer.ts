export type EstadoSessao = "ativa" | "pausada" | "concluida" | "interrompida";

export interface TimerSession {
  id: string;
  taskId?: string;
  duracaoPlanejadaMin: number;
  iniciadoEm: string;
  encerradoEm?: string;
  tempoDecorridoSeg: number;
  estado: EstadoSessao;
}
