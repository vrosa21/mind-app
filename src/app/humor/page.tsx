import { RegistroHumorDia } from "@/components/humor/RegistroHumorDia";

export default function HumorPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Humor</h1>
      <RegistroHumorDia />
    </div>
  );
}
