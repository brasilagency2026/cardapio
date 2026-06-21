"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useOrganization } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { formatCurrency } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChefHatIcon,
  FilterIcon,
} from "lucide-react";
import { OrderStatusBadge } from "@/components/shared/order-status-badge";

const STATUS_FLOW: Record<string, string> = {
  PENDING: "ACCEPTED",
  ACCEPTED: "PREPARING",
  PREPARING: "READY",
  READY: "DELIVERED",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendente",
  ACCEPTED: "Aceito",
  PREPARING: "Preparando",
  READY: "Pronto",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
};

const NEXT_ACTION_LABELS: Record<string, string> = {
  PENDING: "Aceitar",
  ACCEPTED: "Preparar",
  PREPARING: "Marcar pronto",
  READY: "Marcar entregue",
};

export default function OrdersPage() {
  const { organization, isLoaded: isOrgLoaded } = useOrganization();
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

  const filteredOrders =
    filter === "ALL" ? orders : orders?.filter((o) => o.status === filter);

  const handleAdvance = async (orderId: string, currentStatus: string) => {
    const next = STATUS_FLOW[currentStatus];
    if (!next) return;

    try {
      await updateStatus({ id: orderId as any, status: next as any });
      toast.success(`Pedido atualizado para: ${STATUS_LABELS[next]}`);
    } catch {
      toast.error("Erro ao atualizar pedido");
    }
  };

  const handleCancel = async (orderId: string) => {
    try {
      await updateStatus({ id: orderId as any, status: "CANCELLED" });
      toast.success("Pedido cancelado");
    } catch {
      toast.error("Erro ao cancelar pedido");
    }
  };

  const counts = {
    ALL: orders?.length ?? 0,
    PENDING: orders?.filter((o) => o.status === "PENDING").length ?? 0,
    ACCEPTED: orders?.filter((o) => o.status === "ACCEPTED").length ?? 0,
    PREPARING: orders?.filter((o) => o.status === "PREPARING").length ?? 0,
    READY: orders?.filter((o) => o.status === "READY").length ?? 0,
  };

  const isLoading = !isOrgLoaded || (organization?.id && restaurant === undefined);

  if (isLoading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="h-6 bg-gray-100 rounded w-1/4 mb-8" />
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

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-gray-500 mt-2">
            Acompanhe e gerencie os pedidos em andamento.
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(["ALL", "PENDING", "ACCEPTED", "PREPARING", "READY"] as const).map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                filter === status
                  ? "bg-red-500 text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-700 hover:border-gray-400"
              }`}
            >
              {status === "ALL" ? "Todos" : STATUS_LABELS[status]}
              <span
                className={`inline-flex items-center justify-center rounded-full px-1.5 text-xs font-semibold ${
                  filter === status
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {counts[status]}
              </span>
            </button>
          )
        )}
      </div>

      {/* Lista de pedidos */}
      {filteredOrders && filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-sm font-bold text-gray-700">
                    {(order as any).table?.number ?? "?"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Mesa {(order as any).table?.number ?? "—"}
                    </h3>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <ClockIcon className="w-3 h-3" />
                      {formatDistanceToNow(new Date(order.createdAt), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>

              {/* Itens */}
              {(order as any).items && (order as any).items.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-3 mb-4 space-y-2">
                  {(order as any).items.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-700">
                        <span className="font-medium text-gray-900">
                          {item.quantity}x
                        </span>{" "}
                        {item.productName}
                      </span>
                      <span className="text-gray-500">
                        {formatCurrency(item.subtotal / 100)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {order.notes && (
                <p className="text-sm text-gray-500 italic mb-4">
                  📝 {order.notes}
                </p>
              )}

              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900">
                  Total: {formatCurrency(order.total / 100)}
                </p>
                <div className="flex gap-2">
                  {order.status !== "DELIVERED" &&
                    order.status !== "CANCELLED" && (
                      <>
                        <button
                          onClick={() => handleCancel(order._id)}
                          className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          <XCircleIcon className="w-4 h-4" />
                          Cancelar
                        </button>
                        <button
                          onClick={() =>
                            handleAdvance(order._id, order.status)
                          }
                          className="flex items-center gap-1.5 rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600 transition-colors font-medium"
                        >
                          <CheckCircleIcon className="w-4 h-4" />
                          {NEXT_ACTION_LABELS[order.status] ?? "Avançar"}
                        </button>
                      </>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ChefHatIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhum pedido em andamento
          </h3>
          <p className="text-gray-500">
            Quando os clientes fizerem pedidos pelo cardápio, eles aparecerão
            aqui.
          </p>
        </div>
      )}
    </div>
  );
}
