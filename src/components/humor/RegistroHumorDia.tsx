"use client";

import { useState } from "react";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useReflexoesStore } from "@/stores/reflexoesStore";
import { useHidratado } from "@/hooks/useHidratado";
import { TelaCarregando } from "@/components/layout/TelaCarregando";
import { OPCOES_HUMOR } from "@/lib/reflexao/humor";
import { OPCOES_EMOCAO, OPCOES_MENTE, OPCOES_SAUDE } from "@/lib/reflexao/indicadores";
import { CalendarioHumorMensal } from "./CalendarioHumorMensal";
import type { Humor, Emocao, EstadoMente, EstadoSaude } from "@/types";

interface OpcaoChip<T extends string> {
  valor: T;
  label: string;
}

function SeletorUnico<T extends string>({
  opcoes,
  valor,
  onSelecionar,
}: {
  opcoes: OpcaoChip<T>[];
  valor: T | null;
  onSelecionar: (v: T | null) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {opcoes.map((op) => (
        <button
          key={op.valor}
          type="button"
          aria-pressed={valor === op.valor}
          onClick={() => onSelecionar(valor === op.valor ? null : op.valor)}
          className={
            valor === op.valor
              ? "rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-medium text-[var(--accent-foreground)]"
              : "rounded-full border border-[var(--border)] px-3 py-1 text-xs opacity-60 hover:opacity-100"
          }
        >
          {op.label}
        </button>
      ))}
    </div>
  );
}

function SeletorMultiplo<T extends string>({
  opcoes,
  valores,
  onAlternar,
}: {
  opcoes: OpcaoChip<T>[];
  valores: T[];
  onAlternar: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {opcoes.map((op) => {
        const ativo = valores.includes(op.valor);
        return (
          <button
            key={op.valor}
            type="button"
            aria-pressed={ativo}
            onClick={() => onAlternar(op.valor)}
            className={
              ativo
                ? "rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-medium text-[var(--accent-foreground)]"
                : "rounded-full border border-[var(--border)] px-3 py-1 text-xs opacity-60 hover:opacity-100"
            }
          >
            {op.label}
          </button>
        );
      })}
    </div>
  );
}

/** Converte um valor de <input type="date"> (yyyy-MM-dd) para ISO ao meio-dia
 * local, evitando que o registro pule de dia perto da virada de fuso. */
function dataYYYYMMDDParaISOMeioDia(dataYYYYMMDD: string): string {
  const [ano, mes, dia] = dataYYYYMMDD.split("-").map(Number);
  return new Date(ano, mes - 1, dia, 12, 0, 0).toISOString();
}

export function RegistroHumorDia() {
  const hidratado = useHidratado(useReflexoesStore.persist);
  const reflexoes = useReflexoesStore((s) => s.reflexoes);
  const registrarReflexao = useReflexoesStore((s) => s.registrarReflexao);
  const editarDataReflexao = useReflexoesStore((s) => s.editarDataReflexao);

  const [humorEscolhido, setHumorEscolhido] = useState<Humor | null>(null);
  const [emocoesEscolhidas, setEmocoesEscolhidas] = useState<Emocao[]>([]);
  const [menteEscolhida, setMenteEscolhida] = useState<EstadoMente | null>(null);
  const [saudeEscolhida, setSaudeEscolhida] = useState<EstadoSaude | null>(null);
  const [texto, setTexto] = useState("");
  const [dataEscolhida, setDataEscolhida] = useState(() =>
    format(new Date(), "yyyy-MM-dd"),
  );
  const [editandoDataId, setEditandoDataId] = useState<string | null>(null);

  if (!hidratado) return <TelaCarregando />;

  const hoje = new Date();
  const registrosDoDia = reflexoes.filter(
    (r) => !r.sessionId && isSameDay(new Date(r.criadaEm), hoje),
  );
  const historico = reflexoes.filter((r) => !r.sessionId).slice(0, 14);
  const podeRegistrar = humorEscolhido !== null && texto.trim() !== "";

  function alternarEmocao(emocao: Emocao) {
    setEmocoesEscolhidas((atual) =>
      atual.includes(emocao)
        ? atual.filter((e) => e !== emocao)
        : [...atual, emocao],
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!podeRegistrar) return;
          registrarReflexao({
            humor: humorEscolhido ?? undefined,
            emocoes: emocoesEscolhidas.length > 0 ? emocoesEscolhidas : undefined,
            mente: menteEscolhida ?? undefined,
            saude: saudeEscolhida ?? undefined,
            texto: texto.trim(),
            criadaEm: dataYYYYMMDDParaISOMeioDia(dataEscolhida),
          });
          setHumorEscolhido(null);
          setEmocoesEscolhidas([]);
          setMenteEscolhida(null);
          setSaudeEscolhida(null);
          setTexto("");
          setDataEscolhida(format(new Date(), "yyyy-MM-dd"));
        }}
        className="flex flex-col gap-4 rounded-lg border border-[var(--border)] p-4"
      >
        <div>
          <h3 className="text-sm font-semibold opacity-70">
            Como você está hoje?
          </h3>
          <p className="text-xs opacity-50">
            Um registro rápido, sem certo ou errado.
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="data-registro-humor" className="text-xs opacity-70">
            Data
          </label>
          <input
            id="data-registro-humor"
            type="date"
            value={dataEscolhida}
            onChange={(e) => setDataEscolhida(e.target.value)}
            className="w-fit rounded-lg border border-[var(--border)] bg-transparent px-3 py-1.5 text-sm outline-none focus:border-[var(--accent)]"
          />
          <p className="text-xs opacity-40">
            Avaliando depois da meia-noite? Ajuste para o dia a que se refere.
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs opacity-70">Saldo do dia</label>
          <div className="flex gap-1">
            {OPCOES_HUMOR.map((op) => (
              <button
                key={op.valor}
                type="button"
                title={op.label}
                aria-pressed={humorEscolhido === op.valor}
                onClick={() =>
                  setHumorEscolhido(
                    humorEscolhido === op.valor ? null : op.valor,
                  )
                }
                className={
                  humorEscolhido === op.valor
                    ? "rounded-full bg-[var(--accent)] px-2 py-1 text-lg"
                    : "rounded-full border border-[var(--border)] px-2 py-1 text-lg opacity-60 hover:opacity-100"
                }
              >
                {op.emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs opacity-70">
            Emoções (opcional, pode escolher mais de uma)
          </label>
          <SeletorMultiplo
            opcoes={OPCOES_EMOCAO}
            valores={emocoesEscolhidas}
            onAlternar={alternarEmocao}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs opacity-70">Mente (opcional)</label>
          <SeletorUnico
            opcoes={OPCOES_MENTE}
            valor={menteEscolhida}
            onSelecionar={setMenteEscolhida}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs opacity-70">Saúde (opcional)</label>
          <SeletorUnico
            opcoes={OPCOES_SAUDE}
            valor={saudeEscolhida}
            onSelecionar={setSaudeEscolhida}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="comente-algo-bom" className="text-xs opacity-70">
            Comente 1 coisa boa do seu dia
          </label>
          <textarea
            id="comente-algo-bom"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={3}
            required
            className="resize-none rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
          />
        </div>

        <button
          type="submit"
          disabled={!podeRegistrar}
          className="self-start rounded-full bg-[var(--accent)] px-4 py-1.5 text-sm font-medium text-[var(--accent-foreground)] disabled:opacity-40"
        >
          Registrar
        </button>
        {registrosDoDia.length > 0 && (
          <p className="text-xs opacity-50">
            Você já registrou {registrosDoDia.length}{" "}
            {registrosDoDia.length === 1 ? "vez" : "vezes"} hoje — pode
            registrar de novo à vontade.
          </p>
        )}
      </form>

      <CalendarioHumorMensal reflexoes={reflexoes} />

      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold opacity-70">
          Registros recentes
        </h3>
        {historico.length === 0 ? (
          <p className="text-sm opacity-50">
            Nada registrado ainda — seus registros aparecem aqui.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {historico.map((r) => {
              const opcaoHumor = OPCOES_HUMOR.find((o) => o.valor === r.humor);
              const labelsEmocoes = (r.emocoes ?? [])
                .map((e) => OPCOES_EMOCAO.find((o) => o.valor === e)?.label)
                .filter(Boolean);
              const labelMente = OPCOES_MENTE.find(
                (o) => o.valor === r.mente,
              )?.label;
              const labelSaude = OPCOES_SAUDE.find(
                (o) => o.valor === r.saude,
              )?.label;
              return (
                <li
                  key={r.id}
                  className="flex items-start gap-3 rounded-lg border border-[var(--border)] p-3"
                >
                  {opcaoHumor && <span className="text-lg">{opcaoHumor.emoji}</span>}
                  <div className="flex flex-col gap-0.5">
                    {editandoDataId === r.id ? (
                      <input
                        type="date"
                        autoFocus
                        defaultValue={format(new Date(r.criadaEm), "yyyy-MM-dd")}
                        onChange={(e) => {
                          if (!e.target.value) return;
                          editarDataReflexao(
                            r.id,
                            dataYYYYMMDDParaISOMeioDia(e.target.value),
                          );
                        }}
                        onBlur={() => setEditandoDataId(null)}
                        className="w-fit rounded-md border border-[var(--border)] bg-transparent px-2 py-0.5 text-xs outline-none focus:border-[var(--accent)]"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setEditandoDataId(r.id)}
                        title="Editar a data deste registro"
                        className="w-fit text-xs opacity-50 underline decoration-dotted hover:opacity-80"
                      >
                        {format(new Date(r.criadaEm), "d 'de' MMMM, HH:mm", {
                          locale: ptBR,
                        })}
                      </button>
                    )}
                    {r.texto && <span className="text-sm">{r.texto}</span>}
                    {(labelsEmocoes.length > 0 || labelMente || labelSaude) && (
                      <span className="text-xs opacity-50">
                        {[...labelsEmocoes, labelMente, labelSaude]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
