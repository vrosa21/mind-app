import type { StateStorage } from "zustand/middleware";

// Adapter SSR-safe para o `persist` do zustand — o Next.js renderiza
// no servidor, onde `window`/`localStorage` não existem.
export const zustandLocalStorage: StateStorage = {
  getItem: (name) => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(name);
  },
  setItem: (name, value) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(name, value);
  },
  removeItem: (name) => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(name);
  },
};
