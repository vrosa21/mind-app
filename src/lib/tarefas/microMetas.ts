import type { MicroMeta } from "@/types";

const LIMITE_SEM_QUEBRA_MIN = 25;
const TAMANHO_ALVO_BLOCO_MIN = 20;

export function precisaQuebra(estimativaMin: number): boolean {
  return estimativaMin > LIMITE_SEM_QUEBRA_MIN;
}

// Acima de 25 min, quebra em blocos de ~15–20 min — sem IA, só
// aritmética simples — para reduzir a paralisia de iniciação diante
// de tarefas grandes.
export function gerarMicroMetas(estimativaMin: number): MicroMeta[] {
  if (!precisaQuebra(estimativaMin)) return [];

  const numBlocos = Math.ceil(estimativaMin / TAMANHO_ALVO_BLOCO_MIN);
  const base = Math.floor(estimativaMin / numBlocos);
  const resto = estimativaMin % numBlocos;

  return Array.from({ length: numBlocos }, (_, i) => ({
    id: crypto.randomUUID(),
    titulo: `Parte ${i + 1}`,
    estimativaMin: base + (i < resto ? 1 : 0),
    concluida: false,
  }));
}
