import { eachDayOfInterval, endOfMonth, isSameDay, startOfMonth } from "date-fns";
import type { Reflexao, Humor } from "@/types";

export interface DiaComSaldo {
  data: Date;
  humor?: Humor;
}

export function saldoDoDiaPorDiaDoMes(
  reflexoes: Reflexao[],
  mesReferencia: Date,
): DiaComSaldo[] {
  const registrosDoDia = reflexoes
    .filter((r) => !r.sessionId && r.humor)
    .sort(
      (a, b) => new Date(b.criadaEm).getTime() - new Date(a.criadaEm).getTime(),
    );

  const dias = eachDayOfInterval({
    start: startOfMonth(mesReferencia),
    end: endOfMonth(mesReferencia),
  });

  return dias.map((data) => ({
    data,
    humor: registrosDoDia.find((r) => isSameDay(new Date(r.criadaEm), data))
      ?.humor,
  }));
}
