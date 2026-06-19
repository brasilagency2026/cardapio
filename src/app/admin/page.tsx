"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import {
  BuildingIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon,
  XCircleIcon,
  TrendingUpIcon,
} from "lucide-react";

export default function AdminPage() {
  const restaurants = useQuery(api.restaurants.adminListAll);

  if (!restaurants) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-neutral-800 rounded w-48" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-neutral-800 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const total = restaurants.length;
  const active = restaurants.filter((r) => r.planStatus === "ACTIVE").length;
  const trial = restaurants.filter((r) => r.planStatus === "TRIAL").length;
  const pastDue = restaurants.filter((r) => r.planStatus === "PAST_DUE").length;
  const cancelled = restaurants.filter((r) => r.planStatus === "CANCELLED").length;
  const smart = restaurants.filter((r) => r.plan === "RESTAURANT_SMART").length;
  const digital = restaurants.filter((r) => r.plan === "DIGITAL_MENU").length;

  const mrr = active * (restaurants.filter((r) => r.planStatus === "ACTIVE" && r.plan === "RESTAURANT_SMART").length * 89 +
    restaurants.filter((r) => r.planStatus === "ACTIVE" && r.plan === "DIGITAL_MENU").length * 40);

  const mrrValue =
    restaurants.filter((r) => r.planStatus === "ACTIVE" && r.plan === "RESTAURANT_SMART").length * 89 +
    restaurants.filter((r) => r.planStatus === "ACTIVE" && r.plan === "DIGITAL_MENU").length * 40;

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Visão Geral</h1>
        <p className="text-neutral-500 text-sm mt-1">Painel de controle — Foodpronto</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={<BuildingIcon className="w-5 h-5 text-blue-400" />}
          label="Total de restaurantes"
          value={String(total)}
          bg="bg-blue-400/10"
        />
        <KpiCard
          icon={<TrendingUpIcon className="w-5 h-5 text-green-400" />}
          label="MRR estimado"
          value={`R$ ${mrrValue.toLocaleString("pt-BR")}`}
          bg="bg-green-400/10"
        />
        <KpiCard
          icon={<CheckCircleIcon className="w-5 h-5 text-green-400" />}
          label="Assinaturas ativas"
          value={String(active)}
          bg="bg-green-400/10"
        />
        <KpiCard
          icon={<ClockIcon className="w-5 h-5 text-blue-400" />}
          label="Em período trial"
          value={String(trial)}
          bg="bg-blue-400/10"
        />
      </div>

      {/* Status breakdown */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Ativos", count: active, color: "text-green-400", icon: <CheckCircleIcon className="w-4 h-4" /> },
          { label: "Trial", count: trial, color: "text-blue-400", icon: <ClockIcon className="w-4 h-4" /> },
          { label: "Em atraso", count: pastDue, color: "text-amber-400", icon: <AlertCircleIcon className="w-4 h-4" /> },
          { label: "Cancelados", count: cancelled, color: "text-red-400", icon: <XCircleIcon className="w-4 h-4" /> },
        ].map((s) => (
          <div key={s.label} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex items-center gap-3">
            <span className={s.color}>{s.icon}</span>
            <div>
              <p className="text-white font-bold text-xl">{s.count}</p>
              <p className="text-neutral-500 text-xs">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Planos */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
          <p className="text-neutral-500 text-xs mb-1">Cardápio Digital (R$40)</p>
          <p className="text-white text-2xl font-bold">{digital}</p>
          <p className="text-neutral-600 text-xs mt-1">restaurantes</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
          <p className="text-neutral-500 text-xs mb-1">Gestão Completa (R$89)</p>
          <p className="text-white text-2xl font-bold">{smart}</p>
          <p className="text-neutral-600 text-xs mt-1">restaurantes</p>
        </div>
      </div>

      {/* Atalhos */}
      <div className="flex gap-3">
        <Link
          href="/admin/restaurantes"
          className="flex items-center gap-2 bg-[#E24B4A] hover:bg-[#c93f3e] text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors"
        >
          <BuildingIcon className="w-4 h-4" />
          Ver todos os restaurantes
        </Link>
        <Link
          href="/admin/assinaturas"
          className="flex items-center gap-2 border border-neutral-700 hover:border-neutral-500 text-neutral-300 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors"
        >
          <CreditCardIcon className="w-4 h-4" />
          Gerenciar assinaturas
        </Link>
      </div>
    </div>
  );
}

function KpiCard({ icon, label, value, bg }: { icon: React.ReactNode; label: string; value: string; bg: string }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
      <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-white text-2xl font-bold">{value}</p>
      <p className="text-neutral-500 text-xs mt-0.5">{label}</p>
    </div>
  );
}
