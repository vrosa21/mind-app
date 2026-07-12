import { TimerPanel } from "@/components/timer/TimerPanel";
import { ListaEmblemas } from "@/components/gamificacao/ListaEmblemas";

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Timer</h1>
        <TimerPanel />
      </div>
      <ListaEmblemas />
    </div>
  );
}
