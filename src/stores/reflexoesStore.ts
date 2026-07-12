import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Reflexao, Humor, Emocao, EstadoMente, EstadoSaude } from "@/types";
import { useGamificacaoStore } from "@/stores/gamificacaoStore";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import { zustandLocalStorage } from "@/lib/storage/zustandStorage";

interface NovaReflexaoInput {
  sessionId?: string;
  humor?: Humor;
  emocoes?: Emocao[];
  mente?: EstadoMente;
  saude?: EstadoSaude;
  texto?: string;
}

interface ReflexoesState {
  reflexoes: Reflexao[];
  registrarReflexao: (input: NovaReflexaoInput) => void;
}

export const useReflexoesStore = create<ReflexoesState>()(
  persist(
    (set, get) => ({
      reflexoes: [],

      registrarReflexao: ({ sessionId, humor, emocoes, mente, saude, texto }) => {
        const reflexao: Reflexao = {
          id: crypto.randomUUID(),
          sessionId,
          humor,
          emocoes,
          mente,
          saude,
          texto,
          criadaEm: new Date().toISOString(),
        };
        set({ reflexoes: [reflexao, ...get().reflexoes] });

        // totalSessoesIniciadas/totalRetomadas ficam em 0 aqui de
        // propósito: essas regras já são avaliadas (e concedidas) no
        // momento certo pela timerStore — avaliarConquistas é
        // idempotente, então reavaliar com um valor conservador não
        // concede nada indevido, só evita acoplar esta store à timerStore.
        useGamificacaoStore.getState().avaliarConquistas({
          totalSessoesIniciadas: 0,
          totalRetomadas: 0,
          totalReflexoes: get().reflexoes.length,
        });
      },
    }),
    {
      name: STORAGE_KEYS.reflexoes,
      storage: createJSONStorage(() => zustandLocalStorage),
    },
  ),
);
