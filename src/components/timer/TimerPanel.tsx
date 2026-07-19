"use client";

import { useEffect, useState } from "react";
import { useTimerStore } from "@/stores/timerStore";
import { useConfigStore } from "@/stores/configStore";
import { useTarefasStore } from "@/stores/tarefasStore";
import { useReflexoesStore } from "@/stores/reflexoesStore";
import { useHidratado } from "@/hooks/useHidratado";
import { segundosDecorridos } from "@/lib/timer/tempo";
import { tocarChime } from "@/lib/timer/chime";
import { DURACOES_RAPIDAS } from "@/lib/timer/constantes";
import { OPCOES_HUMOR } from "@/lib/reflexao/humor";
import { TimerVisual } from "./TimerVisual";
import { TelaCarregando } from "@/components/layout/TelaCarregando";
import type { Humor } from "@/types";

export function TimerPanel() {
  const timerHidratado = useHidratado(useTimerStore.persist);
  const reflexoesHidratado = useHidratado(useReflexoesStore.persist);
  const hidratado = timerHidratado && reflexoesHidratado;

  const sessaoAtual = useTimerStore((s) => s.sessaoAtual);
  const ultimoRegistro = useTimerStore((s) => s.historico[0]);
  const iniciarSessao = useTimerStore((s) => s.iniciarSessao);
  const pausar = useTimerStore((s) => s.pausar);
  const retomar = useTimerStore((s) => s.retomar);
  const encerrar = useTimerStore((s) => s.encerrar);
  const registrarReflexao = useReflexoesStore((s) => s.registrarReflexao);
  const jaRefletida = useReflexoesStore((s) =>
    ultimoRegistro
      ? s.reflexoes.some((r) => r.sessionId === ultimoRegistro.id)
      : false,
  );

  const intensidadeNotificacao = useConfigStore((s) => s.intensidadeNotificacao);
  const mostrarTempoDecorrido = useConfigStore((s) => s.mostrarTempoDecorrido);
  const tituloTarefaVinculada = useTarefasStore((s) =>
    sessaoAtual?.taskId
      ? s.tarefas.find((t) => t.id === sessaoAtual.taskId)?.titulo
      : undefined,
  );

  const [duracaoEscolhida, setDuracaoEscolhida] = useState(25);
  const [, forcarTick] = useState(0);
  const [humorEscolhido, setHumorEscolhido] = useState<Humor | null>(null);
  const [textoReflexao, setTextoReflexao] = useState("");
  const [reflexaoDispensadaId, setReflexaoDispensadaId] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (sessaoAtual?.estado !== "ativa") return;
    const intervalo = setInterval(() => forcarTick((n) => n + 1), 1000);
    return () => clearInterval(intervalo);
  }, [sessaoAtual?.estado]);

  useEffect(() => {
    if (!sessaoAtual || sessaoAtual.estado !== "ativa") return;
    const totalSeg = sessaoAtual.duracaoPlanejadaMin * 60;
    if (segundosDecorridos(sessaoAtual) >= totalSeg) {
      encerrar("concluida");
      tocarChime(intensidadeNotificacao);
    }
  }, [sessaoAtual, intensidadeNotificacao, encerrar]);

  if (!hidratado) return <TelaCarregando />;

  if (!sessaoAtual) {
    const mostrarFormReflexao =
      !!ultimoRegistro &&
      !jaRefletida &&
      ultimoRegistro.id !== reflexaoDispensadaId;
    const podeRegistrar = humorEscolhido !== null || textoReflexao.trim() !== "";

    return (
      <div className="flex flex-col items-center gap-6 py-8">
        {ultimoRegistro?.estado === "concluida" && (
          <p className="text-sm text-[var(--accent)]" role="status">
            Sessão concluída — bom trabalho.
          </p>
        )}
        {mostrarFormReflexao && ultimoRegistro && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!podeRegistrar) return;
              registrarReflexao({
                sessionId: ultimoRegistro.id,
                humor: humorEscolhido ?? undefined,
                texto: textoReflexao.trim() || undefined,
              });
              setHumorEscolhido(null);
              setTextoReflexao("");
            }}
            className="flex w-full max-w-sm flex-col gap-2 rounded-lg border border-[var(--border)] p-3"
          >
            <label className="text-xs opacity-70">
              Quer registrar algo sobre essa sessão? (opcional)
            </label>
            <div className="flex gap-1">
              {OPCOES_HUMOR.map((op) => (
                <button
                  key={op.valor}
                  type="button"
                  title={op.label}
                  aria-pressed={humorEscolhido === op.valor}
                  onClick={() =>
                    setHumorEscolhido(
                      humorEscolhido === op.valor ? null : op.valor,
                    )
                  }
                  className={
                    humorEscolhido === op.valor
                      ? "rounded-full bg-[var(--accent)] px-2 py-1 text-lg"
                      : "rounded-full border border-[var(--border)] px-2 py-1 text-lg opacity-60 hover:opacity-100"
                  }
                >
                  {op.emoji}
                </button>
              ))}
            </div>
            <textarea
              value={textoReflexao}
              onChange={(e) => setTextoReflexao(e.target.value)}
              rows={2}
              className="resize-none rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={!podeRegistrar}
                className="rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-medium text-[var(--accent-foreground)] disabled:opacity-40"
              >
                Registrar
              </button>
              <button
                type="button"
                onClick={() => {
                  setReflexaoDispensadaId(ultimoRegistro.id);
                  setHumorEscolhido(null);
                  setTextoReflexao("");
                }}
                className="rounded-full px-3 py-1 text-xs opacity-60 hover:opacity-100"
              >
                Pular
              </button>
            </div>
          </form>
        )}
        <p className="text-sm opacity-70">Quanto tempo você quer focar?</p>
        <div className="flex gap-2">
          {DURACOES_RAPIDAS.map((min) => (
            <button
              key={min}
              type="button"
              onClick={() => setDuracaoEscolhida(min)}
              className={
                duracaoEscolhida === min
                  ? "rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-foreground)]"
                  : "rounded-full border border-[var(--border)] px-4 py-2 text-sm opacity-70 hover:opacity-100"
              }
            >
              {min} min
            </button>
          ))}
        </div>
        <input
          type="number"
          min={1}
          max={180}
          value={duracaoEscolhida}
          onChange={(e) => setDuracaoEscolhida(Number(e.target.value) || 1)}
          className="w-24 rounded-lg border border-[var(--border)] bg-transparent px-3 py-1 text-center outline-none focus:border-[var(--accent)]"
        />
        <button
          type="button"
          onClick={() => iniciarSessao(duracaoEscolhida)}
          className="rounded-full bg-[var(--accent)] px-6 py-2 font-medium text-[var(--accent-foreground)]"
        >
          Iniciar
        </button>
      </div>
    );
  }

  const totalSeg = sessaoAtual.duracaoPlanejadaMin * 60;
  const decorridoSeg = segundosDecorridos(sessaoAtual);
  const restanteSeg = Math.max(0, totalSeg - decorridoSeg);
  const progressoRestante = totalSeg > 0 ? restanteSeg / totalSeg : 0;

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      {tituloTarefaVinculada && (
        <p className="text-sm opacity-70">{tituloTarefaVinculada}</p>
      )}
      <TimerVisual
        progressoRestante={progressoRestante}
        tempoRestanteSeg={restanteSeg}
        tempoDecorridoSeg={decorridoSeg}
        mostrarTempoDecorrido={mostrarTempoDecorrido}
      />
      {sessaoAtual.estado === "pausada" && (
        <p className="text-sm opacity-60">Pausado</p>
      )}
      <div className="flex gap-3">
        {sessaoAtual.estado === "ativa" ? (
          <button
            type="button"
            onClick={pausar}
            className="rounded-full border border-[var(--border)] px-5 py-2 font-medium hover:bg-[var(--muted)]"
          >
            Pausar
          </button>
        ) : (
          <button
            type="button"
            onClick={retomar}
            className="rounded-full bg-[var(--accent)] px-5 py-2 font-medium text-[var(--accent-foreground)]"
          >
            Retomar
          </button>
        )}
        <button
          type="button"
          onClick={() => encerrar("interrompida")}
          className="rounded-full px-5 py-2 font-medium opacity-60 hover:opacity-100"
        >
          Encerrar
        </button>
      </div>
    </div>
  );
}
