export type Paleta = "calma" | "foco" | "suave";
export type IntensidadeNotificacao = "silencioso" | "suave" | "normal";

export interface Config {
  paleta: Paleta;
  intensidadeNotificacao: IntensidadeNotificacao;
  mostrarTempoDecorrido: boolean;
  senhaHash?: string;
  googleConectado: boolean;
  ultimaSincronizacaoEm?: string;
}

export const configPadrao: Config = {
  paleta: "calma",
  intensidadeNotificacao: "suave",
  mostrarTempoDecorrido: true,
  googleConectado: false,
};
