"use client";

import { useState } from "react";
import { useTarefasStore } from "@/stores/tarefasStore";
import { precisaQuebra } from "@/lib/tarefas/microMetas";
import { TarefaCamposForm } from "./TarefaCamposForm";
import type { Pool } from "@/types";

export function TarefaForm() {
  const criarTarefa = useTarefasStore((s) => s.criarTarefa);
  const [aberto, setAberto] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [notas, setNotas] = useState("");
  const [pool, setPool] = useState<Pool>("deep");
  const [estimativaMin, setEstimativaMin] = useState(25);

  function fechar() {
    setAberto(false);
    setTitulo("");
    setNotas("");
    setPool("deep");
    setEstimativaMin(25);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!titulo.trim()) return;
    criarTarefa({
      titulo: titulo.trim(),
      notas: notas.trim() || undefined,
      pool,
      estimativaMin,
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
        estimativaMin={estimativaMin}
        setEstimativaMin={setEstimativaMin}
        autoFocus
      />
      {precisaQuebra(estimativaMin) && (
        <p className="text-xs opacity-60">
          Isso vira {Math.ceil(estimativaMin / 20)} micro-metas automaticamente.
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
