import { ConfigView } from "@/components/config/ConfigView";

export default function ConfigPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Config</h1>
      <ConfigView />
    </div>
  );
}
