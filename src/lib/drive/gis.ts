"use client";

const SCRIPT_SRC = "https://accounts.google.com/gsi/client";
const SCOPO_DRIVE = "https://www.googleapis.com/auth/drive.file";

let scriptCarregado: Promise<void> | null = null;

function carregarScript(): Promise<void> {
  if (scriptCarregado) return scriptCarregado;
  scriptCarregado = new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Falha ao carregar o Google Identity Services"));
    document.head.appendChild(script);
  });
  return scriptCarregado;
}

export async function solicitarTokenAcesso(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error(
      "NEXT_PUBLIC_GOOGLE_CLIENT_ID não configurado — veja docs/google-drive-setup.md",
    );
  }
  await carregarScript();

  return new Promise((resolve, reject) => {
    const cliente = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: SCOPO_DRIVE,
      callback: (resposta) => {
        if (resposta.access_token) {
          resolve(resposta.access_token);
        } else {
          reject(new Error(resposta.error ?? "Falha na autorização do Google"));
        }
      },
    });
    cliente.requestAccessToken();
  });
}

export function revogarToken(token: string): void {
  window.google?.accounts?.oauth2?.revoke(token);
}
