import type { ContagemPeriodo } from "@/lib/progresso/agregacao";

interface CartaoIndicadorPeriodoProps {
  titulo: string;
  contagem: ContagemPeriodo;
  unidade: string;
}

export function CartaoIndicadorPeriodo({
  titulo,
  contagem,
  unidade,
}: CartaoIndicadorPeriodoProps) {
  return (
    <div className="flex flex-1 flex-col gap-3 rounded-lg border border-[var(--border)] p-4">
      <h3 className="text-sm font-semibold opacity-70">{titulo}</h3>
      <div className="flex gap-6">
        <div className="flex flex-col">
          <span className="text-2xl font-semibold">{contagem.semana}</span>
          <span className="text-xs opacity-50">
            {unidade} · últimos 7 dias
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-semibold">{contagem.mes}</span>
          <span className="text-xs opacity-50">
            {unidade} · últimos 30 dias
          </span>
        </div>
      </div>
    </div>
  );
}
