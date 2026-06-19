"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import {
  SearchIcon, EditIcon, TrashIcon, ExternalLinkIcon, XIcon, SaveIcon,
} from "lucide-react";

const PLAN_LABELS: Record<string, string> = {
  DIGITAL_MENU: "Cardápio Digital",
  RESTAURANT_SMART: "Gestão Completa",
};

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  ACTIVE:    { label: "Ativo",     color: "text-green-400", dot: "bg-green-400" },
  TRIAL:     { label: "Trial",     color: "text-blue-400",  dot: "bg-blue-400"  },
  PAST_DUE:  { label: "Atraso",    color: "text-amber-400", dot: "bg-amber-400" },
  CANCELLED: { label: "Cancelado", color: "text-red-400",   dot: "bg-red-400"   },
};

type Restaurant = any;

export default function AdminRestaurantesPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/restaurants");
    const data = await res.json();
    setRestaurants(data.value ?? data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const filtered = restaurants.filter(r =>
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.slug?.toLowerCase().includes(search.toLowerCase()) ||
    r.city?.toLowerCase().includes(search.toLowerCase())
  );

  function openEdit(r: Restaurant) {
    setEditingId(r._id);
    setEditForm({
      plan: r.plan,
      planStatus: r.planStatus,
      mpSubscriptionId: r.mpSubscriptionId ?? "",
      trialEndsAt: r.trialEndsAt ? format(new Date(r.trialEndsAt), "yyyy-MM-dd") : "",
      nextBillingDate: r.nextBillingDate ? format(new Date(r.nextBillingDate), "yyyy-MM-dd") : "",
      active: r.active,
    });
  }

  async function handleSave() {
    if (!editingId) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/restaurants", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          plan: editForm.plan,
          planStatus: editForm.planStatus,
          mpSubscriptionId: editForm.mpSubscriptionId || undefined,
          trialEndsAt: editForm.trialEndsAt ? new Date(editForm.trialEndsAt).getTime() : undefined,
          nextBillingDate: editForm.nextBillingDate ? new Date(editForm.nextBillingDate).getTime() : undefined,
          active: editForm.active,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast.success("Restaurante atualizado!");
      setEditingId(null);
      load();
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch("/api/admin/restaurants", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast.success("Restaurante removido.");
      setConfirmDelete(null);
      load();
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao deletar");
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Restaurantes</h1>
          <p className="text-neutral-500 text-sm mt-1">{restaurants.length} cadastrados</p>
        </div>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-neutral-800 border border-neutral-700 text-neutral-200 text-sm rounded-xl pl-9 pr-4 py-2 outline-none focus:border-neutral-500 w-56"
          />
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800 text-neutral-500 text-xs">
              <th className="px-5 py-3 text-left font-medium">Restaurante</th>
              <th className="px-4 py-3 text-left font-medium">Plano</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Data</th>
              <th className="px-4 py-3 text-right font-medium">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {loading && (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-neutral-600">Carregando...</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-neutral-600">Nenhum restaurante.</td></tr>
            )}
            {filtered.map(r => {
              const sc = STATUS_CONFIG[r.planStatus] ?? STATUS_CONFIG.TRIAL;
              const dateToShow = r.nextBillingDate ?? r.trialEndsAt;
              return (
                <tr key={r._id} className="hover:bg-neutral-800/40 transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-white font-medium">{r.name}</p>
                    <p className="text-neutral-500 text-xs">{r.city} – {r.state}</p>
                    <a
                      href={`https://cardapio.foodpronto.com.br/${r.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#E24B4A] hover:underline flex items-center gap-0.5 mt-0.5"
                    >
                      /{r.slug}<ExternalLinkIcon className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="px-4 py-4 text-neutral-300 text-xs">{PLAN_LABELS[r.plan]}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                      <span className={`text-xs ${sc.color}`}>{sc.label}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-neutral-400 text-xs">
                    {dateToShow ? format(new Date(dateToShow), "dd/MM/yyyy", { locale: ptBR }) : "—"}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(r)}
                        className="w-8 h-8 bg-neutral-800 hover:bg-neutral-700 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <EditIcon className="w-3.5 h-3.5 text-neutral-400" />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(r._id)}
                        className="w-8 h-8 bg-red-500/10 hover:bg-red-500/20 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <TrashIcon className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal édition */}
      {editingId && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-3xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-white font-bold text-lg">Editar assinatura</h2>
              <button onClick={() => setEditingId(null)} className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-neutral-700">
                <XIcon className="w-4 h-4 text-neutral-400" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-neutral-400 mb-1 block">Plano</label>
                <select value={editForm.plan} onChange={e => setEditForm({...editForm, plan: e.target.value})} className="w-full bg-neutral-800 border border-neutral-700 text-neutral-200 text-sm rounded-xl px-3 py-2 outline-none">
                  <option value="DIGITAL_MENU">Cardápio Digital — R$40</option>
                  <option value="RESTAURANT_SMART">Gestão Completa — R$89</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-neutral-400 mb-1 block">Status</label>
                <select value={editForm.planStatus} onChange={e => setEditForm({...editForm, planStatus: e.target.value})} className="w-full bg-neutral-800 border border-neutral-700 text-neutral-200 text-sm rounded-xl px-3 py-2 outline-none">
                  <option value="TRIAL">Trial</option>
                  <option value="ACTIVE">Ativo</option>
                  <option value="PAST_DUE">Em atraso</option>
                  <option value="CANCELLED">Cancelado</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-neutral-400 mb-1 block">Fim do trial</label>
                <input type="date" value={editForm.trialEndsAt} onChange={e => setEditForm({...editForm, trialEndsAt: e.target.value})} className="w-full bg-neutral-800 border border-neutral-700 text-neutral-200 text-sm rounded-xl px-3 py-2 outline-none" />
              </div>
              <div>
                <label className="text-xs text-neutral-400 mb-1 block">Próxima cobrança</label>
                <input type="date" value={editForm.nextBillingDate} onChange={e => setEditForm({...editForm, nextBillingDate: e.target.value})} className="w-full bg-neutral-800 border border-neutral-700 text-neutral-200 text-sm rounded-xl px-3 py-2 outline-none" />
              </div>
              <div>
                <label className="text-xs text-neutral-400 mb-1 block">ID Mercado Pago</label>
                <input type="text" value={editForm.mpSubscriptionId} onChange={e => setEditForm({...editForm, mpSubscriptionId: e.target.value})} className="w-full bg-neutral-800 border border-neutral-700 text-neutral-200 text-sm rounded-xl px-3 py-2 outline-none font-mono" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="active" checked={editForm.active} onChange={e => setEditForm({...editForm, active: e.target.checked})} className="w-4 h-4 accent-[#E24B4A]" />
                <label htmlFor="active" className="text-sm text-neutral-300">Restaurante ativo</label>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditingId(null)} className="flex-1 py-2.5 rounded-xl border border-neutral-700 text-neutral-400 text-sm">Cancelar</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-[#E24B4A] text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
                <SaveIcon className="w-4 h-4" />{saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmar delete */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-red-500/30 rounded-3xl p-6 w-full max-w-sm text-center space-y-4">
            <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto">
              <TrashIcon className="w-7 h-7 text-red-400" />
            </div>
            <h2 className="text-white font-bold text-lg">Confirmar exclusão</h2>
            <p className="text-neutral-400 text-sm">Esta ação é irreversível.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 rounded-xl border border-neutral-700 text-neutral-400 text-sm">Cancelar</button>
              <button onClick={() => handleDelete(confirmDelete)} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold">Deletar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
