import { formatarTempo } from "@/lib/timer/tempo";

interface TimerVisualProps {
  progressoRestante: number;
  tempoRestanteSeg: number;
  tempoDecorridoSeg: number;
  mostrarTempoDecorrido: boolean;
}

export function TimerVisual({
  progressoRestante,
  tempoRestanteSeg,
  tempoDecorridoSeg,
  mostrarTempoDecorrido,
}: TimerVisualProps) {
  const angulo = Math.max(0, Math.min(1, progressoRestante)) * 360;

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        role="img"
        aria-label={`Tempo restante: ${formatarTempo(tempoRestanteSeg)}`}
        className="h-56 w-56 rounded-full border border-[var(--border)] transition-[background] duration-1000 ease-linear"
        style={{
          background: `conic-gradient(var(--accent) ${angulo}deg, var(--muted) ${angulo}deg 360deg)`,
        }}
      />
      <p className="text-3xl font-semibold tabular-nums">
        {formatarTempo(tempoRestanteSeg)}
      </p>
      {mostrarTempoDecorrido && (
        <p className="text-sm tabular-nums opacity-60">
          Decorrido: {formatarTempo(tempoDecorridoSeg)}
        </p>
      )}
    </div>
  );
}
