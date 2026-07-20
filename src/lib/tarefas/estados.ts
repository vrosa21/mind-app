import type { EstadoTarefa } from "@/types";

export const ESTADO_LABELS: Record<EstadoTarefa, string> = {
  concluida: "Concluída",
  "em-andamento": "Em andamento",
  disponivel: "Disponível",
};

// Concluídas → Em andamento → Disponíveis.
export const ORDEM_STATUS: Record<EstadoTarefa, number> = {
  concluida: 0,
  "em-andamento": 1,
  disponivel: 2,
};

// Cor é reforço visual, nunca o único sinal — sempre usada junto do rótulo
// de ESTADO_LABELS. Fixas entre paletas (mesma regra do --emergencial em
// globals.css): concluida=azul, em-andamento=verde, disponivel=neutro.
// Vermelho é exclusivo do emergencial, nunca usado aqui.
export const ESTADO_COR_VAR: Record<EstadoTarefa, string> = {
  concluida: "var(--status-concluida)",
  "em-andamento": "var(--status-em-andamento)",
  disponivel: "var(--status-disponivel)",
};
