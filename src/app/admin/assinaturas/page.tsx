"use client";

import { useEffect, useState } from "react";
import { format, differenceInDays } from "date-fns";
import { toast } from "sonner";
import { CheckCircleIcon, ClockIcon, AlertCircleIcon, XCircleIcon, RefreshCwIcon } from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  ACTIVE:    { label: "Ativo",     color: "text-green-400", bg: "bg-green-400/10 border-green-400/20",   dot: "bg-green-400" },
  TRIAL:     { label: "Trial",     color: "text-blue-400",  bg: "bg-blue-400/10 border-blue-400/20",     dot: "bg-blue-400"  },
  PAST_DUE:  { label: "Atraso",    color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20",   dot: "bg-amber-400" },
  CANCELLED: { label: "Cancelado", color: "text-red-400",   bg: "bg-red-400/10 border-red-400/20",       dot: "bg-red-400"   },
};

const PLAN_LABELS: Record<string, string> = {
  DIGITAL_MENU: "Cardápio Digital · R$40",
  RESTAURANT_SMART: "Gestão Completa · R$89",
};

type Restaurant = any;

export default function AdminAssinaturasPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [saving, setSaving] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/restaurants");
    const data = await res.json();
    setRestaurants(data.value ?? data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleStatusChange(id: string, newStatus: string) {
    setSaving(id);
    try {
      const res = await fetch("/api/admin/restaurants", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          planStatus: newStatus,
          ...(newStatus === "ACTIVE" ? { nextBillingDate: Date.now() + 30 * 24 * 60 * 60 * 1000 } : {}),
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast.success(`Status: ${STATUS_CONFIG[newStatus]?.label}`);
      load();
    } catch (e: any) {
      toast.error(e.message ?? "Erro");
    } finally {
      setSaving(null);
    }
  }

  const filtered = restaurants.filter(r => filter === "ALL" || r.planStatus === filter);

  const counts = {
    ALL: restaurants.length,
    ACTIVE:    restaurants.filter(r => r.planStatus === "ACTIVE").length,
    TRIAL:     restaurants.filter(r => r.planStatus === "TRIAL").length,
    PAST_DUE:  restaurants.filter(r => r.planStatus === "PAST_DUE").length,
    CANCELLED: restaurants.filter(r => r.planStatus === "CANCELLED").length,
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Assinaturas</h1>
        <p className="text-neutral-500 text-sm mt-1">Gerencie os planos de todos os clientes</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[
          { key: "ALL", label: "Todos" },
          { key: "ACTIVE", label: "Ativos" },
          { key: "TRIAL", label: "Trial" },
          { key: "PAST_DUE", label: "Em atraso" },
          { key: "CANCELLED", label: "Cancelados" },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === f.key ? "bg-[#E24B4A] text-white" : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"}`}
          >
            {f.label} <span className="ml-1 text-xs opacity-70">{counts[f.key as keyof typeof counts]}</span>
          </button>
        ))}
      </div>

      {loading && <div className="text-center py-12 text-neutral-600">Carregando...</div>}

      <div className="space-y-3">
        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 text-neutral-600">Nenhum resultado.</div>
        )}
        {filtered.map(r => {
          const sc = STATUS_CONFIG[r.planStatus] ?? STATUS_CONFIG.TRIAL;
          const dateToShow = r.nextBillingDate ?? r.trialEndsAt;
          const daysLeft = dateToShow ? differenceInDays(new Date(dateToShow), new Date()) : null;
          const isUrgent = daysLeft !== null && daysLeft <= 3 && r.planStatus === "TRIAL";

          return (
            <div key={r._id} className={`bg-neutral-900 border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 ${isUrgent ? "border-amber-500/40" : "border-neutral-800"}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-white font-semibold">{r.name}</p>
                  {isUrgent && <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">Expira em {daysLeft}d</span>}
                </div>
                <p className="text-neutral-500 text-xs">{r.city} – {r.state} · /{r.slug}</p>
                <p className="text-neutral-400 text-xs mt-1">{PLAN_LABELS[r.plan]}</p>
              </div>

              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${sc.bg} ${sc.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                {sc.label}
                {dateToShow && <span className="ml-1 opacity-70">· {format(new Date(dateToShow), "dd/MM/yy")}</span>}
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={r.planStatus}
                  onChange={e => handleStatusChange(r._id, e.target.value)}
                  disabled={saving === r._id}
                  className="bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs rounded-xl px-3 py-2 outline-none disabled:opacity-50"
                >
                  <option value="TRIAL">Trial</option>
                  <option value="ACTIVE">Ativo</option>
                  <option value="PAST_DUE">Em atraso</option>
                  <option value="CANCELLED">Cancelado</option>
                </select>
                {saving === r._id && <RefreshCwIcon className="w-4 h-4 text-neutral-500 animate-spin" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
