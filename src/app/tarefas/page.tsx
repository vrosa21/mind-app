import { TarefasView } from "@/components/tarefas/TarefasView";

export default function TarefasPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Tarefas</h1>
      <TarefasView />
    </div>
  );
}
