import type { Emocao, EstadoMente, EstadoSaude } from "@/types";

export const OPCOES_EMOCAO: { valor: Emocao; label: string }[] = [
  { valor: "ansioso", label: "Ansioso(a)" },
  { valor: "calmo", label: "Calmo(a)" },
  { valor: "alegre", label: "Alegre" },
  { valor: "triste", label: "Triste" },
  { valor: "irritado", label: "Irritado(a)" },
  { valor: "sobrecarregado", label: "Sobrecarregado(a)" },
  { valor: "motivado", label: "Motivado(a)" },
  { valor: "frustrado", label: "Frustrado(a)" },
];

export const OPCOES_MENTE: { valor: EstadoMente; label: string }[] = [
  { valor: "clara", label: "Clara" },
  { valor: "dispersa", label: "Dispersa" },
  { valor: "sobrecarregada", label: "Sobrecarregada" },
  { valor: "vazia", label: "Vazia" },
  { valor: "curiosa", label: "Curiosa" },
];

export const OPCOES_SAUDE: { valor: EstadoSaude; label: string }[] = [
  { valor: "bem", label: "Bem" },
  { valor: "cansado", label: "Cansado(a)" },
  { valor: "dolorido", label: "Dolorido(a)" },
  { valor: "doente", label: "Doente" },
  { valor: "descansado", label: "Descansado(a)" },
];
