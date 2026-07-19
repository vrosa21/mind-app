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
