"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useOrganization } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import {
  PlusIcon,
  XIcon,
  QrCodeIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react";
import { TableStatusBadge } from "@/components/shared/table-status-badge";
import QRCode from "qrcode";

export default function TablesPage() {
  const { organization, isLoaded: isOrgLoaded } = useOrganization();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState({ name: "", number: "", capacity: "" });

  const restaurant = useQuery(
    api.restaurants.getByClerkOrg,
    organization?.id ? { clerkOrgId: organization.id } : "skip"
  );

  const tables = useQuery(
    api.tables.list,
    restaurant?._id ? { restaurantId: restaurant._id } : "skip"
  );

  const tabsWithTables = useQuery(
    api.tabs.listWithOrders,
    restaurant?._id ? { restaurantId: restaurant._id } : "skip"
  );

  const createTable = useMutation(api.tables.create);
  const updateStatus = useMutation(api.tables.updateStatus);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurant?._id || !form.name || !form.number) return;

    try {
      await createTable({
        restaurantId: restaurant._id,
        name: form.name,
        number: parseInt(form.number),
        capacity: form.capacity ? parseInt(form.capacity) : undefined,
        restaurantSlug: restaurant.slug,
      });
      setForm({ name: "", number: "", capacity: "" });
      setShowCreateModal(false);
      toast.success("Mesa criada com sucesso! 🎉");
    } catch (error: any) {
      toast.error(error.message ?? "Erro ao criar mesa");
    }
  };

  const handleFreeTable = async (tableId: string) => {
    try {
      await updateStatus({ id: tableId as any, status: "FREE" });
      toast.success("Mesa liberada ✓");
    } catch {
      toast.error("Erro ao liberar mesa");
    }
  };

  const handleDownloadQr = async (tableNumber: number) => {
    if (!restaurant) return;

    const url = `https://cardapio.foodpronto.com.br/menu/${restaurant.slug}/${tableNumber}`;

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
    ctx.fillText(`Mesa ${tableNumber}`, totalWidth / 2, size + padding + labelHeight);

    ctx.fillStyle = "#6b7280";
    ctx.font = "20px Inter, system-ui, sans-serif";
    ctx.fillText(url, totalWidth / 2, size + padding + labelHeight + 32);

    const link = document.createElement("a");
    link.download = `qrcode-mesa-${tableNumber}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const isLoading = !isOrgLoaded || (organization?.id && restaurant === undefined);

  if (isLoading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="h-6 bg-gray-100 rounded w-1/4 mb-8" />
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="h-24 bg-gray-100 rounded-2xl" />
            <div className="h-24 bg-gray-100 rounded-2xl" />
            <div className="h-24 bg-gray-100 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!organization?.id || restaurant === null) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Restaurante não encontrado</h2>
          <p className="text-gray-500">Verifique se a organização está selecionada corretamente.</p>
        </div>
      </div>
    );
  }

  const freeTables = tables?.filter((t) => t.status === "FREE") ?? [];
  const occupiedTables = tables?.filter((t) => t.status === "OCCUPIED") ?? [];
  const waitingTables = tables?.filter((t) => t.status === "WAITING_PAYMENT") ?? [];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mesas</h1>
          <p className="text-gray-500 mt-2">
            Gerencie as mesas do seu restaurante e acompanhe o status em tempo real.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-red-500 text-white px-6 py-3 rounded-full font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Nova Mesa
        </button>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-100 rounded-2xl p-4">
          <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center mb-3">
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">{freeTables.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Livres</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-4">
          <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center mb-3">
            <div className="w-3 h-3 rounded-full bg-red-400" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">{occupiedTables.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Ocupadas</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-4">
          <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center mb-3">
            <div className="w-3 h-3 rounded-full bg-amber-400" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">{waitingTables.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Aguardando pagamento</p>
        </div>
      </div>

      {/* Lista de mesas */}
      {tables && tables.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tables.map((table) => {
            const tab = tabsWithTables?.find((t) => t.table?._id === table._id);
            const tabTotal = tab?.total ?? 0;
            const showAmount = table.status !== "FREE" && tabTotal > 0;

            return (
              <div
                key={table._id}
                className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-sm transition-shadow"
              >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Mesa {table.number}
                  </h3>
                  <p className="text-sm text-gray-500">{table.name}</p>
                </div>
                <TableStatusBadge status={table.status} />
              </div>

              {table.capacity && (
                <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
                  <UsersIcon className="w-4 h-4" />
                  <span>{table.capacity} pessoas</span>
                </div>
              )}

              {showAmount && (
                <div className="mb-4 rounded-xl bg-gray-50 border border-gray-100 p-3">
                  <p className="text-xs text-gray-500">Montant à payer</p>
                  <p className="text-xl font-bold text-gray-900">
                    {new Intl.NumberFormat("fr-FR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(tabTotal / 100)}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => handleDownloadQr(table.number)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <QrCodeIcon className="w-4 h-4" />
                  QR Code
                </button>
                {table.status !== "FREE" && (
                  <button
                    onClick={() => handleFreeTable(table._id)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-green-500 px-3 py-2 text-sm text-white hover:bg-green-600 transition-colors"
                  >
                    Liberar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UsersIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhuma mesa cadastrada
          </h3>
          <p className="text-gray-500 mb-6">
            Comece adicionando as mesas do seu restaurante para gerenciar pedidos.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-red-500 text-white px-6 py-3 rounded-full font-medium hover:bg-red-600 transition-colors"
          >
            Criar primeira mesa
          </button>
        </div>
      )}

      {/* Modal criar mesa */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Nova Mesa</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Ex: Mesa Janela"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número *
                </label>
                <input
                  type="number"
                  value={form.number}
                  onChange={(e) => setForm({ ...form, number: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Ex: 1"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacidade (pessoas)
                </label>
                <input
                  type="number"
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Ex: 4"
                  min="1"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  Criar Mesa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
