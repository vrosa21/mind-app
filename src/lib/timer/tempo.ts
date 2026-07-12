import type { SessaoAtiva } from "./tipos";

export function segundosDecorridos(sessao: SessaoAtiva, agora = Date.now()): number {
  const desdeRetomada =
    sessao.estado === "ativa"
      ? (agora - new Date(sessao.retomadoEm).getTime()) / 1000
      : 0;
  return sessao.acumuladoSeg + Math.max(0, desdeRetomada);
}

export function formatarTempo(segundosTotais: number): string {
  const seg = Math.max(0, Math.round(segundosTotais));
  const min = Math.floor(seg / 60);
  const rest = seg % 60;
  return `${min}:${rest.toString().padStart(2, "0")}`;
}
