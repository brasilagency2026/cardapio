"use client";

import Link from "next/link";
import { useOrganization } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function DashboardSettingsPage() {
  const { organization } = useOrganization();

  const restaurant = useQuery(
    api.restaurants.getByClerkOrg,
    organization?.id ? { clerkOrgId: organization.id } : "skip"
  );

  const publicMenuUrl = restaurant
    ? `https://cardapio.foodpronto.com.br/${restaurant.slug}`
    : "#";

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Configurações</h1>
            <p className="text-sm text-gray-500 mt-2">
              Acompanhe seu restaurante, plano e link público. Em breve você poderá editar mais configurações.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-red-600 font-medium hover:text-red-700"
          >
            Voltar ao dashboard
          </Link>
        </div>

        <div className="grid gap-5">
          <section className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Informações do restaurante</h2>
            {restaurant ? (
              <div className="space-y-4 text-sm text-gray-700">
                <div>
                  <p className="font-medium text-gray-900">Nome</p>
                  <p>{restaurant.name}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Slug</p>
                  <p>{restaurant.slug}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Plano atual</p>
                  <p>{restaurant.plan ?? "Não definido"}</p>
                </div>
              </div>
            ) : (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-1/5" />
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Link público</h2>
                <p className="text-sm text-gray-500">
                  Os clientes acessam o seu cardápio através deste endereço.
                </p>
              </div>
              <Link
                href={publicMenuUrl}
                target="_blank"
                className="text-sm text-red-600 font-medium hover:text-red-700"
              >
                Abrir link
              </Link>
            </div>
            <div className="rounded-2xl bg-white border border-gray-200 p-4 text-sm text-gray-700 break-words">
              {publicMenuUrl}
            </div>
          </section>

          <section className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">QR Code</h2>
            <p className="text-sm text-gray-500 mb-4">
              Use este QR Code nas mesas para que os clientes acessem o cardápio direto do celular.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <p className="text-sm font-medium text-gray-900 mb-2">QR Code</p>
                <div className="h-40 w-full rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
                  Em breve
                </div>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <p className="text-sm font-medium text-gray-900 mb-2">Ações</p>
                <div className="space-y-3">
                  <button className="w-full rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-colors">
                    Gerar QR Code
                  </button>
                  <button className="w-full rounded-full bg-red-500 px-4 py-3 text-sm font-medium text-white hover:bg-red-600 transition-colors">
                    Baixar QR Code
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
