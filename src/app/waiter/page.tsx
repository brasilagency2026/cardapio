"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useOrganization } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import {
  TableIcon,
  BellIcon,
  CheckCircleIcon,
  CreditCardIcon,
  UtensilsIcon,
} from "lucide-react";

const PAYMENT_METHODS = [
  { value: "PIX", label: "PIX", emoji: "📲" },
  { value: "CREDIT", label: "Crédito", emoji: "💳" },
  { value: "DEBIT", label: "Débito", emoji: "💳" },
  { value: "CASH", label: "Dinheiro", emoji: "💵" },
];

export default function WaiterPage() {
  const { organization } = useOrganization();
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("PIX");

  const restaurant = useQuery(
    api.restaurants.getByClerkOrg,
    organization?.id ? { clerkOrgId: organization.id } : "skip"
  );

  const tables = useQuery(
    api.tables.list,
    restaurant?._id ? { restaurantId: restaurant._id } : "skip"
  );

  const activeOrders = useQuery(
    api.orders.listActive,
    restaurant?._id ? { restaurantId: restaurant._id } : "skip"
  );

  const openTab = useMutation(api.tabs.open);
  const closeTab = useMutation(api.tabs.close);
  const updateOrderStatus = useMutation(api.orders.updateStatus);

  const readyOrders = activeOrders?.filter((o) => o.status === "READY") ?? [];
  const waitingTables = tables?.filter((t) => t.status === "WAITING_PAYMENT") ?? [];

  async function handleDeliver(orderId: string) {
    try {
      await updateOrderStatus({ id: orderId as any, status: "DELIVERED" });
      toast.success("Pedido marcado como entregue ✓");
    } catch {
      toast.error("Erro ao atualizar pedido");
    }
  }

  async function handlePay() {
    if (!selectedTable || !restaurant?._id) return;
    try {
      const tab = await openTab({
        restaurantId: restaurant._id,
        tableId: selectedTable._id,
      });
      await closeTab({
        id: tab as any,
        tableId: selectedTable._id,
        method: paymentMethod as any,
      });
      setPaymentModal(false);
      setSelectedTable(null);
      toast.success("Pagamento registrado. Mesa liberada! 🎉");
    } catch {
      toast.error("Erro ao registrar pagamento");
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-medium text-gray-900">Painel do Garçom</h1>
        <p className="text-sm text-gray-500">
          {restaurant?.name} · Visão operacional
        </p>
      </div>

      {/* Alertas */}
      {(readyOrders.length > 0 || waitingTables.length > 0) && (
        <div className="space-y-3">
          {readyOrders.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <BellIcon className="w-5 h-5 text-green-600 animate-bounce" />
                <span className="font-medium text-green-800">
                  {readyOrders.length} pedido{readyOrders.length > 1 ? "s" : ""} pronto{readyOrders.length > 1 ? "s" : ""} para entrega
                </span>
              </div>
              <div className="space-y-2">
                {readyOrders.map((order) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between bg-white rounded-lg p-3"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        Mesa {(order as any).table?.number ?? "—"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(order as any).items?.length} iten(s) ·{" "}
                        {formatCurrency(order.total / 100)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeliver(order._id)}
                      className="flex items-center gap-1.5 bg-green-500 text-white text-sm px-3 py-1.5 rounded-lg"
                    >
                      <CheckCircleIcon className="w-4 h-4" />
                      Entregue
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {waitingTables.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <CreditCardIcon className="w-5 h-5 text-amber-600" />
                <span className="font-medium text-amber-800">
                  {waitingTables.length} mesa{waitingTables.length > 1 ? "s" : ""} aguardando pagamento
                </span>
              </div>
              <div className="space-y-2">
                {waitingTables.map((table) => (
                  <div
                    key={table._id}
                    className="flex items-center justify-between bg-white rounded-lg p-3"
                  >
                    <p className="font-medium text-gray-800">Mesa {table.number}</p>
                    <button
                      onClick={() => {
                        setSelectedTable(table);
                        setPaymentModal(true);
                      }}
                      className="flex items-center gap-1.5 bg-amber-500 text-white text-sm px-3 py-1.5 rounded-lg"
                    >
                      <CreditCardIcon className="w-4 h-4" />
                      Receber pagamento
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Grid de mesas */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <h2 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
          <TableIcon className="w-5 h-5 text-gray-400" />
          Todas as mesas
        </h2>
        {tables && tables.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {tables.map((table) => {
              const tableOrders = activeOrders?.filter(
                (o) => (o as any).table?._id === table._id
              );
              return (
                <TableCardWaiter
                  key={table._id}
                  table={table}
                  orderCount={tableOrders?.length ?? 0}
                  onPay={() => {
                    setSelectedTable(table);
                    setPaymentModal(true);
                  }}
                />
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">
            Nenhuma mesa cadastrada.
          </p>
        )}
      </div>

      {/* Modal de pagamento */}
      {paymentModal && selectedTable && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h2 className="font-semibold text-lg mb-1">Registrar pagamento</h2>
            <p className="text-sm text-gray-500 mb-4">
              Mesa {selectedTable.number}
            </p>

            <p className="text-sm font-medium text-gray-700 mb-2">
              Forma de pagamento
            </p>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setPaymentMethod(m.value)}
                  className={`p-3 rounded-xl border text-sm font-medium flex items-center gap-2 transition-colors ${
                    paymentMethod === m.value
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  <span>{m.emoji}</span>
                  {m.label}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPaymentModal(false)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handlePay}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-medium"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TableCardWaiter({
  table,
  orderCount,
  onPay,
}: {
  table: any;
  orderCount: number;
  onPay: () => void;
}) {
  const configs: Record<string, { bg: string; text: string; label: string }> = {
    FREE: { bg: "bg-green-50 border-green-200", text: "text-green-600", label: "Livre" },
    OCCUPIED: { bg: "bg-red-50 border-red-200", text: "text-red-500", label: "Ocupada" },
    WAITING_PAYMENT: { bg: "bg-amber-50 border-amber-200", text: "text-amber-600", label: "Aguardando" },
    RESERVED: { bg: "bg-gray-50 border-gray-200", text: "text-gray-400", label: "Reservada" },
  };
  const c = configs[table.status];

  return (
    <div className={`border rounded-xl p-3 ${c.bg}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-gray-800">Mesa {table.number}</span>
        <span className={`text-xs font-medium ${c.text}`}>{c.label}</span>
      </div>
      {orderCount > 0 && (
        <p className="text-xs text-gray-500 mb-2">
          {orderCount} pedido{orderCount > 1 ? "s" : ""} ativo{orderCount > 1 ? "s" : ""}
        </p>
      )}
      {table.status === "WAITING_PAYMENT" && (
        <button
          onClick={onPay}
          className="w-full text-xs bg-amber-500 text-white py-1.5 rounded-lg font-medium mt-1"
        >
          Pagar
        </button>
      )}
    </div>
  );
}
