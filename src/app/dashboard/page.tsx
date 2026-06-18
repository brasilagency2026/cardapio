"use client";

import { Suspense } from "react";
import { useQuery } from "convex/react";
import { useOrganization } from "@clerk/nextjs";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { formatCurrency } from "@/lib/utils";
import { PlanUpdater } from "@/components/dashboard/plan-updater";
import {
  TableIcon,
  ShoppingBagIcon,
  TrendingUpIcon,
  UsersIcon,
  ClockIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ChefHatIcon,
  QrCodeIcon,
  ExternalLinkIcon,
} from "lucide-react";
import { TableStatusBadge } from "@/components/shared/table-status-badge";
import { OrderStatusBadge } from "@/components/shared/order-status-badge";

export default function DashboardPage() {
  const { organization } = useOrganization();

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

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const dailyReport = useQuery(
    api.orders.dailyReport,
    restaurant?._id
      ? { restaurantId: restaurant._id, date: todayStart.getTime() }
      : "skip"
  );

  const occupiedTables = tables?.filter((t) => t.status === "OCCUPIED") ?? [];
  const waitingTables = tables?.filter((t) => t.status === "WAITING_PAYMENT") ?? [];
  const freeTables = tables?.filter((t) => t.status === "FREE") ?? [];

  const pendingOrders = activeOrders?.filter((o) => o.status === "PENDING") ?? [];
  const readyOrders = activeOrders?.filter((o) => o.status === "READY") ?? [];

  const isDigitalOnly = restaurant?.plan === "DIGITAL_MENU";
  const publicMenuUrl = restaurant ? `https://cardapio.foodpronto.com.br/${restaurant.slug}` : "#";

  return (
    <>
      {/* Handle plan updates from URL parameter */}
      <Suspense fallback={null}>
        <PlanUpdater restaurantId={restaurant?._id} currentPlan={restaurant?.plan} />
      </Suspense>

      {isDigitalOnly ? (
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Olá, {restaurant?.name ?? "Restaurante"} 👋
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Seu cardápio digital está pronto para encantar seus clientes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {/* Card Link do Cardápio */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col items-start">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
              <ExternalLinkIcon className="w-7 h-7 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Seu Link Exclusivo</h2>
            <p className="text-gray-500 mb-6">
              Este é o endereço do seu cardápio. Coloque-o na sua bio do Instagram e envie aos seus clientes.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 w-full flex items-center justify-between mb-4">
              <span className="text-gray-900 font-medium truncate mr-4">
                {publicMenuUrl}
              </span>
            </div>
            <a
              href={publicMenuUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-red-500 text-white px-6 py-3 rounded-full font-medium hover:bg-red-600 transition-colors w-full text-center"
            >
              Acessar meu Cardápio
            </a>
          </div>

          {/* Card QR Code */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col items-start">
            <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
              <QrCodeIcon className="w-7 h-7 text-orange-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">QR Code para as Mesas</h2>
            <p className="text-gray-500 mb-6">
              Imprima e coloque nas mesas. Seus clientes acessarão o cardápio apenas apontando a câmera do celular.
            </p>
            <Link
              href="/dashboard/settings"
              className="bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-full font-medium hover:border-orange-500 hover:text-orange-500 transition-colors w-full text-center mt-auto"
            >
              Baixar QR Code
            </Link>
          </div>
        </div>
      </div>
    ) : (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-medium text-gray-900">
            Bom dia, {restaurant?.name ?? "Restaurante"} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
        </p>
      </div>

      {/* Alertas urgentes */}
      {(pendingOrders.length > 0 || readyOrders.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingOrders.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <ChefHatIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-blue-900">
                  {pendingOrders.length} pedido{pendingOrders.length > 1 ? "s" : ""} aguardando cozinha
                </p>
                <p className="text-sm text-blue-600">Acesse o painel da cozinha</p>
              </div>
            </div>
          )}
          {readyOrders.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-green-900">
                  {readyOrders.length} pedido{readyOrders.length > 1 ? "s" : ""} prontos para entrega
                </p>
                <p className="text-sm text-green-600">Acesse o painel do garçom</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<TrendingUpIcon className="w-5 h-5 text-red-500" />}
          label="Receita hoje"
          value={formatCurrency(dailyReport?.total ?? 0)}
          bg="bg-red-50"
        />
        <MetricCard
          icon={<ShoppingBagIcon className="w-5 h-5 text-blue-500" />}
          label="Pedidos hoje"
          value={String(dailyReport?.count ?? 0)}
          bg="bg-blue-50"
        />
        <MetricCard
          icon={<TrendingUpIcon className="w-5 h-5 text-purple-500" />}
          label="Ticket médio"
          value={formatCurrency(dailyReport?.ticketMedio ?? 0)}
          bg="bg-purple-50"
        />
        <MetricCard
          icon={<TableIcon className="w-5 h-5 text-green-500" />}
          label="Mesas ocupadas"
          value={`${occupiedTables.length + waitingTables.length}/${tables?.length ?? 0}`}
          bg="bg-green-50"
        />
      </div>

      {/* Mesas */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium text-gray-900">Mesas</h2>
          <div className="flex gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" />
              Livre ({freeTables.length})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
              Ocupada ({occupiedTables.length})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              Aguardando ({waitingTables.length})
            </span>
          </div>
        </div>
        {tables && tables.length > 0 ? (
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
            {tables.map((table) => (
              <TableCard key={table._id} table={table} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">
            Nenhuma mesa cadastrada ainda.
          </p>
        )}
      </div>

      {/* Pedidos ativos */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <h2 className="font-medium text-gray-900 mb-4">Pedidos em andamento</h2>
        {activeOrders && activeOrders.length > 0 ? (
          <div className="space-y-3">
            {activeOrders.slice(0, 8).map((order) => (
              <div
                key={order._id}
                className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-medium text-gray-600">
                    {(order as any).table?.number ?? "?"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Mesa {(order as any).table?.number ?? "—"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {(order as any).items?.length ?? 0} iten(s) ·{" "}
                      {formatCurrency(order.total)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <ClockIcon className="w-3 h-3" />
                    {Math.floor((Date.now() - order.createdAt) / 60000)} min
                  </span>
                  <OrderStatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">
            Nenhum pedido em andamento.
          </p>
        )}
      </div>
    </div>
    )}
    </>
  );
}

// ─── Sub-componentes ──────────────────────────────────────────────

function MetricCard({
  icon,
  label,
  value,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  bg: string;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4">
      <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

function TableCard({ table }: { table: any }) {
  const colorMap: Record<string, string> = {
    FREE: "border-green-200 bg-green-50",
    OCCUPIED: "border-red-200 bg-red-50",
    WAITING_PAYMENT: "border-amber-200 bg-amber-50",
    RESERVED: "border-gray-200 bg-gray-50",
  };

  const iconColorMap: Record<string, string> = {
    FREE: "text-green-500",
    OCCUPIED: "text-red-500",
    WAITING_PAYMENT: "text-amber-500",
    RESERVED: "text-gray-400",
  };

  return (
    <div
      className={`aspect-square rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-transform hover:scale-105 ${colorMap[table.status]}`}
    >
      <TableIcon className={`w-5 h-5 ${iconColorMap[table.status]}`} />
      <span className="text-xs font-medium text-gray-700">{table.number}</span>
    </div>
  );
}
