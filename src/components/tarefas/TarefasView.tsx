"use client";

import { useTarefasStore } from "@/stores/tarefasStore";
import { useHidratado } from "@/hooks/useHidratado";
import { TelaCarregando } from "@/components/layout/TelaCarregando";
import { TarefaForm } from "./TarefaForm";
import { ListaTarefas } from "./ListaTarefas";
import { AgendaHoje } from "./AgendaHoje";

export function TarefasView() {
  const hidratado = useHidratado(useTarefasStore.persist);

  if (!hidratado) return <TelaCarregando />;

  return (
    <div className="flex flex-col gap-6">
      <TarefaForm />
      <AgendaHoje />
      <ListaTarefas />
    </div>
  );
}
