export type Paleta = "calma" | "foco" | "suave";
export type IntensidadeNotificacao = "silencioso" | "suave" | "normal";
export type ModoVisualizacaoTarefas = "completa" | "resumida";

export interface Config {
  paleta: Paleta;
  intensidadeNotificacao: IntensidadeNotificacao;
  mostrarTempoDecorrido: boolean;
  senhaHash?: string;
  googleConectado: boolean;
  ultimaSincronizacaoEm?: string;
  modoVisualizacaoTarefas: ModoVisualizacaoTarefas;
}

export const configPadrao: Config = {
  paleta: "calma",
  intensidadeNotificacao: "suave",
  mostrarTempoDecorrido: true,
  googleConectado: false,
  modoVisualizacaoTarefas: "completa",
};
