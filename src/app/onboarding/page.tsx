"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOrganizationList, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2, Utensils } from "lucide-react";

const ESTADOS_BR = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
];

function sanitizeSlug(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function OnboardingPage() {
  const router = useRouter();
  const { isLoaded: isUserLoaded, user } = useUser();
  const { createOrganization, setActive, userMemberships } = useOrganizationList({
    userMemberships: { infinite: true },
  });
  const createRestaurant = useMutation(api.restaurants.create);

  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Verifica se já existe uma org para o usuário
  const existingOrg = userMemberships?.data?.[0]?.organization ?? null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !state || !city) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (!setActive) {
        throw new Error("Erro interno do Clerk. Tente novamente.");
      }

      let orgId: string;

      if (existingOrg) {
        // Reusar organização existente
        orgId = existingOrg.id;
        await setActive({ organization: orgId });
      } else {
        // Criar nova organização
        if (!createOrganization) throw new Error("Erro interno do Clerk.");
        const organization = await createOrganization({ name });
        orgId = organization.id;
        await setActive({ organization: orgId });
      }

      // 2. Gerar Slug SEO
      const slug = `${state.toLowerCase()}-${sanitizeSlug(city)}-${sanitizeSlug(name)}`;

      // 3. Salvar no Convex
      await createRestaurant({
        clerkOrgId: orgId,
        name,
        slug,
        city,
        state,
        plan: "DIGITAL_MENU",
      });

      // 4. Redirecionar para escolha de planos
      router.push("/planos");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocorreu um erro ao criar seu restaurante.");
      setLoading(false);
    }
  };

  if (!isUserLoaded) return null;

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-neutral-100">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#E24B4A]/10 rounded-2xl flex items-center justify-center text-[#E24B4A]">
            <Utensils size={32} />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-neutral-900 mb-2">
          Bem-vindo ao Foodpronto!
        </h1>
        <p className="text-neutral-500 text-center mb-8">
          Para começarmos, precisamos de alguns dados sobre o seu restaurante.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        {existingOrg && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-xl mb-6 text-sm">
            ℹ️ Conta Clerk detectada: <strong>{existingOrg.name}</strong>. O restaurante será vinculado a esta organização.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Nome do Restaurante
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#E24B4A]/50 focus:border-[#E24B4A] transition-all"
              placeholder="Ex: Pizzaria do Mario"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Estado (UF)
              </label>
              <select
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#E24B4A]/50 focus:border-[#E24B4A] bg-white transition-all appearance-none"
              >
                <option value="" disabled>Selecione</option>
                {ESTADOS_BR.map((uf) => (
                  <option key={uf.value} value={uf.value}>
                    {uf.value} - {uf.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Cidade
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#E24B4A]/50 focus:border-[#E24B4A] transition-all"
                placeholder="Ex: São Paulo"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E24B4A] text-white py-4 rounded-full font-bold hover:bg-[#c93f3e] transition-all shadow-lg hover:shadow-[#E24B4A]/30 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Criando seu cardápio...
                </>
              ) : (
                "Continuar"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
