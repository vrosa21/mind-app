import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { TimerSession } from "@/types";
import type { SessaoAtiva } from "@/lib/timer/tipos";
import { segundosDecorridos } from "@/lib/timer/tempo";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import { zustandLocalStorage } from "@/lib/storage/zustandStorage";
import { useTarefasStore } from "@/stores/tarefasStore";
import { useGamificacaoStore } from "@/stores/gamificacaoStore";
import type { ContextoConquistas } from "@/lib/gamificacao/regras";

interface TimerState {
  sessaoAtual: SessaoAtiva | null;
  historico: TimerSession[];
  totalSessoesIniciadas: number;
  totalRetomadas: number;
  iniciarSessao: (duracaoPlanejadaMin: number, taskId?: string) => void;
  pausar: () => void;
  retomar: () => void;
  encerrar: (motivo: "concluida" | "interrompida") => void;
}

// totalReflexoes fica em 0 aqui de propósito: essas regras (tipo
// "reflexao") já são avaliadas e concedidas no momento certo pela
// reflexoesStore — avaliarConquistas é idempotente, então reavaliar
// com um valor conservador não deixa de conceder nada, só evita
// acoplar esta store à reflexoesStore.
function contextoConquistas(state: TimerState): ContextoConquistas {
  return {
    totalSessoesIniciadas: state.totalSessoesIniciadas,
    totalRetomadas: state.totalRetomadas,
    totalReflexoes: 0,
  };
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      sessaoAtual: null,
      historico: [],
      totalSessoesIniciadas: 0,
      totalRetomadas: 0,

      iniciarSessao: (duracaoPlanejadaMin, taskId) => {
        const agora = new Date().toISOString();
        set({
          sessaoAtual: {
            id: crypto.randomUUID(),
            taskId,
            duracaoPlanejadaMin,
            iniciadoEm: agora,
            acumuladoSeg: 0,
            retomadoEm: agora,
            estado: "ativa",
          },
          totalSessoesIniciadas: get().totalSessoesIniciadas + 1,
        });
        useGamificacaoStore.getState().avaliarConquistas(contextoConquistas(get()));
      },

      pausar: () => {
        const sessao = get().sessaoAtual;
        if (!sessao || sessao.estado !== "ativa") return;
        set({
          sessaoAtual: {
            ...sessao,
            acumuladoSeg: segundosDecorridos(sessao),
            estado: "pausada",
          },
        });
      },

      retomar: () => {
        const sessao = get().sessaoAtual;
        if (!sessao || sessao.estado !== "pausada") return;
        set({
          sessaoAtual: {
            ...sessao,
            retomadoEm: new Date().toISOString(),
            estado: "ativa",
          },
          totalRetomadas: get().totalRetomadas + 1,
        });
        useGamificacaoStore.getState().avaliarConquistas(contextoConquistas(get()));
      },

      encerrar: (motivo) => {
        const sessao = get().sessaoAtual;
        if (!sessao) return;
        const tempoDecorridoSeg = Math.round(segundosDecorridos(sessao));
        const registro: TimerSession = {
          id: sessao.id,
          taskId: sessao.taskId,
          duracaoPlanejadaMin: sessao.duracaoPlanejadaMin,
          iniciadoEm: sessao.iniciadoEm,
          encerradoEm: new Date().toISOString(),
          tempoDecorridoSeg,
          estado: motivo,
        };
        set({
          sessaoAtual: null,
          historico: [registro, ...get().historico],
        });

        // Sessão terminada (por completar o tempo ou por interrupção
        // manual) não significa sucesso nem fracasso — a tarefa só
        // volta ao pool neutro se ninguém a marcou como concluída.
        if (sessao.taskId) {
          useTarefasStore.getState().devolverAoPool(sessao.taskId);
        }
      },
    }),
    {
      name: STORAGE_KEYS.timer,
      storage: createJSONStorage(() => zustandLocalStorage),
    },
  ),
);
