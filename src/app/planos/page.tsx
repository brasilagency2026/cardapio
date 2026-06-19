import Link from "next/link";
import { Check, QrCode, ClipboardList, Utensils, Smartphone, ChefHat } from "lucide-react";

export default function PlanosPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <header className="px-6 py-4 flex items-center justify-between border-b border-neutral-200 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2 text-[#E24B4A] font-bold text-xl tracking-tight">
          <Utensils size={28} />
          <span>Foodpronto</span>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-neutral-900">
            Escolha o plano ideal para o seu restaurante
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Comece a transformar o seu atendimento hoje mesmo. Você pode alterar seu plano a qualquer momento.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
            ✅ 30 dias grátis — sem cartão de crédito
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Plano Básico */}
          <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm hover:shadow-xl transition-all flex flex-col relative">
            <div className="mb-6">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
                <QrCode size={28} />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Cardápio Digital</h2>
              <p className="text-neutral-500">O essencial para modernizar a experiência do seu cliente na mesa.</p>
            </div>
            
            <div className="mb-8 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-neutral-900">R$ 40</span>
              <span className="text-neutral-500 font-medium">/mês</span>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3">
                <Check size={20} className="text-green-500 shrink-0 mt-0.5" />
                <span className="text-neutral-700">Cardápio acessível via QR Code na mesa</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={20} className="text-green-500 shrink-0 mt-0.5" />
                <span className="text-neutral-700">Edição de produtos e preços em tempo real</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={20} className="text-green-500 shrink-0 mt-0.5" />
                <span className="text-neutral-700">Design moderno e responsivo para celular</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={20} className="text-green-500 shrink-0 mt-0.5" />
                <span className="text-neutral-700">Link personalizado do seu restaurante</span>
              </li>
            </ul>

            <Link
              href="/dashboard?plano=digital"
              className="w-full block text-center py-4 rounded-full border-2 border-neutral-200 text-neutral-700 font-bold hover:border-[#E24B4A] hover:text-[#E24B4A] transition-colors"
            >
              Começar com o Cardápio
            </Link>
            <p className="text-center text-xs text-neutral-400 mt-3">30 dias grátis, sem cartão</p>
          </div>

          {/* Plano Completo */}
          <div className="bg-neutral-900 rounded-3xl p-8 border border-neutral-800 shadow-2xl flex flex-col relative transform md:-translate-y-4">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#E24B4A] to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
              Mais Escolhido
            </div>
            
            <div className="mb-6 mt-2">
              <div className="w-14 h-14 rounded-2xl bg-[#E24B4A]/20 text-[#E24B4A] flex items-center justify-center mb-4">
                <ChefHat size={28} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Gestão Completa</h2>
              <p className="text-neutral-400">Cardápio + Pedidos + Gestão de Mesas e Cozinha.</p>
            </div>
            
            <div className="mb-8 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-white">R$ 89</span>
              <span className="text-neutral-400 font-medium">/mês</span>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3">
                <Check size={20} className="text-[#E24B4A] shrink-0 mt-0.5" />
                <span className="text-neutral-300"><strong className="text-white">Tudo do plano Digital</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={20} className="text-[#E24B4A] shrink-0 mt-0.5" />
                <span className="text-neutral-300">Clientes fazem o pedido pelo celular</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={20} className="text-[#E24B4A] shrink-0 mt-0.5" />
                <span className="text-neutral-300">Gestão de mesas e comandas digitais</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={20} className="text-[#E24B4A] shrink-0 mt-0.5" />
                <span className="text-neutral-300">Painel (KDS) em tempo real para a cozinha</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={20} className="text-[#E24B4A] shrink-0 mt-0.5" />
                <span className="text-neutral-300">Controle de caixa e relatórios de vendas</span>
              </li>
            </ul>

            <Link
              href="/dashboard?plano=completo"
              className="w-full block text-center py-4 rounded-full bg-gradient-to-r from-[#E24B4A] to-orange-500 text-white font-bold hover:shadow-lg hover:shadow-[#E24B4A]/40 transition-all active:scale-95"
            >
              Testar Gestão Completa
            </Link>
            <p className="text-center text-xs text-neutral-500 mt-3">30 dias grátis, sem cartão</p>
          </div>
        </div>
      </main>
    </div>
  );
}
