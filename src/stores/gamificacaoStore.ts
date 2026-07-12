import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Emblema } from "@/types";
import { REGRAS_EMBLEMAS, type ContextoConquistas } from "@/lib/gamificacao/regras";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import { zustandLocalStorage } from "@/lib/storage/zustandStorage";

interface GamificacaoState {
  emblemas: Emblema[];
  avaliarConquistas: (contexto: ContextoConquistas) => Emblema[];
}

export const useGamificacaoStore = create<GamificacaoState>()(
  persist(
    (set, get) => ({
      emblemas: [],

      avaliarConquistas: (contexto) => {
        const jaConcedidos = new Set(get().emblemas.map((e) => e.id));
        const novos: Emblema[] = REGRAS_EMBLEMAS.filter(
          (regra) => !jaConcedidos.has(regra.chave) && regra.atingida(contexto),
        ).map((regra) => ({
          id: regra.chave,
          tipo: regra.tipo,
          titulo: regra.titulo,
          descricao: regra.descricao,
          concedidoEm: new Date().toISOString(),
        }));

        if (novos.length > 0) {
          set({ emblemas: [...get().emblemas, ...novos] });
        }
        return novos;
      },
    }),
    {
      name: STORAGE_KEYS.emblemas,
      storage: createJSONStorage(() => zustandLocalStorage),
    },
  ),
);
