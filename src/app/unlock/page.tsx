"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useConfigStore } from "@/stores/configStore";
import { useHidratado } from "@/hooks/useHidratado";
import { hashSenha, verificarSenha } from "@/lib/auth/senha";
import { desbloquear } from "@/lib/auth/sessao";
import { TelaCarregando } from "@/components/layout/TelaCarregando";

export default function UnlockPage() {
  const router = useRouter();
  const hidratado = useHidratado(useConfigStore.persist);
  const senhaHash = useConfigStore((s) => s.senhaHash);
  const setSenhaHash = useConfigStore((s) => s.setSenhaHash);

  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  if (!hidratado) return <TelaCarregando />;

  const primeiroUso = !senhaHash;

  async function handleCriarSenha(e: React.FormEvent) {
    e.preventDefault();
    setMensagem(null);

    if (senha.length < 4) {
      setMensagem("Use pelo menos 4 caracteres — só para dificultar aberturas por acidente.");
      return;
    }
    if (senha !== confirmacao) {
      setMensagem("As senhas não coincidem. Sem problema, é só tentar de novo.");
      return;
    }

    setCarregando(true);
    const hash = await hashSenha(senha);
    setSenhaHash(hash);
    desbloquear();
    router.replace("/");
  }

  async function handleDestravar(e: React.FormEvent) {
    e.preventDefault();
    setMensagem(null);
    setCarregando(true);

    const correta = await verificarSenha(senha, senhaHash!);
    setCarregando(false);

    if (!correta) {
      setMensagem("Senha incorreta. Tente novamente quando quiser.");
      return;
    }
    desbloquear();
    router.replace("/");
  }

  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-xl font-semibold">Mind</h1>
        <p className="mb-6 text-sm opacity-70">
          {primeiroUso
            ? "Crie uma senha simples para este dispositivo."
            : "Digite sua senha para continuar."}
        </p>

        <form
          onSubmit={primeiroUso ? handleCriarSenha : handleDestravar}
          className="flex flex-col gap-3"
        >
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Senha"
            autoFocus
            className="rounded-lg border border-[var(--border)] bg-transparent px-4 py-2 outline-none focus:border-[var(--accent)]"
          />
          {primeiroUso && (
            <input
              type="password"
              value={confirmacao}
              onChange={(e) => setConfirmacao(e.target.value)}
              placeholder="Confirme a senha"
              className="rounded-lg border border-[var(--border)] bg-transparent px-4 py-2 outline-none focus:border-[var(--accent)]"
            />
          )}

          {mensagem && (
            <p className="text-sm text-[var(--accent)]" role="status">
              {mensagem}
            </p>
          )}

          <button
            type="submit"
            disabled={carregando || !senha}
            className="mt-2 rounded-full bg-[var(--accent)] px-4 py-2 font-medium text-[var(--accent-foreground)] disabled:opacity-50"
          >
            {primeiroUso ? "Criar senha" : "Destravar"}
          </button>
        </form>
      </div>
    </div>
  );
}
