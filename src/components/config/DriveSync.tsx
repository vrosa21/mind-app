"use client";

import { useRef, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useConfigStore } from "@/stores/configStore";
import { solicitarTokenAcesso, revogarToken } from "@/lib/drive/gis";
import { enviarTudo, restaurarTudo } from "@/lib/drive/sync";

type Status = "ocioso" | "conectando" | "enviando" | "restaurando";

export function DriveSync() {
  const googleConectado = useConfigStore((s) => s.googleConectado);
  const setGoogleConectado = useConfigStore((s) => s.setGoogleConectado);
  const ultimaSincronizacaoEm = useConfigStore((s) => s.ultimaSincronizacaoEm);
  const setUltimaSincronizacaoEm = useConfigStore(
    (s) => s.setUltimaSincronizacaoEm,
  );

  const tokenRef = useRef<string | null>(null);
  const [status, setStatus] = useState<Status>("ocioso");
  const [erro, setErro] = useState<string | null>(null);
  const [confirmandoRestauracao, setConfirmandoRestauracao] = useState(false);

  async function garantirToken(): Promise<string> {
    if (tokenRef.current) return tokenRef.current;
    const token = await solicitarTokenAcesso();
    tokenRef.current = token;
    return token;
  }

  async function handleConectar() {
    setStatus("conectando");
    setErro(null);
    try {
      await garantirToken();
      setGoogleConectado(true);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha ao conectar com o Google");
    } finally {
      setStatus("ocioso");
    }
  }

  async function handleEnviar() {
    setStatus("enviando");
    setErro(null);
    try {
      const token = await garantirToken();
      await enviarTudo(token);
      setUltimaSincronizacaoEm(new Date().toISOString());
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha ao enviar para o Drive");
    } finally {
      setStatus("ocioso");
    }
  }

  async function handleRestaurar() {
    if (!confirmandoRestauracao) {
      setConfirmandoRestauracao(true);
      return;
    }
    setStatus("restaurando");
    setErro(null);
    try {
      const token = await garantirToken();
      await restaurarTudo(token);
      location.reload();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha ao restaurar do Drive");
      setStatus("ocioso");
      setConfirmandoRestauracao(false);
    }
  }

  function handleDesconectar() {
    if (tokenRef.current) revogarToken(tokenRef.current);
    tokenRef.current = null;
    setGoogleConectado(false);
    setConfirmandoRestauracao(false);
  }

  const ocupado = status !== "ocioso";

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold opacity-70">Google Drive</h2>
      <p className="text-sm opacity-60">
        Guarda uma cópia dos seus dados numa pasta &quot;Mind&quot; no seu
        próprio Drive. Nada é enviado a nenhum outro lugar.
      </p>

      {!googleConectado ? (
        <button
          type="button"
          onClick={handleConectar}
          disabled={ocupado}
          className="self-start rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-foreground)] disabled:opacity-40"
        >
          {status === "conectando" ? "Conectando…" : "Conectar Google Drive"}
        </button>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-xs opacity-50" role="status">
            Conectado
            {ultimaSincronizacaoEm &&
              ` — última sincronização em ${format(
                new Date(ultimaSincronizacaoEm),
                "d 'de' MMMM, HH:mm",
                { locale: ptBR },
              )}`}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleEnviar}
              disabled={ocupado}
              className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-foreground)] disabled:opacity-40"
            >
              {status === "enviando" ? "Enviando…" : "Enviar para o Drive"}
            </button>
            <button
              type="button"
              onClick={handleRestaurar}
              disabled={ocupado}
              className="rounded-full border border-[var(--border)] px-4 py-2 text-sm opacity-70 hover:opacity-100 disabled:opacity-40"
            >
              {status === "restaurando"
                ? "Restaurando…"
                : confirmandoRestauracao
                  ? "Confirmar — substitui os dados locais"
                  : "Restaurar do Drive"}
            </button>
            {confirmandoRestauracao && (
              <button
                type="button"
                onClick={() => setConfirmandoRestauracao(false)}
                className="rounded-full px-4 py-2 text-sm opacity-60 hover:opacity-100"
              >
                Cancelar
              </button>
            )}
            <button
              type="button"
              onClick={handleDesconectar}
              disabled={ocupado}
              className="rounded-full px-4 py-2 text-sm opacity-60 hover:opacity-100 disabled:opacity-40"
            >
              Desconectar
            </button>
          </div>
        </div>
      )}

      {erro && (
        <p className="text-xs text-[var(--accent)]" role="alert">
          {erro}
        </p>
      )}
    </section>
  );
}
