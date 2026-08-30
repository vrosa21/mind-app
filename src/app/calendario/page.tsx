import { CalendarioView } from "@/components/calendario/CalendarioView";

export default function CalendarioPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Calendário</h1>
      <CalendarioView />
    </div>
  );
}
