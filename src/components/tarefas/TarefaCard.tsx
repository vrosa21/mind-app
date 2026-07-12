"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTarefasStore } from "@/stores/tarefasStore";
import { useTimerStore } from "@/stores/timerStore";
import { POOL_LABELS } from "@/lib/tarefas/pools";
import { precisaQuebra } from "@/lib/tarefas/microMetas";
import { TarefaCamposForm } from "./TarefaCamposForm";
import type { Task, Pool } from "@/types";

export function TarefaCard({ tarefa }: { tarefa: Task }) {
  const router = useRouter();
  const alternarMicroMeta = useTarefasStore((s) => s.alternarMicroMeta);
  const iniciarTarefa = useTarefasStore((s) => s.iniciarTarefa);
  const concluirTarefa = useTarefasStore((s) => s.concluirTarefa);
  const excluirTarefa = useTarefasStore((s) => s.excluirTarefa);
  const atualizarTarefa = useTarefasStore((s) => s.atualizarTarefa);
  const iniciarSessao = useTimerStore((s) => s.iniciarSessao);
  const encerrarSessao = useTimerStore((s) => s.encerrar);
  const sessaoAtual = useTimerStore((s) => s.sessaoAtual);

  const [editando, setEditando] = useState(false);
  const [titulo, setTitulo] = useState(tarefa.titulo);
  const [notas, setNotas] = useState(tarefa.notas ?? "");
  const [pool, setPool] = useState<Pool>(tarefa.pool);
  const [estimativaMin, setEstimativaMin] = useState(tarefa.estimativaMin);

  const concluida = tarefa.estado === "concluida";
  const timerOcupado = !!sessaoAtual;

  function abrirEdicao() {
    setTitulo(tarefa.titulo);
    setNotas(tarefa.notas ?? "");
    setPool(tarefa.pool);
    setEstimativaMin(tarefa.estimativaMin);
    setEditando(true);
  }

  function salvarEdicao(e: React.FormEvent) {
    e.preventDefault();
    if (!titulo.trim()) return;
    atualizarTarefa(tarefa.id, {
      titulo: titulo.trim(),
      notas: notas.trim() || undefined,
      pool,
      estimativaMin,
    });
    setEditando(false);
  }

  function iniciarComTimer(duracaoMin: number) {
    iniciarTarefa(tarefa.id);
    iniciarSessao(duracaoMin, tarefa.id);
    router.push("/");
  }

  function handleConcluir() {
    concluirTarefa(tarefa.id);
    // Se havia um timer rodando para esta tarefa, encerra como
    // "concluida" — a tarefa já está marcada como concluída, então
    // devolverAoPool (Fase 3) não vai reabri-la.
    if (sessaoAtual?.taskId === tarefa.id) {
      encerrarSessao("concluida");
    }
  }

  if (editando) {
    const cruzaLimiar =
      precisaQuebra(estimativaMin) !== precisaQuebra(tarefa.estimativaMin);
    return (
      <form
        onSubmit={salvarEdicao}
        className="flex flex-col gap-3 rounded-lg border border-[var(--border)] p-4"
      >
        <TarefaCamposForm
          titulo={titulo}
          setTitulo={setTitulo}
          notas={notas}
          setNotas={setNotas}
          pool={pool}
          setPool={setPool}
          estimativaMin={estimativaMin}
          setEstimativaMin={setEstimativaMin}
          autoFocus
        />
        {cruzaLimiar && (
          <p className="text-xs opacity-60">
            A estimativa vai cruzar os 25 min — as micro-metas serão recriadas.
          </p>
        )}
        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-foreground)]"
          >
            Salvar
          </button>
          <button
            type="button"
            onClick={() => setEditando(false)}
            className="rounded-full px-4 py-2 text-sm opacity-60 hover:opacity-100"
          >
            Cancelar
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-[var(--border)] p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className={concluida ? "opacity-60 line-through" : "font-medium"}>
            {tarefa.titulo}
          </p>
          <p className="text-xs opacity-60">
            {POOL_LABELS[tarefa.pool]} · {tarefa.estimativaMin} min
          </p>
          {tarefa.notas && (
            <p className="mt-1 text-sm opacity-70">{tarefa.notas}</p>
          )}
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={abrirEdicao}
            className="text-xs opacity-40 hover:opacity-80"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => excluirTarefa(tarefa.id)}
            className="text-xs opacity-40 hover:opacity-80"
          >
            Remover
          </button>
        </div>
      </div>

      {tarefa.microMetas.length > 0 && (
        <ul className="mt-1 flex flex-col gap-1">
          {tarefa.microMetas.map((m) => (
            <li
              key={m.id}
              className="flex items-center justify-between gap-2 text-sm"
            >
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={m.concluida}
                  onChange={() => alternarMicroMeta(tarefa.id, m.id)}
                />
                <span className={m.concluida ? "opacity-50 line-through" : ""}>
                  {m.titulo} · {m.estimativaMin} min
                </span>
              </label>
              {!concluida && !m.concluida && (
                <button
                  type="button"
                  disabled={timerOcupado}
                  onClick={() => iniciarComTimer(m.estimativaMin)}
                  className="rounded-full border border-[var(--border)] px-2 py-0.5 text-xs opacity-70 hover:opacity-100 disabled:opacity-30"
                >
                  Iniciar
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {!concluida && (
        <div className="mt-1 flex gap-2">
          {tarefa.microMetas.length === 0 && (
            <button
              type="button"
              disabled={timerOcupado}
              onClick={() => iniciarComTimer(tarefa.estimativaMin)}
              className="rounded-full border border-[var(--border)] px-3 py-1 text-xs opacity-70 hover:opacity-100 disabled:opacity-30"
            >
              Iniciar
            </button>
          )}
          <button
            type="button"
            onClick={handleConcluir}
            className="rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-medium text-[var(--accent-foreground)]"
          >
            Concluir
          </button>
        </div>
      )}
    </div>
  );
}
