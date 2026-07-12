import type { Pool } from "@/types";

export const POOLS: Pool[] = ["deep", "admin", "pessoal", "urgente-flexivel"];

export const POOL_LABELS: Record<Pool, string> = {
  deep: "Foco profundo",
  admin: "Administrativo",
  pessoal: "Pessoal",
  "urgente-flexivel": "Urgente flexível",
};
