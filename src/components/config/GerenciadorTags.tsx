"use client";

import { useState } from "react";
import { useTagsStore } from "@/stores/tagsStore";
import { useTarefasStore } from "@/stores/tarefasStore";

export function GerenciadorTags() {
  const tags = useTagsStore((s) => s.tags);
  const criarTag = useTagsStore((s) => s.criarTag);
  const renomearTag = useTagsStore((s) => s.renomearTag);
  const removerTag = useTagsStore((s) => s.removerTag);
  const tarefas = useTarefasStore((s) => s.tarefas);
  const removerTagDeTodas = useTarefasStore((s) => s.removerTagDeTodas);

  const [novaTag, setNovaTag] = useState("");
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [nomeRascunho, setNomeRascunho] = useState("");
  const [confirmandoRemocaoId, setConfirmandoRemocaoId] = useState<
    string | null
  >(null);

  function handleCriar(e: React.FormEvent) {
    e.preventDefault();
    if (!novaTag.trim()) return;
    criarTag(novaTag);
    setNovaTag("");
  }

  function abrirEdicao(id: string, nomeAtual: string) {
    setEditandoId(id);
    setNomeRascunho(nomeAtual);
  }

  function salvarEdicao(id: string) {
    if (nomeRascunho.trim()) renomearTag(id, nomeRascunho);
    setEditandoId(null);
  }

  function usoDaTag(id: string): number {
    return tarefas.filter((t) => t.tagIds?.includes(id)).length;
  }

  function handleRemover(id: string) {
    const uso = usoDaTag(id);
    if (uso > 0 && confirmandoRemocaoId !== id) {
      setConfirmandoRemocaoId(id);
      return;
    }
    if (uso > 0) removerTagDeTodas(id);
    removerTag(id);
    setConfirmandoRemocaoId(null);
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold opacity-70">Tags</h2>
      <p className="text-sm opacity-60">
        Organize as tarefas com suas próprias etiquetas.
      </p>

      <form onSubmit={handleCriar} className="flex gap-2">
        <input
          type="text"
          value={novaTag}
          onChange={(e) => setNovaTag(e.target.value)}
          placeholder="Nova tag"
          className="min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
        />
        <button
          type="submit"
          className="shrink-0 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-foreground)]"
        >
          Adicionar
        </button>
      </form>

      {tags.length === 0 ? (
        <p className="text-sm opacity-50">Nenhuma tag criada ainda.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {tags.map((tag) => (
            <li
              key={tag.id}
              className="flex flex-col gap-2 rounded-lg border border-[var(--border)] p-3"
            >
              {editandoId === tag.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nomeRascunho}
                    onChange={(e) => setNomeRascunho(e.target.value)}
                    autoFocus
                    className="min-w-0 flex-1 rounded border border-[var(--border)] bg-transparent px-2 py-1 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => salvarEdicao(tag.id)}
                    className="text-xs opacity-70 hover:opacity-100"
                  >
                    Salvar
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditandoId(null)}
                    className="text-xs opacity-40 hover:opacity-80"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm">{tag.nome}</span>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => abrirEdicao(tag.id, tag.nome)}
                      className="text-xs opacity-40 hover:opacity-80"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemover(tag.id)}
                      className="text-xs opacity-40 hover:opacity-80"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              )}
              {confirmandoRemocaoId === tag.id && (
                <div className="flex items-center justify-between gap-2 rounded-lg bg-[var(--muted)] p-2">
                  <p className="text-xs opacity-70">
                    Usada em {usoDaTag(tag.id)} tarefa
                    {usoDaTag(tag.id) === 1 ? "" : "s"}. Remover mesmo assim?
                    As tarefas continuam existindo, só perdem esta tag.
                  </p>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => handleRemover(tag.id)}
                      className="text-xs font-medium opacity-70 hover:opacity-100"
                    >
                      Confirmar
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmandoRemocaoId(null)}
                      className="text-xs opacity-40 hover:opacity-80"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
