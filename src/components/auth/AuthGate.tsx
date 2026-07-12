"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useConfigStore } from "@/stores/configStore";
import { useHidratado } from "@/hooks/useHidratado";
import { useEstaDesbloqueado } from "@/hooks/useEstaDesbloqueado";
import { AppShell } from "@/components/layout/AppShell";
import { TelaCarregando } from "@/components/layout/TelaCarregando";

const ROTA_DESBLOQUEIO = "/unlock";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // A senha (config.json) vive no zustand persist, que só hidrata a
  // partir do localStorage no cliente — evita mismatch de SSR.
  const hidratado = useHidratado(useConfigStore.persist);
  const desbloqueadoReal = useEstaDesbloqueado();

  const emRotaDesbloqueio = pathname === ROTA_DESBLOQUEIO;
  const desbloqueado = hidratado && desbloqueadoReal;

  useEffect(() => {
    if (!hidratado) return;
    if (!desbloqueado && !emRotaDesbloqueio) {
      router.replace(ROTA_DESBLOQUEIO);
    } else if (desbloqueado && emRotaDesbloqueio) {
      router.replace("/");
    }
  }, [hidratado, desbloqueado, emRotaDesbloqueio, router]);

  if (!hidratado) return <TelaCarregando />;
  if (!desbloqueado && !emRotaDesbloqueio) return <TelaCarregando />;
  if (desbloqueado && emRotaDesbloqueio) return <TelaCarregando />;
  if (emRotaDesbloqueio) return <>{children}</>;

  return <AppShell>{children}</AppShell>;
}
