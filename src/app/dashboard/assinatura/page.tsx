"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { useOrganization, useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import {
  CreditCardIcon,
  CalendarIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ClockIcon,
  XCircleIcon,
  ExternalLinkIcon,
  RefreshCwIcon,
  ChefHatIcon,
  QrCodeIcon,
  ArrowRightIcon,
} from "lucide-react";

const PLAN_LABELS: Record<string, string> = {
  DIGITAL_MENU: "Cardápio Digital",
  RESTAURANT_SMART: "Gestão Completa",
};

const PLAN_PRICES: Record<string, number> = {
  DIGITAL_MENU: 40,
  RESTAURANT_SMART: 89,
};

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  TRIAL: {
    label: "Período de teste",
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
    icon: <ClockIcon className="w-4 h-4" />,
  },
  ACTIVE: {
    label: "Ativo",
    color: "text-green-600",
    bg: "bg-green-50 border-green-200",
    icon: <CheckCircleIcon className="w-4 h-4" />,
  },
  PAST_DUE: {
    label: "Pagamento em atraso",
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
    icon: <AlertCircleIcon className="w-4 h-4" />,
  },
  CANCELLED: {
    label: "Cancelado",
    color: "text-red-600",
    bg: "bg-red-50 border-red-200",
    icon: <XCircleIcon className="w-4 h-4" />,
  },
};

export default function AssinaturaPage() {
  const { organization } = useOrganization();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const restaurant = useQuery(
    api.restaurants.getByClerkOrg,
    organization?.id ? { clerkOrgId: organization.id } : "skip"
  );

  const planStatus = restaurant?.planStatus ?? "TRIAL";
  const statusCfg = STATUS_CONFIG[planStatus] ?? STATUS_CONFIG.TRIAL;

  // Datas relevantes
  const trialEndsAt = restaurant?.trialEndsAt;
  const nextBillingDate = restaurant?.nextBillingDate;
  const displayDate = nextBillingDate ?? trialEndsAt;

  const daysLeft = displayDate
    ? differenceInDays(new Date(displayDate), new Date())
    : null;

  const isTrialing = planStatus === "TRIAL";
  const isActive = planStatus === "ACTIVE";
  const isPastDue = planStatus === "PAST_DUE";
  const isCancelled = planStatus === "CANCELLED";

  // Mostrar botão de pagamento se: trial, atrasado ou cancelado
  const showPayButton = isTrialing || isPastDue || isCancelled;

  async function handleSubscribe() {
    if (!restaurant?._id || !user) return;

    const email =
      user.emailAddresses?.[0]?.emailAddress ?? "";

    if (!email) {
      toast.error("E-mail do usuário não encontrado");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/subscription/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: restaurant.plan,
          restaurantId: restaurant._id,
          payerEmail: email,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.init_point) {
        toast.error(data.error ?? "Erro ao gerar link de pagamento");
        return;
      }

      // Redirecionar para o Mercado Pago
      window.location.href = data.init_point;
    } catch {
      toast.error("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (!restaurant) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4 max-w-2xl">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-40 bg-gray-100 rounded-2xl" />
          <div className="h-24 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Meu Plano</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gerencie sua assinatura do Foodpronto
        </p>
      </div>

      {/* Card principal do plano */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
        {/* Banner de status */}
        <div
          className={`px-6 py-3 border-b flex items-center gap-2 ${statusCfg.bg}`}
        >
          <span className={statusCfg.color}>{statusCfg.icon}</span>
          <span className={`text-sm font-medium ${statusCfg.color}`}>
            {statusCfg.label}
          </span>
          {isTrialing && daysLeft !== null && daysLeft >= 0 && (
            <span className="text-sm text-blue-500 ml-1">
              — {daysLeft} dia{daysLeft !== 1 ? "s" : ""} restante{daysLeft !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="p-6">
          {/* Plano + preço */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
                {restaurant.plan === "RESTAURANT_SMART" ? (
                  <ChefHatIcon className="w-7 h-7 text-red-500" />
                ) : (
                  <QrCodeIcon className="w-7 h-7 text-red-500" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {PLAN_LABELS[restaurant.plan]}
                </h2>
                <p className="text-sm text-gray-500">Cobrança mensal recorrente</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-extrabold text-gray-900">
                R$ {PLAN_PRICES[restaurant.plan]}
              </p>
              <p className="text-xs text-gray-400">/mês</p>
            </div>
          </div>

          {/* Informações de datas */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {displayDate && (
              <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 bg-white border border-gray-200 rounded-xl flex items-center justify-center">
                  <CalendarIcon className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">
                    {isActive ? "Próxima cobrança" : isTrialing ? "Fim do período grátis" : "Data de referência"}
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {format(new Date(displayDate), "dd 'de' MMMM 'de' yyyy", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
              </div>
            )}

            {restaurant.mpSubscriptionId && (
              <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 bg-white border border-gray-200 rounded-xl flex items-center justify-center">
                  <CreditCardIcon className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">ID da assinatura</p>
                  <p className="text-sm font-mono text-gray-700 truncate max-w-[160px]">
                    {restaurant.mpSubscriptionId}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Alerta urgente se trial acabando */}
          {isTrialing && daysLeft !== null && daysLeft <= 7 && daysLeft >= 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5 flex items-start gap-3">
              <AlertCircleIcon className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800">
                  Seu período gratuito acaba em {daysLeft} dia{daysLeft !== 1 ? "s" : ""}
                </p>
                <p className="text-xs text-amber-600 mt-0.5">
                  Ative sua assinatura agora para não perder o acesso à plataforma.
                </p>
              </div>
            </div>
          )}

          {/* Alerta se trial expirou */}
          {isTrialing && daysLeft !== null && daysLeft < 0 && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-5 flex items-start gap-3">
              <XCircleIcon className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-800">
                  Período de teste encerrado
                </p>
                <p className="text-xs text-red-600 mt-0.5">
                  Ative sua assinatura para continuar usando a plataforma.
                </p>
              </div>
            </div>
          )}

          {/* Alerta pagamento em atraso */}
          {isPastDue && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5 flex items-start gap-3">
              <AlertCircleIcon className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800">
                  Pagamento em atraso
                </p>
                <p className="text-xs text-amber-600 mt-0.5">
                  Regularize sua assinatura para manter o acesso completo.
                </p>
              </div>
            </div>
          )}

          {/* Botão principal */}
          {showPayButton && (
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#009EE3] hover:bg-[#0080CC] text-white font-semibold py-4 rounded-2xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <RefreshCwIcon className="w-5 h-5 animate-spin" />
              ) : (
                <CreditCardIcon className="w-5 h-5" />
              )}
              {loading
                ? "Gerando link de pagamento..."
                : isTrialing
                ? "Ativar assinatura via Mercado Pago"
                : "Regularizar assinatura via Mercado Pago"}
              {!loading && <ExternalLinkIcon className="w-4 h-4 ml-1" />}
            </button>
          )}

          {isActive && (
            <div className="flex items-center justify-center gap-2 text-green-600 font-medium text-sm py-3">
              <CheckCircleIcon className="w-5 h-5" />
              Assinatura ativa — próxima cobrança automática pelo Mercado Pago
            </div>
          )}

          {isCancelled && (
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-700 text-white font-semibold py-4 rounded-2xl transition-colors disabled:opacity-60"
            >
              <RefreshCwIcon className="w-5 h-5" />
              Reativar assinatura
            </button>
          )}
        </div>
      </div>

      {/* O que está incluído */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Incluso no seu plano</h3>
        {restaurant.plan === "DIGITAL_MENU" ? (
          <ul className="space-y-2">
            {[
              "Cardápio acessível via QR Code, NFC e link direto",
              "Edição de produtos e preços em tempo real",
              "Design responsivo para celular",
              "Link personalizado do restaurante",
              "Upload de fotos dos pratos",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircleIcon className="w-4 h-4 text-green-500 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <ul className="space-y-2">
            {[
              "Tudo do plano Cardápio Digital",
              "Pedidos pelo celular direto na mesa",
              "Gestão de mesas e comandas digitais",
              "Painel KDS em tempo real para a cozinha",
              "Painel do garçom: entregas e pagamentos",
              "Relatórios de vendas e controle de caixa",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircleIcon className="w-4 h-4 text-green-500 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        )}

        {restaurant.plan === "DIGITAL_MENU" && (
          <div className="mt-5 pt-5 border-t border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Quer mais recursos?</p>
              <p className="text-xs text-gray-400">Upgrade para Gestão Completa por R$ 89/mês</p>
            </div>
            <a
              href="/planos"
              className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
            >
              Ver planos
              <ArrowRightIcon className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>

      {/* Info pagamento */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-sm text-gray-500 flex items-start gap-3">
        <CreditCardIcon className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
        <p>
          Os pagamentos são processados de forma segura pelo{" "}
          <strong className="text-gray-700">Mercado Pago</strong>. Você será redirecionado
          para a plataforma deles ao clicar em ativar. Aceita PIX, cartão de crédito e débito.
          Nenhuma maquininha necessária.
        </p>
      </div>
    </div>
  );
}
