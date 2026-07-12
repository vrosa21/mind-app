const API_BASE = "https://www.googleapis.com/drive/v3";
const UPLOAD_BASE = "https://www.googleapis.com/upload/drive/v3";
const NOME_PASTA = "Mind";

async function chamarDrive(
  token: string,
  url: string,
  init?: RequestInit,
): Promise<Response> {
  const resposta = await fetch(url, {
    ...init,
    headers: { ...init?.headers, Authorization: `Bearer ${token}` },
  });
  if (!resposta.ok) {
    throw new Error(`Drive API falhou (${resposta.status}): ${await resposta.text()}`);
  }
  return resposta;
}

export async function encontrarOuCriarPasta(token: string): Promise<string> {
  const busca = await chamarDrive(
    token,
    `${API_BASE}/files?q=${encodeURIComponent(
      `name='${NOME_PASTA}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    )}&fields=files(id,name)`,
  );
  const { files } = await busca.json();
  if (files?.length > 0) return files[0].id;

  const criada = await chamarDrive(token, `${API_BASE}/files`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: NOME_PASTA,
      mimeType: "application/vnd.google-apps.folder",
    }),
  });
  const pasta = await criada.json();
  return pasta.id;
}

async function encontrarArquivo(
  token: string,
  pastaId: string,
  nome: string,
): Promise<string | null> {
  const busca = await chamarDrive(
    token,
    `${API_BASE}/files?q=${encodeURIComponent(
      `name='${nome}' and '${pastaId}' in parents and trashed=false`,
    )}&fields=files(id,name)`,
  );
  const { files } = await busca.json();
  return files?.[0]?.id ?? null;
}

export async function enviarArquivo(
  token: string,
  pastaId: string,
  nome: string,
  conteudo: unknown,
): Promise<void> {
  const idExistente = await encontrarArquivo(token, pastaId, nome);
  const corpo = JSON.stringify(conteudo);

  if (idExistente) {
    await chamarDrive(
      token,
      `${UPLOAD_BASE}/files/${idExistente}?uploadType=media`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: corpo,
      },
    );
    return;
  }

  const metadados = { name: nome, parents: [pastaId] };
  const boundary = "mind-app-boundary";
  const multipart =
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadados)}\r\n` +
    `--${boundary}\r\nContent-Type: application/json\r\n\r\n${corpo}\r\n` +
    `--${boundary}--`;

  await chamarDrive(token, `${UPLOAD_BASE}/files?uploadType=multipart`, {
    method: "POST",
    headers: { "Content-Type": `multipart/related; boundary=${boundary}` },
    body: multipart,
  });
}

export async function baixarArquivo(
  token: string,
  pastaId: string,
  nome: string,
): Promise<unknown | null> {
  const id = await encontrarArquivo(token, pastaId, nome);
  if (!id) return null;
  const resposta = await chamarDrive(token, `${API_BASE}/files/${id}?alt=media`);
  return resposta.json();
}
