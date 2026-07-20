import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Tag } from "@/types";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import { zustandLocalStorage } from "@/lib/storage/zustandStorage";
import { normalizar } from "@/lib/tarefas/formato";

interface TagsState {
  tags: Tag[];
  criarTag: (nome: string) => void;
  renomearTag: (id: string, nome: string) => void;
  removerTag: (id: string) => void;
}

export const useTagsStore = create<TagsState>()(
  persist(
    (set, get) => ({
      tags: [],

      criarTag: (nome) => {
        const nomeLimpo = nome.trim();
        if (!nomeLimpo) return;
        const jaExiste = get().tags.some(
          (t) => normalizar(t.nome) === normalizar(nomeLimpo),
        );
        if (jaExiste) return;
        const tag: Tag = { id: crypto.randomUUID(), nome: nomeLimpo };
        set({ tags: [...get().tags, tag] });
      },

      renomearTag: (id, nome) => {
        const nomeLimpo = nome.trim();
        if (!nomeLimpo) return;
        set({
          tags: get().tags.map((t) =>
            t.id === id ? { ...t, nome: nomeLimpo } : t,
          ),
        });
      },

      removerTag: (id) => {
        set({ tags: get().tags.filter((t) => t.id !== id) });
      },
    }),
    {
      name: STORAGE_KEYS.tags,
      storage: createJSONStorage(() => zustandLocalStorage),
    },
  ),
);
