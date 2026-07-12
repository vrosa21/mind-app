// Chaves de localStorage — nomeadas para espelhar os arquivos que
// futuramente serão sincronizados com o Google Drive (Fase 7).
export const STORAGE_KEYS = {
  tarefas: "mind:tarefas.json",
  timer: "mind:sessoes_timer.json",
  config: "mind:config.json",
  // Fora do escopo original de 3 arquivos — decidir na Fase 7 se isso
  // vira um 4º/5º arquivo sincronizado ou se é dobrado em outro.
  emblemas: "mind:emblemas.json",
  reflexoes: "mind:reflexoes.json",
} as const;

// Estado de sessão local (não sincroniza com o Drive).
export const SESSION_KEYS = {
  desbloqueado: "mind:sessao_desbloqueada",
} as const;
