"use client";

import { useGamificacaoStore } from "@/stores/gamificacaoStore";
import { useHidratado } from "@/hooks/useHidratado";

export function ListaEmblemas() {
  const hidratado = useHidratado(useGamificacaoStore.persist);
  const emblemas = useGamificacaoStore((s) => s.emblemas);

  if (!hidratado) return null;

  return (
    <section className="flex w-full flex-col gap-3">
      <h2 className="text-sm font-semibold opacity-70">Emblemas</h2>
      {emblemas.length === 0 ? (
        <p className="text-sm opacity-50">
          Ainda não há emblemas por aqui — eles aparecem conforme você tenta,
          se adapta e reflete.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {emblemas.map((e) => (
            <li
              key={e.id}
              className="rounded-lg border border-[var(--border)] p-3"
            >
              <p className="text-sm font-medium">{e.titulo}</p>
              <p className="mt-0.5 text-xs opacity-60">{e.descricao}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
