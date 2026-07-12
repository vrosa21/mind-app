"use client";

import { useSyncExternalStore } from "react";
import { estaDesbloqueado } from "@/lib/auth/sessao";

const semInscricao = () => () => {};

// Mesmo raciocínio de `useHidratado`, mas para a flag de sessão em
// localStorage (fora de qualquer store zustand): no servidor e na
// primeira passada do cliente sempre `false`; só depois de montado
// é que refletimos o valor real.
export function useEstaDesbloqueado(): boolean {
  return useSyncExternalStore(semInscricao, estaDesbloqueado, () => false);
}
