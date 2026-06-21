"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Utensils,
  ArrowLeft,
  CheckCircleIcon,
  DollarSignIcon,
  UsersIcon,
  TrendingUpIcon,
  SendIcon,
  MessageCircleIcon,
  ChevronDownIcon,
} from "lucide-react";

const PLANS = [
  { name: "Cardápio Digital", price: 40, commission: 20 },
  { name: "Gestão Completa", price: 89, commission: 44.5 },
];

export default function TrabalheConoscoPage() {
  const [selectedPlan, setSelectedPlan] = useState(1); // 0 = Digital, 1 = Completo
  const [clientCount, setClientCount] = useState(10);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const plan = PLANS[selectedPlan];
  const monthlyEarning = plan.commission * clientCount;

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-neutral-800 sticky top-0 z-50 bg-neutral-950">
        <Link href="/" className="flex items-center gap-2 text-[#E24B4A] font-bold text-xl tracking-tight">
          <Utensils size={26} />
          <span>Food Pronto</span>
        </Link>
        <Link
          href="/contato"
          className="text-sm font-semibold bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full transition-all"
        >
          Quero participar
        </Link>
      </header>

      {/* Hero */}
      <section className="text-center pt-20 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-green-500/10 to-[#E24B4A]/10 rounded-full blur-[120px] -z-10" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-semibold tracking-widest uppercase mb-8">
          Programa de Afiliados
        </div>

        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight mb-6">
          Venda Food Pronto.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
            Ganhe 50% todo mês.
          </span>
        </h1>

        <p className="text-lg text-neutral-400 max-w-xl mx-auto mb-10">
          Seja nosso parceiro comercial. Indique restaurantes e ganhe comissão recorrente a cada cliente que assinar.
        </p>

        <a
          href={`https://wa.me/5513982032534?text=${encodeURIComponent("Olá! Quero participar do programa de afiliados Foodpronto.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-lg shadow-green-500/20"
        >
          <MessageCircleIcon className="w-5 h-5" />
          Quero ser afiliado
        </a>
      </section>

      {/* Vantagens */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { icon: <DollarSignIcon className="w-6 h-6 text-green-400" />, title: "50% de comissão", desc: "Ganhe metade do valor da assinatura, todo mês, enquanto o cliente permanecer ativo." },
            { icon: <UsersIcon className="w-6 h-6 text-green-400" />, title: "Sem limite de indicações", desc: "Indique quantos restaurantes quiser. Quanto mais indicar, mais ganha." },
            { icon: <TrendingUpIcon className="w-6 h-6 text-green-400" />, title: "Renda recorrente", desc: "Não é uma venda única. Você recebe comissão todos os meses, de forma passiva." },
          ].map((v) => (
            <div key={v.title} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                {v.icon}
              </div>
              <h3 className="text-white font-bold mb-2">{v.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Simulador de ganhos */}
        <div className="mt-16 bg-neutral-900 border border-neutral-800 rounded-3xl p-8">
          <h2 className="text-3xl font-extrabold text-center text-white mb-2">
            Quanto você pode ganhar?
          </h2>
          <p className="text-neutral-500 text-center text-sm mb-8">
            Simule seus ganhos mensais com base no plano e número de indicações.
          </p>

          {/* Seletor de plano */}
          <div className="flex justify-center gap-3 mb-8">
            {PLANS.map((p, i) => (
              <button
                key={p.name}
                onClick={() => setSelectedPlan(i)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  selectedPlan === i
                    ? "bg-green-500 text-white"
                    : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                }`}
              >
                {p.name} · R${p.price}/mês
              </button>
            ))}
          </div>

          {/* Slider */}
          <div className="max-w-md mx-auto mb-8">
            <input
              type="range"
              min={1}
              max={50}
              value={clientCount}
              onChange={(e) => setClientCount(parseInt(e.target.value))}
              className="w-full h-2 bg-neutral-800 rounded-full appearance-none cursor-pointer accent-green-500"
            />
            <div className="flex justify-between text-xs text-neutral-500 mt-2">
              <span>1 cliente</span>
              <span>50 clientes</span>
            </div>
          </div>

          {/* Resultado */}
          <div className="flex items-center justify-center gap-6 text-center">
            <div>
              <p className="text-5xl font-extrabold text-white">{clientCount}</p>
              <p className="text-neutral-500 text-sm mt-1">clientes</p>
            </div>
            <div className="text-3xl text-neutral-600">·</div>
            <div>
              <p className="text-5xl font-extrabold text-green-400">
                R$ {monthlyEarning.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
              </p>
              <p className="text-neutral-500 text-sm mt-1">por mês</p>
            </div>
          </div>

          <p className="text-center text-xs text-neutral-600 mt-4">
            Comissão de R${plan.commission.toFixed(2)} por cliente/mês (50% de R${plan.price})
          </p>
        </div>

        {/* Sem vínculo formal */}
        <div className="mt-12 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0 mt-1">
            <CheckCircleIcon className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-white font-bold mb-1">Parceria formal sem contrato de exclusividade</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Você recebe um link de afiliado e um código único. A cada restaurante que se inscrever com seu código,
              você ganha 50% do valor da assinatura mensal. Pagamentos via <strong className="text-white">PIX</strong> todo dia 5.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs bg-green-500/10 text-green-400 px-3 py-1 rounded-full">✓ Sem investimento inicial</span>
              <span className="text-xs bg-green-500/10 text-green-400 px-3 py-1 rounded-full">✓ Trabalhe de qualquer lugar</span>
              <span className="text-xs bg-green-500/10 text-green-400 px-3 py-1 rounded-full">✓ Sem horário fixo</span>
            </div>
          </div>
        </div>

        {/* Como funciona */}
        <div className="mt-16">
          <h2 className="text-3xl font-extrabold text-center text-white mb-10">Como funciona?</h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            {[
              { step: "1", title: "Fale com a gente", desc: "Entre em contato pelo WhatsApp e receba seu código de afiliado." },
              { step: "2", title: "Indique restaurantes", desc: "Visite bares, restaurantes e food trucks na sua cidade e apresente o Foodpronto." },
              { step: "3", title: "O cliente se inscreve", desc: "Quando ele se cadastra usando seu código, a comissão é vinculada automaticamente." },
              { step: "4", title: "Ganhe todo mês", desc: "Enquanto o cliente pagar a assinatura, você recebe 50% do valor via PIX." },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-4 bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
                <div className="w-9 h-9 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                  {s.step}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{s.title}</h3>
                  <p className="text-neutral-400 text-sm mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-3xl font-extrabold text-center text-white mb-10">Perguntas frequentes</h2>
          <div className="space-y-3 max-w-2xl mx-auto">
            {[
              { q: "Preciso pagar algo para ser afiliado?", a: "Não. O programa é 100% gratuito. Você não precisa investir nada." },
              { q: "Quando recebo minha comissão?", a: "Todo dia 5 do mês seguinte, via PIX. Se o dia 5 cair em fim de semana, o pagamento é feito no próximo dia útil." },
              { q: "E se o cliente cancelar?", a: "Enquanto o cliente estiver com assinatura ativa, você recebe. Se cancelar, a comissão para naquele mês." },
              { q: "Posso indicar de qualquer cidade?", a: "Sim! O Foodpronto funciona em todo o Brasil. Indique restaurantes de qualquer lugar." },
              { q: "Qual é a comissão por plano?", a: "Cardápio Digital (R$40/mês): você ganha R$20/mês por cliente. Gestão Completa (R$89/mês): você ganha R$44,50/mês por cliente." },
              { q: "Preciso ter experiência em vendas?", a: "Não necessariamente. Oferecemos material de apoio e dicas para abordar restaurantes." },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="text-white font-medium text-sm">{item.q}</span>
                  <ChevronDownIcon className={`w-5 h-5 text-neutral-500 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-neutral-400 text-sm">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA final */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Pronto para começar<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
              a ganhar comissão?
            </span>
          </h2>
          <p className="text-neutral-400 text-sm mb-8 max-w-md mx-auto">
            Entre em contato pelo WhatsApp e comece a indicar ainda hoje.
          </p>
          <a
            href={`https://wa.me/5513982032534?text=${encodeURIComponent("Olá! Quero participar do programa de afiliados Foodpronto.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-lg shadow-green-500/20"
          >
            <MessageCircleIcon className="w-5 h-5" />
            Falar pelo WhatsApp
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800 bg-neutral-950 py-10 px-6 text-center">
        <div className="flex items-center justify-center gap-2 text-white font-bold text-lg tracking-tight mb-5">
          <Utensils size={20} className="text-[#E24B4A]" />
          <span>Food Pronto</span>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-neutral-500 mb-6">
          <Link href="/" className="hover:text-neutral-300 transition-colors">Início</Link>
          <Link href="/planos" className="hover:text-neutral-300 transition-colors">Planos</Link>
          <Link href="/quem-somos" className="hover:text-neutral-300 transition-colors">Quem Somos</Link>
          <Link href="/contato" className="hover:text-neutral-300 transition-colors">Contato</Link>
          <Link href="/termos" className="hover:text-neutral-300 transition-colors">Termos</Link>
          <Link href="/privacidade" className="hover:text-neutral-300 transition-colors">Privacidade</Link>
          <Link href="/trabalhe-conosco" className="hover:text-neutral-300 transition-colors">Trabalhe Conosco</Link>
        </nav>
        <p className="text-xs text-neutral-600">&copy; {new Date().getFullYear()} Cardápio Foodpronto. Todos os direitos reservados.</p>
        <p className="text-xs text-neutral-700 mt-1">CNPJ 64.465.357/0001-28</p>
      </footer>
    </div>
  );
}
