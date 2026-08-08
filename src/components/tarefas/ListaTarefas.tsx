"use client";

import { useState } from "react";
import { useTarefasStore } from "@/stores/tarefasStore";
import { useConfigStore } from "@/stores/configStore";
import { normalizar } from "@/lib/tarefas/formato";
import { POOL_LABELS } from "@/lib/tarefas/pools";
import { ehRotina } from "@/lib/tarefas/rotinas";
import { TarefaCard } from "./TarefaCard";
import type { Task, ModoVisualizacaoTarefas } from "@/types";

function tarefaCorresponde(tarefa: Task, termoNormalizado: string): boolean {
  if (!termoNormalizado) return true;
  const alvos = [
    tarefa.titulo,
    POOL_LABELS[tarefa.pool],
    ...tarefa.microMetas.map((m) => m.titulo),
  ];
  return alvos.some((alvo) => normalizar(alvo).includes(termoNormalizado));
}

function Secao({
  titulo,
  itens,
  vazio,
  modo,
}: {
  titulo: string;
  itens: Task[];
  vazio?: string;
  modo: ModoVisualizacaoTarefas;
}) {
  if (itens.length === 0 && !vazio) return null;
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold opacity-70">{titulo}</h2>
      {itens.length === 0 ? (
        <p className="text-sm opacity-50">{vazio}</p>
      ) : (
        itens.map((t) => <TarefaCard key={t.id} tarefa={t} modo={modo} />)
      )}
    </section>
  );
}

export function ListaTarefas() {
  const tarefas = useTarefasStore((s) => s.tarefas);
  const modo = useConfigStore((s) => s.modoVisualizacaoTarefas);
  const setModo = useConfigStore((s) => s.setModoVisualizacaoTarefas);
  const [busca, setBusca] = useState("");

  if (tarefas.length === 0) {
    return (
      <p className="text-sm opacity-60">
        Nenhuma tarefa ainda. Que tal adicionar a primeira?
      </p>
    );
  }

  const termoNormalizado = normalizar(busca.trim());
  const filtradas = tarefas.filter((t) => tarefaCorresponde(t, termoNormalizado));

  const rotinas = filtradas.filter(ehRotina);
  const comuns = filtradas.filter((t) => !ehRotina(t));
  const emAndamento = comuns.filter((t) => t.estado === "em-andamento");
  const disponiveis = comuns.filter((t) => t.estado === "disponivel");
  const concluidas = comuns.filter((t) => t.estado === "concluida");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2">
        <input
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar tarefas..."
          className="flex-1 rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={() =>
            setModo(modo === "completa" ? "resumida" : "completa")
          }
          className="shrink-0 rounded-lg border border-[var(--border)] px-3 py-2 text-sm opacity-70 hover:opacity-100"
        >
          {modo === "completa" ? "Ver resumida" : "Ver completa"}
        </button>
      </div>

      {termoNormalizado && filtradas.length === 0 ? (
        <p className="text-sm opacity-60">
          Nenhuma tarefa encontrada para essa busca.
        </p>
      ) : (
        <>
          {emAndamento.length > 0 && (
            <Secao titulo="Em andamento" itens={emAndamento} modo={modo} />
          )}
          <Secao
            titulo="Disponíveis"
            itens={disponiveis}
            vazio="O pool está livre — nada te aguardando."
            modo={modo}
          />
          {concluidas.length > 0 && (
            <Secao titulo="Concluídas" itens={concluidas} modo={modo} />
          )}
          {rotinas.length > 0 && (
            <Secao titulo="Rotinas" itens={rotinas} modo={modo} />
          )}
        </>
      )}
    </div>
  );
}
