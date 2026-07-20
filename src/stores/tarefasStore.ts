import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Task, Pool, UnidadeEstimativa } from "@/types";
import { gerarMicroMetas, precisaQuebra } from "@/lib/tarefas/microMetas";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import { zustandLocalStorage } from "@/lib/storage/zustandStorage";

interface NovaTarefaInput {
  titulo: string;
  notas?: string;
  pool: Pool;
  estimativaMin?: number;
  estimativaUnidade?: UnidadeEstimativa;
  // Default true — preserva o comportamento atual quando omitido.
  quebrarEmMicrometas?: boolean;
  emergencial?: boolean;
  tagIds?: string[];
}

type PatchTarefa = Partial<
  Pick<
    Task,
    | "titulo"
    | "notas"
    | "pool"
    | "estimativaMin"
    | "estimativaUnidade"
    | "emergencial"
    | "tagIds"
  >
>;

interface TarefasState {
  tarefas: Task[];
  criarTarefa: (input: NovaTarefaInput) => void;
  atualizarTarefa: (id: string, patch: PatchTarefa) => void;
  excluirTarefa: (id: string) => void;
  duplicarTarefa: (id: string) => void;
  alternarMicroMeta: (tarefaId: string, microMetaId: string) => void;
  editarMicroMeta: (tarefaId: string, microMetaId: string, titulo: string) => void;
  iniciarTarefa: (id: string) => void;
  concluirTarefa: (id: string) => void;
  editarConclusao: (id: string, concluidaEm: string) => void;
  editarPrevisaoTermino: (id: string, previsaoTerminoEm: string) => void;
  devolverAoPool: (id: string) => void;
  removerTagDeTodas: (tagId: string) => void;
}

export const useTarefasStore = create<TarefasState>()(
  persist(
    (set, get) => ({
      tarefas: [],

      criarTarefa: ({
        titulo,
        notas,
        pool,
        estimativaMin,
        estimativaUnidade,
        quebrarEmMicrometas = true,
        emergencial = false,
        tagIds,
      }) => {
        const tarefa: Task = {
          id: crypto.randomUUID(),
          titulo,
          notas,
          pool,
          estimativaMin,
          estimativaUnidade,
          microMetas:
            quebrarEmMicrometas && estimativaMin !== undefined
              ? gerarMicroMetas(estimativaMin)
              : [],
          estado: "disponivel",
          criadaEm: new Date().toISOString(),
          emergencial,
          tagIds,
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

      // A cópia começa do zero: sem estado/histórico herdado, para não
      // poluir os analytics com uma segunda "conclusão" da mesma tarefa.
      duplicarTarefa: (id) => {
        const original = get().tarefas.find((t) => t.id === id);
        if (!original) return;
        const copia: Task = {
          id: crypto.randomUUID(),
          titulo: `${original.titulo} (cópia)`,
          notas: original.notas,
          pool: original.pool,
          estimativaMin: original.estimativaMin,
          estimativaUnidade: original.estimativaUnidade,
          emergencial: original.emergencial,
          tagIds: original.tagIds,
          microMetas: original.microMetas.map((m) => ({
            ...m,
            id: crypto.randomUUID(),
            concluida: false,
          })),
          estado: "disponivel",
          criadaEm: new Date().toISOString(),
        };
        set({ tarefas: [copia, ...get().tarefas] });
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

      editarMicroMeta: (tarefaId, microMetaId, titulo) => {
        set({
          tarefas: get().tarefas.map((t) =>
            t.id !== tarefaId
              ? t
              : {
                  ...t,
                  microMetas: t.microMetas.map((m) =>
                    m.id === microMetaId ? { ...m, titulo } : m,
                  ),
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
      editarConclusao: (id, concluidaEm) => {
        set({
          tarefas: get().tarefas.map((t) =>
            t.id === id && t.estado === "concluida"
              ? { ...t, concluidaEm, ultimaAtividadeEm: new Date().toISOString() }
              : t,
          ),
        });
      },

      editarPrevisaoTermino: (id, previsaoTerminoEm) => {
        set({
          tarefas: get().tarefas.map((t) =>
            t.id === id ? { ...t, previsaoTerminoEm } : t,
          ),
        });
      },

      // Deleção segura de tag (Lote C): a tarefa nunca é apagada, só perde
      // a referência ao id removido.
      removerTagDeTodas: (tagId) => {
        set({
          tarefas: get().tarefas.map((t) =>
            t.tagIds?.includes(tagId)
              ? { ...t, tagIds: t.tagIds.filter((id) => id !== tagId) }
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
