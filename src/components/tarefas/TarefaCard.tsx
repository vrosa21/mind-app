"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTarefasStore } from "@/stores/tarefasStore";
import { useTimerStore } from "@/stores/timerStore";
import { POOL_LABELS } from "@/lib/tarefas/pools";
import { precisaQuebra } from "@/lib/tarefas/microMetas";
import { format } from "date-fns";
import {
  formatarData,
  formatarEstimativa,
  estimativaParaTexto,
  analisarEstimativa,
  dataInputParaISOMeioDia,
} from "@/lib/tarefas/formato";
import { minutosFocadosPorTarefa } from "@/lib/progresso/agregacao";
import { DURACOES_RAPIDAS } from "@/lib/timer/constantes";
import { TarefaCamposForm } from "./TarefaCamposForm";
import type { Task, Pool, ModoVisualizacaoTarefas, UnidadeEstimativa } from "@/types";

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
  const editarPrevisaoTermino = useTarefasStore((s) => s.editarPrevisaoTermino);
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
  const [estimativaValor, setEstimativaValor] = useState("");
  const [estimativaUnidade, setEstimativaUnidade] =
    useState<UnidadeEstimativa>("min");
  const [emergencial, setEmergencial] = useState(tarefa.emergencial ?? false);
  const [editandoMicroMetaId, setEditandoMicroMetaId] = useState<string | null>(
    null,
  );
  const [tituloMicroMetaRascunho, setTituloMicroMetaRascunho] = useState("");
  const [editandoConclusao, setEditandoConclusao] = useState(false);
  const [editandoPrevisao, setEditandoPrevisao] = useState(false);
  const [escolhendoDuracao, setEscolhendoDuracao] = useState(false);
  const [duracaoEscolhida, setDuracaoEscolhida] = useState(DURACOES_RAPIDAS[1]);

  const concluida = tarefa.estado === "concluida";
  const timerOcupado = !!sessaoAtual;

  function abrirEdicao() {
    setTitulo(tarefa.titulo);
    setNotas(tarefa.notas ?? "");
    setPool(tarefa.pool);
    setEstimativaValor(
      estimativaParaTexto(tarefa.estimativaMin, tarefa.estimativaUnidade),
    );
    setEstimativaUnidade(tarefa.estimativaUnidade ?? "min");
    setEmergencial(tarefa.emergencial ?? false);
    setEditando(true);
  }

  function salvarEdicao(e: React.FormEvent) {
    e.preventDefault();
    if (!titulo.trim()) return;
    const { estimativaMin, estimativaUnidade: unidadeSalva } = analisarEstimativa(
      estimativaValor,
      estimativaUnidade,
    );
    atualizarTarefa(tarefa.id, {
      titulo: titulo.trim(),
      notas: notas.trim() || undefined,
      pool,
      estimativaMin,
      estimativaUnidade: unidadeSalva,
      emergencial,
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
    editarConclusao(tarefa.id, dataInputParaISOMeioDia(dataYYYYMMDD));
  }

  function salvarPrevisao(dataYYYYMMDD: string) {
    if (!dataYYYYMMDD) return;
    editarPrevisaoTermino(tarefa.id, dataInputParaISOMeioDia(dataYYYYMMDD));
  }

  function iniciarComTimer(duracaoMin: number) {
    iniciarTarefa(tarefa.id);
    iniciarSessao(duracaoMin, tarefa.id);
    router.push("/");
  }

  function cliqueIniciarTarefaInteira() {
    if (tarefa.estimativaMin !== undefined) {
      iniciarComTimer(tarefa.estimativaMin);
      return;
    }
    setEscolhendoDuracao(true);
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
    const { estimativaMin: estimativaMinPreview } = analisarEstimativa(
      estimativaValor,
      estimativaUnidade,
    );
    const cruzaLimiar =
      precisaQuebra(estimativaMinPreview) !== precisaQuebra(tarefa.estimativaMin);
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
          estimativaValor={estimativaValor}
          setEstimativaValor={setEstimativaValor}
          estimativaUnidade={estimativaUnidade}
          setEstimativaUnidade={setEstimativaUnidade}
          emergencial={emergencial}
          setEmergencial={setEmergencial}
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

  const estiloEmergencial = tarefa.emergencial
    ? { borderLeftColor: "var(--emergencial)", borderLeftWidth: 4 }
    : undefined;

  if (modo === "resumida") {
    const minutosFocados = minutosFocadosPorTarefa(historicoTimer, tarefa.id);
    return (
      <div
        style={estiloEmergencial}
        className="flex items-center justify-between gap-2 rounded-lg border border-[var(--border)] p-4"
      >
        <div className="flex items-center gap-2">
          <p className={concluida ? "opacity-60 line-through" : "font-medium"}>
            {tarefa.titulo}
          </p>
          {tarefa.emergencial && (
            <span className="text-xs font-medium text-[var(--emergencial)]">
              Emergencial
            </span>
          )}
        </div>
        <p className="shrink-0 text-xs opacity-60">
          {minutosFocados} min focados · {POOL_LABELS[tarefa.pool]}
        </p>
      </div>
    );
  }

  return (
    <div
      style={estiloEmergencial}
      className="flex flex-col gap-2 rounded-lg border border-[var(--border)] p-4"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <p className={concluida ? "opacity-60 line-through" : "font-medium"}>
              {tarefa.titulo}
            </p>
            {tarefa.emergencial && (
              <span className="rounded-full border border-[var(--emergencial)] px-2 py-0.5 text-xs font-medium text-[var(--emergencial)]">
                Emergencial
              </span>
            )}
          </div>
          <p className="text-xs opacity-60">
            {POOL_LABELS[tarefa.pool]} ·{" "}
            {formatarEstimativa(tarefa.estimativaMin, tarefa.estimativaUnidade)} ·
            Criada em {formatarData(tarefa.criadaEm)}
          </p>
          {tarefa.notas && (
            <p className="mt-1 text-sm opacity-70">{tarefa.notas}</p>
          )}
          {editandoPrevisao ? (
            <div className="mt-1 flex items-center gap-2 text-xs">
              <input
                type="date"
                autoFocus
                defaultValue={
                  tarefa.previsaoTerminoEm
                    ? format(new Date(tarefa.previsaoTerminoEm), "yyyy-MM-dd")
                    : undefined
                }
                onChange={(e) => salvarPrevisao(e.target.value)}
                onBlur={() => setEditandoPrevisao(false)}
                className="rounded border border-[var(--border)] bg-transparent px-2 py-1"
              />
              <button
                type="button"
                onClick={() => setEditandoPrevisao(false)}
                className="opacity-40 hover:opacity-80"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <p className="mt-1 text-xs opacity-60">
              Previsão de término: {formatarData(tarefa.previsaoTerminoEm)}{" "}
              <button
                type="button"
                onClick={() => setEditandoPrevisao(true)}
                className="opacity-70 underline hover:opacity-100"
              >
                editar
              </button>
            </p>
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
                  onBlur={() => setEditandoConclusao(false)}
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

      {!concluida && tarefa.microMetas.length === 0 && escolhendoDuracao && (
        <div className="mt-1 flex flex-wrap items-center gap-2 rounded-lg border border-[var(--border)] p-2">
          <span className="text-xs opacity-70">Quanto tempo focar?</span>
          {DURACOES_RAPIDAS.map((min) => (
            <button
              key={min}
              type="button"
              onClick={() => setDuracaoEscolhida(min)}
              className={
                duracaoEscolhida === min
                  ? "rounded-full bg-[var(--accent)] px-2 py-0.5 text-xs font-medium text-[var(--accent-foreground)]"
                  : "rounded-full border border-[var(--border)] px-2 py-0.5 text-xs opacity-70 hover:opacity-100"
              }
            >
              {min} min
            </button>
          ))}
          <input
            type="number"
            min={1}
            max={480}
            value={duracaoEscolhida}
            onChange={(e) => setDuracaoEscolhida(Number(e.target.value) || 1)}
            className="w-16 rounded border border-[var(--border)] bg-transparent px-2 py-0.5 text-xs outline-none focus:border-[var(--accent)]"
          />
          <button
            type="button"
            onClick={() => {
              setEscolhendoDuracao(false);
              iniciarComTimer(duracaoEscolhida);
            }}
            className="rounded-full bg-[var(--accent)] px-3 py-0.5 text-xs font-medium text-[var(--accent-foreground)]"
          >
            Começar
          </button>
          <button
            type="button"
            onClick={() => setEscolhendoDuracao(false)}
            className="text-xs opacity-40 hover:opacity-80"
          >
            Cancelar
          </button>
        </div>
      )}

      {!concluida && (
        <div className="mt-1 flex gap-2">
          {tarefa.microMetas.length === 0 && !escolhendoDuracao && (
            <button
              type="button"
              disabled={timerOcupado}
              onClick={cliqueIniciarTarefaInteira}
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
