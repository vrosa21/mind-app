import type { IntensidadeNotificacao } from "@/types";

// Sinal sonoro suave nos marcos da sessão — sem depender de arquivos de
// áudio externos. Intensidade respeita a preferência sensorial do
// usuário (Config.intensidadeNotificacao).
//
// "fim": duas notas ascendentes, marcando a conclusão da sessão.
// "metade": uma única nota grave e mais curta, avisando a metade do
// tempo sem chamar tanta atenção quanto o som de conclusão.
export function tocarChime(
  intensidade: IntensidadeNotificacao,
  variante: "fim" | "metade" = "fim",
): void {
  if (intensidade === "silencioso") return;
  if (typeof window === "undefined") return;

  const AudioContextClasse =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioContextClasse) return;

  const ctx = new AudioContextClasse();
  const volumeBase = intensidade === "normal" ? 0.15 : 0.06;
  const duracaoBase = intensidade === "normal" ? 0.9 : 0.5;
  const volume = variante === "metade" ? volumeBase * 0.6 : volumeBase;
  const duracao = variante === "metade" ? 0.35 : duracaoBase;
  const frequencias = variante === "metade" ? [660] : [880, 1320];

  frequencias.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    const inicio = ctx.currentTime + i * 0.18;
    gain.gain.setValueAtTime(0, inicio);
    gain.gain.linearRampToValueAtTime(volume, inicio + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, inicio + duracao);
    osc.connect(gain).connect(ctx.destination);
    osc.start(inicio);
    osc.stop(inicio + duracao + 0.05);
  });

  if (variante === "fim" && typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(intensidade === "normal" ? [80, 40, 80] : [40]);
  }

  setTimeout(() => ctx.close(), (duracao + 0.5) * 1000);
}
