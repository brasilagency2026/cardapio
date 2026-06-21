"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { useOrganization } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { formatCurrency } from "@/lib/utils";
import {
  TrendingUpIcon,
  ShoppingBagIcon,
  BarChart3Icon,
  CalendarIcon,
  CreditCardIcon,
} from "lucide-react";

export default function ReportsPage() {
  const { organization, isLoaded: isOrgLoaded } = useOrganization();
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  const restaurant = useQuery(
    api.restaurants.getByClerkOrg,
    organization?.id ? { clerkOrgId: organization.id } : "skip"
  );

  const dailyReport = useQuery(
    api.orders.dailyReport,
    restaurant?._id
      ? { restaurantId: restaurant._id, date: selectedDate.getTime() }
      : "skip"
  );

  const dailyPayments = useQuery(
    api.orders.dailyPayments,
    restaurant?._id
      ? { restaurantId: restaurant._id, date: selectedDate.getTime() }
      : "skip"
  );

  const topItems = useQuery(
    api.orders.dailyTopItems,
    restaurant?._id
      ? { restaurantId: restaurant._id, date: selectedDate.getTime() }
      : "skip"
  );

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value + "T00:00:00");
    date.setHours(0, 0, 0, 0);
    setSelectedDate(date);
  };

  const dateString = selectedDate.toISOString().split("T")[0];
  const isToday =
    selectedDate.toDateString() === new Date().toDateString();

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
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-500 mt-2">
            Acompanhe as métricas de vendas do seu restaurante.
          </p>
        </div>
      </div>

      {/* Seletor de data */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6">
        <div className="flex items-center gap-4">
          <CalendarIcon className="w-5 h-5 text-gray-500" />
          <input
            type="date"
            value={dateString}
            onChange={handleDateChange}
            max={new Date().toISOString().split("T")[0]}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
          />
          <span className="text-sm text-gray-500">
            {isToday
              ? "Hoje"
              : selectedDate.toLocaleDateString("pt-BR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
          </span>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mb-4">
            <TrendingUpIcon className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {formatCurrency((dailyReport?.total ?? 0) / 100)}
          </p>
          <p className="text-sm text-gray-500 mt-1">Receita total</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
            <ShoppingBagIcon className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {dailyReport?.count ?? 0}
          </p>
          <p className="text-sm text-gray-500 mt-1">Pedidos realizados</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
            <BarChart3Icon className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {formatCurrency((dailyReport?.ticketMedio ?? 0) / 100)}
          </p>
          <p className="text-sm text-gray-500 mt-1">Ticket médio</p>
        </div>
      </div>

      {/* Pagamentos por método */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <CreditCardIcon className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-bold text-gray-900">Pagamentos por forma</h2>
        </div>
        {dailyPayments && dailyPayments.totalCount > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { key: "PIX",    label: "PIX",      emoji: "📲", color: "bg-cyan-50 border-cyan-200" },
                { key: "CREDIT", label: "Crédito",  emoji: "💳", color: "bg-blue-50 border-blue-200" },
                { key: "DEBIT",  label: "Débito",   emoji: "💳", color: "bg-purple-50 border-purple-200" },
                { key: "CASH",   label: "Dinheiro", emoji: "💵", color: "bg-green-50 border-green-200" },
              ].map((m) => {
                const data = dailyPayments.byMethod[m.key as keyof typeof dailyPayments.byMethod];
                return (
                  <div key={m.key} className={`border rounded-xl p-4 ${m.color}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span>{m.emoji}</span>
                      <span className="text-sm font-medium text-gray-700">{m.label}</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900">
                      {formatCurrency((data?.total ?? 0) / 100)}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {data?.count ?? 0} pagamento{(data?.count ?? 0) !== 1 ? "s" : ""}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <span className="font-semibold text-gray-700">Total recebido</span>
              <span className="font-bold text-xl text-gray-900">
                {formatCurrency(dailyPayments.totalPayments / 100)}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-4">
            Nenhum pagamento registrado neste dia.
          </p>
        )}
      </div>

      {/* Ranking des itens les plus vendus */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">🏆 Itens mais vendidos</h2>
        {topItems && topItems.length > 0 ? (
          <div className="space-y-2">
            {topItems.slice(0, 10).map((item: any, i: number) => (
              <div
                key={item.name}
                className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0"
              >
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  i === 0 ? "bg-amber-100 text-amber-700" :
                  i === 1 ? "bg-gray-200 text-gray-600" :
                  i === 2 ? "bg-orange-100 text-orange-600" :
                  "bg-gray-100 text-gray-500"
                }`}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-400">{formatCurrency(item.revenue / 100)} de receita</p>
                </div>
                <span className="text-sm font-bold text-gray-700 shrink-0">
                  {item.quantity}x
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-4">
            Nenhum item vendido neste dia.
          </p>
        )}
      </div>

      {/* Lista de pedidos do dia */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Pedidos do dia
        </h2>
        {dailyReport?.orders && dailyReport.orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-medium">Horário</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Pagamento</th>
                  <th className="pb-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {dailyReport.orders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="py-3 text-gray-700">
                      {new Date(order.createdAt).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                          order.status === "DELIVERED"
                            ? "bg-green-100 text-green-700"
                            : order.status === "CANCELLED"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {order.status === "DELIVERED"
                          ? "Entregue"
                          : order.status === "CANCELLED"
                            ? "Cancelado"
                            : order.status}
                      </span>
                    </td>
                    <td className="py-3">
                      {order.paymentMethod ? (
                        <span className="text-xs text-gray-600">
                          {order.paymentMethod === "PIX" && "📲 PIX"}
                          {order.paymentMethod === "CREDIT" && "💳 Crédito"}
                          {order.paymentMethod === "DEBIT" && "💳 Débito"}
                          {order.paymentMethod === "CASH" && "💵 Dinheiro"}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                    <td className="py-3 text-right font-medium text-gray-900">
                      {formatCurrency(order.total / 100)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BarChart3Icon className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">
              Nenhum pedido registrado nesta data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
