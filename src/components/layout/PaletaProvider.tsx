"use client";

import { useEffect } from "react";
import { useConfigStore } from "@/stores/configStore";

export function PaletaProvider({ children }: { children: React.ReactNode }) {
  const paleta = useConfigStore((state) => state.paleta);

  useEffect(() => {
    document.documentElement.dataset.paleta = paleta;
  }, [paleta]);

  return <>{children}</>;
}
