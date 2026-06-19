"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
      <div className="bg-neutral-900 border border-red-500/30 rounded-3xl p-8 max-w-lg w-full text-center space-y-4">
        <div className="text-4xl">⚠️</div>
        <h2 className="text-white text-xl font-bold">Erro no painel admin</h2>
        <div className="bg-neutral-800 rounded-xl p-4 text-left">
          <p className="text-red-400 text-xs font-mono break-all">{error.message}</p>
        </div>
        <p className="text-neutral-400 text-sm">
          Provável causa: as funções Convex não foram deployadas.<br />
          Execute <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-xs">npx convex deploy</code> no terminal.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-[#E24B4A] text-white rounded-full text-sm font-semibold"
          >
            Tentar novamente
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 border border-neutral-700 text-neutral-400 rounded-full text-sm"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}
