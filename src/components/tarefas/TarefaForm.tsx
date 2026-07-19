"use client";

import { useState } from "react";
import { useTarefasStore } from "@/stores/tarefasStore";
import { precisaQuebra } from "@/lib/tarefas/microMetas";
import { analisarEstimativa } from "@/lib/tarefas/formato";
import { TarefaCamposForm } from "./TarefaCamposForm";
import type { Pool, UnidadeEstimativa } from "@/types";

export function TarefaForm() {
  const criarTarefa = useTarefasStore((s) => s.criarTarefa);
  const [aberto, setAberto] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [notas, setNotas] = useState("");
  const [pool, setPool] = useState<Pool>("deep");
  const [estimativaValor, setEstimativaValor] = useState("");
  const [estimativaUnidade, setEstimativaUnidade] =
    useState<UnidadeEstimativa>("min");
  const [emergencial, setEmergencial] = useState(false);
  const [quebrarEmMicrometas, setQuebrarEmMicrometas] = useState(true);

  function fechar() {
    setAberto(false);
    setTitulo("");
    setNotas("");
    setPool("deep");
    setEstimativaValor("");
    setEstimativaUnidade("min");
    setEmergencial(false);
    setQuebrarEmMicrometas(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!titulo.trim()) return;
    const { estimativaMin, estimativaUnidade: unidadeSalva } = analisarEstimativa(
      estimativaValor,
      estimativaUnidade,
    );
    criarTarefa({
      titulo: titulo.trim(),
      notas: notas.trim() || undefined,
      pool,
      estimativaMin,
      estimativaUnidade: unidadeSalva,
      quebrarEmMicrometas,
      emergencial,
    });
    fechar();
  }

  if (!aberto) {
    return (
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="self-start rounded-full border border-[var(--border)] px-4 py-2 text-sm opacity-70 hover:opacity-100"
      >
        + Nova tarefa
      </button>
    );
  }

  const { estimativaMin: estimativaMinPreview } = analisarEstimativa(
    estimativaValor,
    estimativaUnidade,
  );

  return (
    <form
      onSubmit={handleSubmit}
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
        quebrarEmMicrometas={quebrarEmMicrometas}
        setQuebrarEmMicrometas={setQuebrarEmMicrometas}
        autoFocus
      />
      {quebrarEmMicrometas && precisaQuebra(estimativaMinPreview) && (
        <p className="text-xs opacity-60">
          Isso vira {Math.ceil(estimativaMinPreview! / 20)} micro-metas automaticamente.
        </p>
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-foreground)]"
        >
          Adicionar
        </button>
        <button
          type="button"
          onClick={fechar}
          className="rounded-full px-4 py-2 text-sm opacity-60 hover:opacity-100"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
