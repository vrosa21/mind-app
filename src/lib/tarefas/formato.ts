import { format, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatarData(iso?: string): string {
  if (!iso) return "—";
  const data = new Date(iso);
  if (!isValid(data)) return "—";
  return format(data, "dd/MM/yyyy", { locale: ptBR });
}

export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}
