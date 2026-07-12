import type { IntensidadeNotificacao } from "@/types";

// Sinal sonoro suave ao fim da sessão — sem depender de arquivos de
// áudio externos. Intensidade respeita a preferência sensorial do
// usuário (Config.intensidadeNotificacao).
export function tocarChime(intensidade: IntensidadeNotificacao): void {
  if (intensidade === "silencioso") return;
  if (typeof window === "undefined") return;

  const AudioContextClasse =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioContextClasse) return;

  const ctx = new AudioContextClasse();
  const volume = intensidade === "normal" ? 0.15 : 0.06;
  const duracao = intensidade === "normal" ? 0.9 : 0.5;

  [880, 1320].forEach((freq, i) => {
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

  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(intensidade === "normal" ? [80, 40, 80] : [40]);
  }

  setTimeout(() => ctx.close(), (duracao + 0.5) * 1000);
}
