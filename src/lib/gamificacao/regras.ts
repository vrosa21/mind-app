import type { TipoEmblema } from "@/types";

export interface ContextoConquistas {
  totalSessoesIniciadas: number;
  totalRetomadas: number;
  totalReflexoes: number;
}

export interface RegraEmblema {
  chave: string;
  tipo: TipoEmblema;
  titulo: string;
  descricao: string;
  atingida: (contexto: ContextoConquistas) => boolean;
}

// Emblemas de esforço: reconhecem tentar, se adaptar e refletir — não
// completar. Linguagem direta, sem tom infantilizado.
export const REGRAS_EMBLEMAS: RegraEmblema[] = [
  {
    chave: "primeira-tentativa",
    tipo: "tentativa",
    titulo: "Primeiro passo",
    descricao: "Você iniciou sua primeira sessão de foco.",
    atingida: (c) => c.totalSessoesIniciadas >= 1,
  },
  {
    chave: "dez-tentativas",
    tipo: "tentativa",
    titulo: "Presença constante",
    descricao: "Você já iniciou 10 sessões de foco.",
    atingida: (c) => c.totalSessoesIniciadas >= 10,
  },
  {
    chave: "primeira-retomada",
    tipo: "adaptacao",
    titulo: "Recomeçar conta",
    descricao: "Você pausou e retomou uma sessão — se adaptar é parte do processo.",
    atingida: (c) => c.totalRetomadas >= 1,
  },
  {
    chave: "cinco-retomadas",
    tipo: "adaptacao",
    titulo: "Flexibilidade em ação",
    descricao: "Você já se reorganizou 5 vezes no meio de uma sessão.",
    atingida: (c) => c.totalRetomadas >= 5,
  },
  {
    chave: "primeira-reflexao",
    tipo: "reflexao",
    titulo: "Olhar para dentro",
    descricao: "Você registrou sua primeira reflexão sobre uma sessão.",
    atingida: (c) => c.totalReflexoes >= 1,
  },
  {
    chave: "cinco-reflexoes",
    tipo: "reflexao",
    titulo: "Hábito de refletir",
    descricao: "Você já registrou 5 reflexões sobre suas sessões.",
    atingida: (c) => c.totalReflexoes >= 5,
  },
];
