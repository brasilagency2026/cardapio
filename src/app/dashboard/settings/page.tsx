"use client";

import Link from "next/link";
import { useOrganization } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCallback, useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { DownloadIcon, QrCodeIcon, TableIcon } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

type QrTarget = "menu" | "table";

export default function DashboardSettingsPage() {
  const { organization } = useOrganization();

  const restaurant = useQuery(
    api.restaurants.getByClerkOrg,
    organization?.id ? { clerkOrgId: organization.id } : "skip"
  );

  const tables = useQuery(
    api.tables.list,
    restaurant?._id ? { restaurantId: restaurant._id as Id<"restaurants"> } : "skip"
  );

  const publicMenuUrl = restaurant
    ? `https://cardapio.foodpronto.com.br/${restaurant.slug}`
    : "#";

  // ─── QR Code State ──────────────────────────────────────────────
  const [qrTarget, setQrTarget] = useState<QrTarget>("menu");
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // URL that the QR code points to
  const qrUrl =
    qrTarget === "menu"
      ? publicMenuUrl
      : selectedTable !== null && restaurant
        ? `https://cardapio.foodpronto.com.br/menu/${restaurant.slug}/${selectedTable}`
        : null;

  // Generate QR code whenever the URL changes
  const generateQr = useCallback(async () => {
    if (!qrUrl || qrUrl === "#") {
      setQrDataUrl(null);
      return;
    }
    setGenerating(true);
    try {
      const dataUrl = await QRCode.toDataURL(qrUrl, {
        width: 512,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
        errorCorrectionLevel: "H",
      });
      setQrDataUrl(dataUrl);
    } catch {
      setQrDataUrl(null);
    } finally {
      setGenerating(false);
    }
  }, [qrUrl]);

  // Auto-generate when target or table changes
  useEffect(() => {
    generateQr();
  }, [generateQr]);

  // Auto-select first table when tables are loaded and target is "table"
  useEffect(() => {
    if (qrTarget === "table" && tables && tables.length > 0 && selectedTable === null) {
      setSelectedTable(tables[0].number);
    }
  }, [qrTarget, tables, selectedTable]);

  // Download handler — renders a high-res PNG with a label
  const handleDownload = useCallback(async () => {
    if (!qrUrl || qrUrl === "#") return;

    const canvas = document.createElement("canvas");
    const size = 1024;
    const padding = 80;
    const labelHeight = 60;
    const totalHeight = size + padding * 2 + labelHeight;
    const totalWidth = size + padding * 2;
    canvas.width = totalWidth;
    canvas.height = totalHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.roundRect(0, 0, totalWidth, totalHeight, 32);
    ctx.fill();

    // QR Code
    const qrCanvas = document.createElement("canvas");
    await QRCode.toCanvas(qrCanvas, qrUrl, {
      width: size,
      margin: 2,
      errorCorrectionLevel: "H",
    });
    ctx.drawImage(qrCanvas, padding, padding);

    // Label
    const label =
      qrTarget === "menu"
        ? restaurant?.name ?? "Cardápio"
        : `Mesa ${selectedTable}`;
    ctx.fillStyle = "#111827";
    ctx.font = "bold 36px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(label, totalWidth / 2, size + padding + labelHeight);

    // Sub-label (URL)
    ctx.fillStyle = "#6b7280";
    ctx.font = "20px Inter, system-ui, sans-serif";
    ctx.fillText(qrUrl, totalWidth / 2, size + padding + labelHeight + 32);

    // Trigger download
    const link = document.createElement("a");
    const fileName =
      qrTarget === "menu"
        ? `qrcode-${restaurant?.slug ?? "menu"}.png`
        : `qrcode-mesa-${selectedTable}.png`;
    link.download = fileName;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [qrUrl, qrTarget, restaurant, selectedTable]);

  // Download all table QR codes as individual PNGs
  const handleDownloadAllTables = useCallback(async () => {
    if (!tables || tables.length === 0 || !restaurant) return;

    for (const table of tables) {
      const url = `https://cardapio.foodpronto.com.br/menu/${restaurant.slug}/${table.number}`;

      const canvas = document.createElement("canvas");
      const size = 1024;
      const padding = 80;
      const labelHeight = 60;
      const totalHeight = size + padding * 2 + labelHeight;
      const totalWidth = size + padding * 2;
      canvas.width = totalWidth;
      canvas.height = totalHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) continue;

      ctx.fillStyle = "#ffffff";
      ctx.roundRect(0, 0, totalWidth, totalHeight, 32);
      ctx.fill();

      const qrCanvas = document.createElement("canvas");
      await QRCode.toCanvas(qrCanvas, url, {
        width: size,
        margin: 2,
        errorCorrectionLevel: "H",
      });
      ctx.drawImage(qrCanvas, padding, padding);

      ctx.fillStyle = "#111827";
      ctx.font = "bold 36px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`Mesa ${table.number}`, totalWidth / 2, size + padding + labelHeight);

      ctx.fillStyle = "#6b7280";
      ctx.font = "20px Inter, system-ui, sans-serif";
      ctx.fillText(url, totalWidth / 2, size + padding + labelHeight + 32);

      const link = document.createElement("a");
      link.download = `qrcode-mesa-${table.number}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      // Small delay between downloads to avoid browser blocking
      await new Promise((r) => setTimeout(r, 300));
    }
  }, [tables, restaurant]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Configurações</h1>
            <p className="text-sm text-gray-500 mt-2">
              Acompanhe seu restaurante, plano e link público. Em breve você poderá editar mais configurações.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-red-600 font-medium hover:text-red-700"
          >
            Voltar ao dashboard
          </Link>
        </div>

        <div className="grid gap-5">
          <section className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Informações do restaurante</h2>
            {restaurant ? (
              <div className="space-y-4 text-sm text-gray-700">
                <div>
                  <p className="font-medium text-gray-900">Nome</p>
                  <p>{restaurant.name}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Slug</p>
                  <p>{restaurant.slug}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Plano atual</p>
                  <p>{restaurant.plan ?? "Não definido"}</p>
                </div>
              </div>
            ) : (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-1/5" />
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Link público</h2>
                <p className="text-sm text-gray-500">
                  Os clientes acessam o seu cardápio através deste endereço.
                </p>
              </div>
              <Link
                href={publicMenuUrl}
                target="_blank"
                className="text-sm text-red-600 font-medium hover:text-red-700"
              >
                Abrir link
              </Link>
            </div>
            <div className="rounded-2xl bg-white border border-gray-200 p-4 text-sm text-gray-700 break-words">
              {publicMenuUrl}
            </div>
          </section>

          {/* ─── QR Code Section ─────────────────────────────────── */}
          <section className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">QR Code</h2>
            <p className="text-sm text-gray-500 mb-5">
              Gere QR Codes para o cardápio geral ou para mesas específicas. Imprima e coloque nas mesas.
            </p>

            {/* Target selector */}
            <div className="flex gap-3 mb-5">
              <button
                onClick={() => {
                  setQrTarget("menu");
                  setSelectedTable(null);
                }}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                  qrTarget === "menu"
                    ? "bg-red-500 text-white shadow-sm"
                    : "bg-white border border-gray-300 text-gray-700 hover:border-gray-400"
                }`}
              >
                <QrCodeIcon className="w-4 h-4" />
                Cardápio geral
              </button>
              <button
                onClick={() => {
                  setQrTarget("table");
                  if (tables && tables.length > 0 && selectedTable === null) {
                    setSelectedTable(tables[0].number);
                  }
                }}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                  qrTarget === "table"
                    ? "bg-red-500 text-white shadow-sm"
                    : "bg-white border border-gray-300 text-gray-700 hover:border-gray-400"
                }`}
              >
                <TableIcon className="w-4 h-4" />
                Por mesa
              </button>
            </div>

            {/* Table selector */}
            {qrTarget === "table" && (
              <div className="mb-5">
                {tables && tables.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {tables.map((table) => (
                      <button
                        key={table._id}
                        onClick={() => setSelectedTable(table.number)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                          selectedTable === table.number
                            ? "bg-gray-900 text-white"
                            : "bg-white border border-gray-300 text-gray-700 hover:border-gray-400"
                        }`}
                      >
                        Mesa {table.number}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl bg-white border border-gray-200 p-4 text-sm text-gray-500">
                    Nenhuma mesa cadastrada. Cadastre mesas no dashboard para gerar QR Codes por mesa.
                  </div>
                )}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              {/* QR Code preview */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <p className="text-sm font-medium text-gray-900 mb-3">
                  {qrTarget === "menu"
                    ? "QR Code — Cardápio geral"
                    : selectedTable !== null
                      ? `QR Code — Mesa ${selectedTable}`
                      : "Selecione uma mesa"}
                </p>
                <div className="flex items-center justify-center">
                  {generating ? (
                    <div className="h-48 w-48 rounded-2xl bg-gray-100 flex items-center justify-center">
                      <div className="h-8 w-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt={
                        qrTarget === "menu"
                          ? "QR Code do cardápio"
                          : `QR Code da mesa ${selectedTable}`
                      }
                      className="h-48 w-48 rounded-xl"
                    />
                  ) : (
                    <div className="h-48 w-48 rounded-2xl bg-gray-100 flex items-center justify-center">
                      <QrCodeIcon className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                </div>
                {qrUrl && qrUrl !== "#" && (
                  <p className="text-xs text-gray-400 text-center mt-3 break-all">
                    {qrUrl}
                  </p>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>

              {/* Actions */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <p className="text-sm font-medium text-gray-900 mb-3">Ações</p>
                <div className="space-y-3">
                  <button
                    onClick={handleDownload}
                    disabled={!qrDataUrl}
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-red-500 px-4 py-3 text-sm font-medium text-white hover:bg-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <DownloadIcon className="w-4 h-4" />
                    {qrTarget === "menu"
                      ? "Baixar QR Code"
                      : `Baixar QR Code — Mesa ${selectedTable ?? "?"}`}
                  </button>

                  {qrTarget === "table" && tables && tables.length > 1 && (
                    <button
                      onClick={handleDownloadAllTables}
                      className="w-full flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                    >
                      <DownloadIcon className="w-4 h-4" />
                      Baixar todas as mesas ({tables.length})
                    </button>
                  )}

                  <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 text-xs text-gray-500">
                    <p className="font-medium text-gray-700 mb-1">💡 Dica</p>
                    <p>
                      {qrTarget === "menu"
                        ? "Imprima o QR Code e coloque na entrada do restaurante ou em materiais promocionais."
                        : "Imprima cada QR Code e cole na mesa correspondente. O pedido já será vinculado à mesa automaticamente."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
