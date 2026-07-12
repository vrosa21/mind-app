import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Task, Pool } from "@/types";
import { gerarMicroMetas, precisaQuebra } from "@/lib/tarefas/microMetas";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import { zustandLocalStorage } from "@/lib/storage/zustandStorage";

interface NovaTarefaInput {
  titulo: string;
  notas?: string;
  pool: Pool;
  estimativaMin: number;
}

type PatchTarefa = Partial<
  Pick<Task, "titulo" | "notas" | "pool" | "estimativaMin">
>;

interface TarefasState {
  tarefas: Task[];
  criarTarefa: (input: NovaTarefaInput) => void;
  atualizarTarefa: (id: string, patch: PatchTarefa) => void;
  excluirTarefa: (id: string) => void;
  alternarMicroMeta: (tarefaId: string, microMetaId: string) => void;
  iniciarTarefa: (id: string) => void;
  concluirTarefa: (id: string) => void;
  devolverAoPool: (id: string) => void;
}

export const useTarefasStore = create<TarefasState>()(
  persist(
    (set, get) => ({
      tarefas: [],

      criarTarefa: ({ titulo, notas, pool, estimativaMin }) => {
        const tarefa: Task = {
          id: crypto.randomUUID(),
          titulo,
          notas,
          pool,
          estimativaMin,
          microMetas: gerarMicroMetas(estimativaMin),
          estado: "disponivel",
          criadaEm: new Date().toISOString(),
        };
        set({ tarefas: [tarefa, ...get().tarefas] });
      },

      atualizarTarefa: (id, patch) => {
        set({
          tarefas: get().tarefas.map((t) => {
            if (t.id !== id) return t;
            const atualizada: Task = { ...t, ...patch };
            const estimativaMudou =
              patch.estimativaMin !== undefined &&
              patch.estimativaMin !== t.estimativaMin;
            const cruzouLimiar =
              estimativaMudou &&
              precisaQuebra(patch.estimativaMin!) !== precisaQuebra(t.estimativaMin);
            if (cruzouLimiar) {
              atualizada.microMetas = gerarMicroMetas(patch.estimativaMin!);
            }
            return atualizada;
          }),
        });
      },

      excluirTarefa: (id) => {
        set({ tarefas: get().tarefas.filter((t) => t.id !== id) });
      },

      alternarMicroMeta: (tarefaId, microMetaId) => {
        set({
          tarefas: get().tarefas.map((t) =>
            t.id !== tarefaId
              ? t
              : {
                  ...t,
                  microMetas: t.microMetas.map((m) =>
                    m.id === microMetaId
                      ? { ...m, concluida: !m.concluida }
                      : m,
                  ),
                  ultimaAtividadeEm: new Date().toISOString(),
                },
          ),
        });
      },

      iniciarTarefa: (id) => {
        const agora = new Date().toISOString();
        set({
          tarefas: get().tarefas.map((t) =>
            t.id === id
              ? { ...t, estado: "em-andamento", ultimaAtividadeEm: agora }
              : t,
          ),
        });
      },

      // Quando uma sessão de timer termina (por completar o tempo
      // planejado ou por interrupção manual) sem a tarefa ter sido
      // concluída, ela volta para o pool neutro — nunca fica presa
      // em "em-andamento" nem é marcada como "falha".
      devolverAoPool: (id) => {
        set({
          tarefas: get().tarefas.map((t) =>
            t.id === id && t.estado !== "concluida"
              ? {
                  ...t,
                  estado: "disponivel",
                  ultimaAtividadeEm: new Date().toISOString(),
                }
              : t,
          ),
        });
      },

      concluirTarefa: (id) => {
        const agora = new Date().toISOString();
        set({
          tarefas: get().tarefas.map((t) =>
            t.id === id
              ? {
                  ...t,
                  estado: "concluida",
                  concluidaEm: agora,
                  ultimaAtividadeEm: agora,
                }
              : t,
          ),
        });
      },
    }),
    {
      name: STORAGE_KEYS.tarefas,
      storage: createJSONStorage(() => zustandLocalStorage),
    },
  ),
);
