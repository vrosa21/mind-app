"use client";

import { useTarefasStore } from "@/stores/tarefasStore";
import { TarefaCard } from "./TarefaCard";
import type { Task } from "@/types";

function Secao({
  titulo,
  itens,
  vazio,
}: {
  titulo: string;
  itens: Task[];
  vazio?: string;
}) {
  if (itens.length === 0 && !vazio) return null;
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold opacity-70">{titulo}</h2>
      {itens.length === 0 ? (
        <p className="text-sm opacity-50">{vazio}</p>
      ) : (
        itens.map((t) => <TarefaCard key={t.id} tarefa={t} />)
      )}
    </section>
  );
}

export function ListaTarefas() {
  const tarefas = useTarefasStore((s) => s.tarefas);

  if (tarefas.length === 0) {
    return (
      <p className="text-sm opacity-60">
        Nenhuma tarefa ainda. Que tal adicionar a primeira?
      </p>
    );
  }

  const emAndamento = tarefas.filter((t) => t.estado === "em-andamento");
  const disponiveis = tarefas.filter((t) => t.estado === "disponivel");
  const concluidas = tarefas.filter((t) => t.estado === "concluida");

  return (
    <div className="flex flex-col gap-6">
      {emAndamento.length > 0 && (
        <Secao titulo="Em andamento" itens={emAndamento} />
      )}
      <Secao
        titulo="Disponíveis"
        itens={disponiveis}
        vazio="O pool está livre — nada te aguardando."
      />
      {concluidas.length > 0 && (
        <Secao titulo="Concluídas" itens={concluidas} />
      )}
    </div>
  );
}
