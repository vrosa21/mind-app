"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTarefasStore } from "@/stores/tarefasStore";
import { useTimerStore } from "@/stores/timerStore";
import { POOL_LABELS } from "@/lib/tarefas/pools";
import { precisaQuebra } from "@/lib/tarefas/microMetas";
import { format } from "date-fns";
import { formatarData } from "@/lib/tarefas/formato";
import { minutosFocadosPorTarefa } from "@/lib/progresso/agregacao";
import { TarefaCamposForm } from "./TarefaCamposForm";
import type { Task, Pool, ModoVisualizacaoTarefas } from "@/types";

export function TarefaCard({
  tarefa,
  modo = "completa",
}: {
  tarefa: Task;
  modo?: ModoVisualizacaoTarefas;
}) {
  const router = useRouter();
  const alternarMicroMeta = useTarefasStore((s) => s.alternarMicroMeta);
  const editarMicroMeta = useTarefasStore((s) => s.editarMicroMeta);
  const iniciarTarefa = useTarefasStore((s) => s.iniciarTarefa);
  const concluirTarefa = useTarefasStore((s) => s.concluirTarefa);
  const editarConclusao = useTarefasStore((s) => s.editarConclusao);
  const excluirTarefa = useTarefasStore((s) => s.excluirTarefa);
  const duplicarTarefa = useTarefasStore((s) => s.duplicarTarefa);
  const atualizarTarefa = useTarefasStore((s) => s.atualizarTarefa);
  const iniciarSessao = useTimerStore((s) => s.iniciarSessao);
  const encerrarSessao = useTimerStore((s) => s.encerrar);
  const sessaoAtual = useTimerStore((s) => s.sessaoAtual);
  const historicoTimer = useTimerStore((s) => s.historico);

  const [editando, setEditando] = useState(false);
  const [titulo, setTitulo] = useState(tarefa.titulo);
  const [notas, setNotas] = useState(tarefa.notas ?? "");
  const [pool, setPool] = useState<Pool>(tarefa.pool);
  const [estimativaMin, setEstimativaMin] = useState(tarefa.estimativaMin);
  const [editandoMicroMetaId, setEditandoMicroMetaId] = useState<string | null>(
    null,
  );
  const [tituloMicroMetaRascunho, setTituloMicroMetaRascunho] = useState("");
  const [editandoConclusao, setEditandoConclusao] = useState(false);

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

  function abrirEdicaoMicroMeta(m: { id: string; titulo: string }) {
    setEditandoMicroMetaId(m.id);
    setTituloMicroMetaRascunho(m.titulo);
  }

  function salvarMicroMeta(microMetaId: string) {
    const tituloLimpo = tituloMicroMetaRascunho.trim();
    if (tituloLimpo) {
      editarMicroMeta(tarefa.id, microMetaId, tituloLimpo);
    }
    setEditandoMicroMetaId(null);
  }

  function salvarConclusao(dataYYYYMMDD: string) {
    if (!dataYYYYMMDD) return;
    const [ano, mes, dia] = dataYYYYMMDD.split("-").map(Number);
    const dataMeioDia = new Date(ano, mes - 1, dia, 12, 0, 0);
    editarConclusao(tarefa.id, dataMeioDia.toISOString());
    setEditandoConclusao(false);
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

  if (modo === "resumida") {
    const minutosFocados = minutosFocadosPorTarefa(historicoTimer, tarefa.id);
    return (
      <div className="flex items-center justify-between gap-2 rounded-lg border border-[var(--border)] p-4">
        <p className={concluida ? "opacity-60 line-through" : "font-medium"}>
          {tarefa.titulo}
        </p>
        <p className="shrink-0 text-xs opacity-60">
          {minutosFocados} min focados · {POOL_LABELS[tarefa.pool]}
        </p>
      </div>
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
            {POOL_LABELS[tarefa.pool]} · {tarefa.estimativaMin} min · Criada em{" "}
            {formatarData(tarefa.criadaEm)}
          </p>
          {tarefa.notas && (
            <p className="mt-1 text-sm opacity-70">{tarefa.notas}</p>
          )}
          {concluida &&
            (editandoConclusao ? (
              <div className="mt-1 flex items-center gap-2 text-xs">
                <input
                  type="date"
                  autoFocus
                  defaultValue={
                    tarefa.concluidaEm
                      ? format(new Date(tarefa.concluidaEm), "yyyy-MM-dd")
                      : undefined
                  }
                  onChange={(e) => salvarConclusao(e.target.value)}
                  className="rounded border border-[var(--border)] bg-transparent px-2 py-1"
                />
                <button
                  type="button"
                  onClick={() => setEditandoConclusao(false)}
                  className="opacity-40 hover:opacity-80"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <p className="mt-1 text-xs opacity-60">
                Concluída em {formatarData(tarefa.concluidaEm)}{" "}
                <button
                  type="button"
                  onClick={() => setEditandoConclusao(true)}
                  className="opacity-70 underline hover:opacity-100"
                >
                  editar
                </button>
              </p>
            ))}
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
            onClick={() => duplicarTarefa(tarefa.id)}
            className="text-xs opacity-40 hover:opacity-80"
          >
            Duplicar
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
          {tarefa.microMetas.map((m) =>
            editandoMicroMetaId === m.id ? (
              <li key={m.id} className="flex items-center gap-2 text-sm">
                <input
                  type="text"
                  value={tituloMicroMetaRascunho}
                  onChange={(e) => setTituloMicroMetaRascunho(e.target.value)}
                  autoFocus
                  className="min-w-0 flex-1 rounded border border-[var(--border)] bg-transparent px-2 py-1 text-sm"
                />
                <button
                  type="button"
                  onClick={() => salvarMicroMeta(m.id)}
                  className="text-xs opacity-70 hover:opacity-100"
                >
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={() => setEditandoMicroMetaId(null)}
                  className="text-xs opacity-40 hover:opacity-80"
                >
                  Cancelar
                </button>
              </li>
            ) : (
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
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => abrirEdicaoMicroMeta(m)}
                    className="text-xs opacity-40 hover:opacity-80"
                  >
                    Editar
                  </button>
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
                </div>
              </li>
            ),
          )}
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
