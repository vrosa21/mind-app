import { ProgressoView } from "@/components/progresso/ProgressoView";

export default function ProgressoPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Progresso</h1>
      <ProgressoView />
    </div>
  );
}
