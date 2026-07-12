import { SESSION_KEYS } from "@/lib/storage/keys";

// Flag de sessão desbloqueada — de propósito separada dos 3 JSONs
// sincronizáveis: é local ao dispositivo, nunca vai para o Drive.
export function estaDesbloqueado(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(SESSION_KEYS.desbloqueado) === "1";
}

export function desbloquear(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_KEYS.desbloqueado, "1");
}

export function bloquear(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEYS.desbloqueado);
}
