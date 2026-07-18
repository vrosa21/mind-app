import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  configPadrao,
  type Config,
  type Paleta,
  type IntensidadeNotificacao,
  type ModoVisualizacaoTarefas,
} from "@/types";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import { zustandLocalStorage } from "@/lib/storage/zustandStorage";

interface ConfigState extends Config {
  setPaleta: (paleta: Paleta) => void;
  setIntensidadeNotificacao: (intensidade: IntensidadeNotificacao) => void;
  setMostrarTempoDecorrido: (mostrar: boolean) => void;
  setSenhaHash: (hash: string) => void;
  setGoogleConectado: (conectado: boolean) => void;
  setUltimaSincronizacaoEm: (data: string) => void;
  setModoVisualizacaoTarefas: (modo: ModoVisualizacaoTarefas) => void;
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      ...configPadrao,
      setPaleta: (paleta) => set({ paleta }),
      setIntensidadeNotificacao: (intensidadeNotificacao) =>
        set({ intensidadeNotificacao }),
      setMostrarTempoDecorrido: (mostrarTempoDecorrido) =>
        set({ mostrarTempoDecorrido }),
      setSenhaHash: (senhaHash) => set({ senhaHash }),
      setGoogleConectado: (googleConectado) => set({ googleConectado }),
      setUltimaSincronizacaoEm: (ultimaSincronizacaoEm) =>
        set({ ultimaSincronizacaoEm }),
      setModoVisualizacaoTarefas: (modoVisualizacaoTarefas) =>
        set({ modoVisualizacaoTarefas }),
    }),
    {
      name: STORAGE_KEYS.config,
      storage: createJSONStorage(() => zustandLocalStorage),
    },
  ),
);
