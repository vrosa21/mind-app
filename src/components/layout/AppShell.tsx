"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { bloquear } from "@/lib/auth/sessao";

const LINKS = [
  { href: "/", label: "Início" },
  { href: "/tarefas", label: "Tarefas" },
  { href: "/progresso", label: "Progresso" },
  { href: "/humor", label: "Humor" },
  { href: "/config", label: "Config" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-[var(--border)]">
        <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold">Mind</span>
          <div className="flex items-center gap-4 text-sm">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  pathname === link.href
                    ? "font-semibold text-[var(--accent)]"
                    : "text-[var(--foreground)] opacity-70 hover:opacity-100"
                }
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                bloquear();
                router.replace("/unlock");
              }}
              className="rounded-full border border-[var(--border)] px-3 py-1 opacity-70 hover:opacity-100"
            >
              Bloquear
            </button>
          </div>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">
        {children}
      </main>
    </div>
  );
}
