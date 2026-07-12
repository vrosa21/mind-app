import { STORAGE_KEYS } from "@/lib/storage/keys";
import { encontrarOuCriarPasta, enviarArquivo, baixarArquivo } from "./api";

const ARQUIVOS: { chave: string; nome: string }[] = [
  { chave: STORAGE_KEYS.tarefas, nome: "tarefas.json" },
  { chave: STORAGE_KEYS.timer, nome: "sessoes_timer.json" },
  { chave: STORAGE_KEYS.config, nome: "config.json" },
  { chave: STORAGE_KEYS.emblemas, nome: "emblemas.json" },
  { chave: STORAGE_KEYS.reflexoes, nome: "reflexoes.json" },
];

export async function enviarTudo(token: string): Promise<void> {
  const pastaId = await encontrarOuCriarPasta(token);
  for (const { chave, nome } of ARQUIVOS) {
    const bruto = localStorage.getItem(chave);
    if (!bruto) continue;
    await enviarArquivo(token, pastaId, nome, JSON.parse(bruto));
  }
}

export async function restaurarTudo(token: string): Promise<void> {
  const pastaId = await encontrarOuCriarPasta(token);
  for (const { chave, nome } of ARQUIVOS) {
    const conteudo = await baixarArquivo(token, pastaId, nome);
    if (conteudo) {
      localStorage.setItem(chave, JSON.stringify(conteudo));
    }
  }
}
