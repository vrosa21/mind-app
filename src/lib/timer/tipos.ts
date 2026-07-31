// Estado da sessão ativa em memória/persistida — separado de
// `TimerSession` (o registro final de histórico) porque precisa de
// contabilidade extra para sobreviver a pausas e a reloads da página.
export interface SessaoAtiva {
  id: string;
  taskId?: string;
  duracaoPlanejadaMin: number;
  iniciadoEm: string;
  acumuladoSeg: number;
  retomadoEm: string;
  estado: "ativa" | "pausada";
  metadeSinalizada?: boolean;
}
