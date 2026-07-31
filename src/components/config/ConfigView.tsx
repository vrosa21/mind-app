"use client";

import { useConfigStore } from "@/stores/configStore";
import { useHidratado } from "@/hooks/useHidratado";
import { TelaCarregando } from "@/components/layout/TelaCarregando";
import { DriveSync } from "./DriveSync";
import { GerenciadorTags } from "./GerenciadorTags";
import type { Paleta, IntensidadeNotificacao } from "@/types";

const PALETAS: { valor: Paleta; label: string; descricao: string }[] = [
  { valor: "calma", label: "Calma", descricao: "Tons frios, baixa saturação." },
  { valor: "foco", label: "Foco", descricao: "Mais contraste, ainda suave." },
  { valor: "suave", label: "Suave", descricao: "Tons quentes, pastel." },
];

const INTENSIDADES: { valor: IntensidadeNotificacao; label: string }[] = [
  { valor: "silencioso", label: "Silencioso" },
  { valor: "suave", label: "Suave" },
  { valor: "normal", label: "Normal" },
];

export function ConfigView() {
  const hidratado = useHidratado(useConfigStore.persist);
  const paleta = useConfigStore((s) => s.paleta);
  const setPaleta = useConfigStore((s) => s.setPaleta);
  const intensidadeNotificacao = useConfigStore((s) => s.intensidadeNotificacao);
  const setIntensidadeNotificacao = useConfigStore(
    (s) => s.setIntensidadeNotificacao,
  );
  const mostrarTempoDecorrido = useConfigStore((s) => s.mostrarTempoDecorrido);
  const setMostrarTempoDecorrido = useConfigStore(
    (s) => s.setMostrarTempoDecorrido,
  );

  if (!hidratado) return <TelaCarregando />;

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold opacity-70">Paleta</h2>
        <p className="text-sm opacity-60">
          Ajuste as cores para reduzir sobrecarga sensorial.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          {PALETAS.map((p) => (
            <button
              key={p.valor}
              type="button"
              data-paleta={p.valor}
              onClick={() => setPaleta(p.valor)}
              aria-pressed={paleta === p.valor}
              className="flex flex-1 flex-col items-start gap-2 rounded-lg p-4 text-left"
              style={{
                background: "var(--background)",
                color: "var(--foreground)",
                borderWidth: paleta === p.valor ? 2 : 1,
                borderStyle: "solid",
                borderColor: paleta === p.valor ? "var(--accent)" : "var(--border)",
              }}
            >
              <span
                className="h-6 w-6 rounded-full"
                style={{ background: "var(--accent)" }}
              />
              <span className="text-sm font-medium">{p.label}</span>
              <span className="text-xs opacity-60">{p.descricao}</span>
              {paleta === p.valor && (
                <span className="text-xs" style={{ color: "var(--accent)" }}>
                  Selecionada
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold opacity-70">
          Intensidade de notificação
        </h2>
        <p className="text-sm opacity-60">
          Controla o volume do sinal sonoro e a vibração na metade e ao fim de
          uma sessão.
        </p>
        <div className="flex gap-2">
          {INTENSIDADES.map((i) => (
            <button
              key={i.valor}
              type="button"
              onClick={() => setIntensidadeNotificacao(i.valor)}
              aria-pressed={intensidadeNotificacao === i.valor}
              className={
                intensidadeNotificacao === i.valor
                  ? "rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-foreground)]"
                  : "rounded-full border border-[var(--border)] px-4 py-2 text-sm opacity-70 hover:opacity-100"
              }
            >
              {i.label}
            </button>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold opacity-70">Timer</h2>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={mostrarTempoDecorrido}
            onChange={(e) => setMostrarTempoDecorrido(e.target.checked)}
          />
          Mostrar o tempo decorrido durante a sessão
        </label>
      </section>

      <GerenciadorTags />

      <DriveSync />
    </div>
  );
}
