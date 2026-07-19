import { format, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { UnidadeEstimativa } from "@/types";

export function formatarData(iso?: string): string {
  if (!iso) return "—";
  const data = new Date(iso);
  if (!isValid(data)) return "—";
  return format(data, "dd/MM/yyyy", { locale: ptBR });
}

function horasComoTexto(estimativaMin: number): string {
  const horas = estimativaMin / 60;
  return Number.isInteger(horas) ? String(horas) : horas.toFixed(1);
}

export function formatarEstimativa(
  estimativaMin?: number,
  unidade?: UnidadeEstimativa,
): string {
  if (estimativaMin === undefined) return "—";
  if (unidade === "horas") return `${horasComoTexto(estimativaMin)}h`;
  return `${estimativaMin}min`;
}

// Texto editável (sem sufixo) para preencher o campo de estimativa ao abrir
// a edição de uma tarefa existente.
export function estimativaParaTexto(
  estimativaMin?: number,
  unidade?: UnidadeEstimativa,
): string {
  if (estimativaMin === undefined) return "";
  if (unidade === "horas") return horasComoTexto(estimativaMin);
  return String(estimativaMin);
}

// Converte o valor digitado (na unidade escolhida) para minutos, na borda
// do formulário. Vazio, não numérico ou <= 0 vira "sem estimativa" — nunca
// zero, nunca erro.
export function analisarEstimativa(
  valorDigitado: string,
  unidade: UnidadeEstimativa,
): { estimativaMin?: number; estimativaUnidade?: UnidadeEstimativa } {
  const numero = Number(valorDigitado.replace(",", "."));
  if (!valorDigitado.trim() || !Number.isFinite(numero) || numero <= 0) {
    return { estimativaMin: undefined, estimativaUnidade: undefined };
  }
  const estimativaMin = Math.round(unidade === "horas" ? numero * 60 : numero);
  return { estimativaMin, estimativaUnidade: unidade };
}

// Converte o valor de um <input type="date"> (yyyy-MM-dd) para ISO ao meio-dia
// local — evita que a data salva pule de dia perto da virada de fuso.
export function dataInputParaISOMeioDia(dataYYYYMMDD: string): string {
  const [ano, mes, dia] = dataYYYYMMDD.split("-").map(Number);
  return new Date(ano, mes - 1, dia, 12, 0, 0).toISOString();
}

export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}
