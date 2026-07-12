export type Humor = "cansado" | "triste" | "neutro" | "bom" | "empolgado";

export type Emocao =
  | "ansioso"
  | "calmo"
  | "alegre"
  | "triste"
  | "irritado"
  | "sobrecarregado"
  | "motivado"
  | "frustrado";

export type EstadoMente = "clara" | "dispersa" | "sobrecarregada" | "vazia" | "curiosa";

export type EstadoSaude = "bem" | "cansado" | "dolorido" | "doente" | "descansado";

export interface Reflexao {
  id: string;
  /** Ausente = reflexão de fim de dia, não vinculada a uma sessão de timer. */
  sessionId?: string;
  /** Saldo do dia — mesma escala usada nas reflexões de fim de sessão. */
  humor?: Humor;
  emocoes?: Emocao[];
  mente?: EstadoMente;
  saude?: EstadoSaude;
  texto?: string;
  criadaEm: string;
}
