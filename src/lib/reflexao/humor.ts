import type { Humor } from "@/types";

export const OPCOES_HUMOR: { valor: Humor; emoji: string; label: string }[] = [
  { valor: "cansado", emoji: "😴", label: "Cansado" },
  { valor: "triste", emoji: "😔", label: "Triste" },
  { valor: "neutro", emoji: "😐", label: "Neutro" },
  { valor: "bom", emoji: "🙂", label: "Bom" },
  { valor: "empolgado", emoji: "🤩", label: "Empolgado" },
];
