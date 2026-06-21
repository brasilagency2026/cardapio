"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useOrganization } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { ClockIcon, ChefHatIcon, CheckIcon, PlayIcon } from "lucide-react";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Novo Pedido",
  ACCEPTED: "Aceito",
  PREPARING: "Preparando",
  READY: "Pronto",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "border-l-blue-500 bg-blue-50",
  ACCEPTED: "border-l-amber-500 bg-amber-50",
  PREPARING: "border-l-orange-500 bg-orange-50",
  READY: "border-l-green-500 bg-green-50",
};

const STATUS_BADGE: Record<string, string> = {
  PENDING: "bg-blue-100 text-blue-700",
  ACCEPTED: "bg-amber-100 text-amber-700",
  PREPARING: "bg-orange-100 text-orange-700",
  READY: "bg-green-100 text-green-700",
};

export default function KitchenPage() {
  const { organization } = useOrganization();
  const [filter, setFilter] = useState<string>("ALL");

  const restaurant = useQuery(
    api.restaurants.getByClerkOrg,
    organization?.id ? { clerkOrgId: organization.id } : "skip"
  );

  const orders = useQuery(
    api.orders.listActive,
    restaurant?._id ? { restaurantId: restaurant._id } : "skip"
  );

  const updateStatus = useMutation(api.orders.updateStatus);

  const filteredOrders = orders?.filter(
    // Na cozinha: não mostrar PENDING (aguarda confirmação do garçom)
    (o) => o.status !== "PENDING" && (filter === "ALL" || o.status === filter)
  );

  async function handleNext(orderId: string, currentStatus: string) {
    const nextMap: Record<string, string> = {
      ACCEPTED: "PREPARING",
      PREPARING: "READY",
    };
    const next = nextMap[currentStatus];
    if (!next) return;

    try {
      await updateStatus({ id: orderId as any, status: next as any });
      toast.success(`Pedido marcado como: ${STATUS_LABELS[next]}`);
    } catch {
      toast.error("Erro ao atualizar pedido");
    }
  }

  const counts = {
    ALL: orders?.filter((o) => o.status !== "PENDING").length ?? 0,
    ACCEPTED: orders?.filter((o) => o.status === "ACCEPTED").length ?? 0,
    PREPARING: orders?.filter((o) => o.status === "PREPARING").length ?? 0,
    READY: orders?.filter((o) => o.status === "READY").length ?? 0,
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header KDS */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-red-500 rounded-lg flex items-center justify-center">
            <ChefHatIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-white">Painel da Cozinha</h1>
            <p className="text-xs text-gray-400">{restaurant?.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Ao vivo
        </div>
      </div>

      {/* Filtros */}
      <div className="px-6 py-3 bg-gray-900 border-b border-gray-800 flex gap-2 overflow-x-auto">
        {[
          { key: "ALL", label: "Todos" },
          { key: "ACCEPTED", label: "Aceitos" },
          { key: "PREPARING", label: "Preparando" },
          { key: "READY", label: "Prontos" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === f.key
                ? "bg-red-500 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {f.label}
            {counts[f.key as keyof typeof counts] > 0 && (
              <span className="ml-1.5 bg-white/20 text-xs rounded-full px-1.5 py-0.5">
                {counts[f.key as keyof typeof counts]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Cards de pedidos */}
      <div className="p-6">
        {!filteredOrders || filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-600">
            <ChefHatIcon className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg">Nenhum pedido no momento</p>
            <p className="text-sm mt-1 opacity-60">Aguardando novos pedidos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onNext={handleNext}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OrderCard({
  order,
  onNext,
}: {
  order: any;
  onNext: (id: string, status: string) => void;
}) {
  const elapsed = Math.floor((Date.now() - order.createdAt) / 60000);
  const isUrgent = elapsed > 15 && order.status !== "READY";

  const nextLabel: Record<string, string> = {
    PENDING: "Aceitar pedido",
    ACCEPTED: "Iniciar preparo",
    PREPARING: "Marcar como pronto",
  };

  return (
    <div
      className={`bg-gray-900 border border-gray-800 border-l-4 rounded-xl overflow-hidden ${
        isUrgent ? "border-l-red-500" : STATUS_COLORS[order.status]?.replace("bg-", "").replace("50", "500").split(" ")[0] || "border-l-gray-600"
      }`}
    >
      {/* Header do card */}
      <div className="px-4 py-3 bg-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white">
            Mesa {(order as any).table?.number ?? "—"}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[order.status]}`}
          >
            {STATUS_LABELS[order.status]}
          </span>
        </div>
        <div
          className={`flex items-center gap-1 text-sm ${
            isUrgent ? "text-red-400" : "text-gray-400"
          }`}
        >
          <ClockIcon className="w-3.5 h-3.5" />
          <span className={isUrgent ? "font-bold" : ""}>{elapsed} min</span>
        </div>
      </div>

      {/* Itens */}
      <div className="p-4 space-y-2">
        {(order as any).items?.map((item: any, i: number) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-gray-400 text-sm min-w-[20px]">
              {item.quantity}x
            </span>
            <div>
              <p className="text-white text-sm">{item.productName}</p>
              {item.notes && (
                <p className="text-amber-400 text-xs italic mt-0.5">
                  ⚠ {item.notes}
                </p>
              )}
            </div>
          </div>
        ))}

        {order.notes && (
          <div className="mt-3 pt-3 border-t border-gray-800">
            <p className="text-xs text-gray-400">Obs. geral:</p>
            <p className="text-sm text-amber-300 italic">{order.notes}</p>
          </div>
        )}
      </div>

      {/* Ação */}
      {order.status !== "READY" && (
        <div className="px-4 pb-4">
          <button
            onClick={() => onNext(order._id, order.status)}
            className="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {order.status === "PREPARING" ? (
              <CheckIcon className="w-4 h-4" />
            ) : (
              <PlayIcon className="w-4 h-4" />
            )}
            {nextLabel[order.status]}
          </button>
        </div>
      )}

      {order.status === "READY" && (
        <div className="px-4 pb-4">
          <div className="w-full py-2.5 bg-green-900 text-green-400 text-sm font-medium rounded-lg flex items-center justify-center gap-2">
            <CheckIcon className="w-4 h-4" />
            Pronto — aguardando garçom
          </div>
        </div>
      )}
    </div>
  );
}
