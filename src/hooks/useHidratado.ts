"use client";

import { useSyncExternalStore } from "react";

interface PersistApi {
  hasHydrated: () => boolean;
  onFinishHydration: (callback: () => void) => () => void;
}

// A primeira renderização no cliente precisa bater exatamente com o
// HTML do servidor — por isso não podemos decidir nada com base em
// localStorage num useState inicial (lazy initializer): se o zustand
// persist já reidratou de forma síncrona antes do primeiro paint, o
// valor no cliente diverge do valor no servidor e o React acusa
// "Hydration failed". `useSyncExternalStore` resolve isso: o React
// usa `getServerSnapshot` (sempre `false`) tanto no servidor quanto
// nessa primeira passada de hidratação, e só troca para o valor real
// (`getSnapshot`) depois de montado.
export function useHidratado(persist: PersistApi): boolean {
  return useSyncExternalStore(
    (notificar) => persist.onFinishHydration(notificar),
    () => persist.hasHydrated(),
    () => false,
  );
}
