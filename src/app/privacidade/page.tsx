import Link from "next/link";
import { Utensils, ArrowLeft, Lock, MapPin, Share2, Trash2, Mail } from "lucide-react";

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-neutral-800 bg-neutral-950 sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 text-[#E24B4A] font-bold text-xl tracking-tight">
          <Utensils size={26} />
          <span>Food Pronto</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          <ArrowLeft size={16} />
          Voltar ao início
        </Link>
      </header>

      {/* Hero */}
      <div className="text-center pt-16 pb-10 px-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neutral-700 text-neutral-400 text-xs font-semibold tracking-widest uppercase mb-6">
          Segurança &amp; Transparência
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight text-white mb-3">
          Política de Privacidade
        </h1>
        <p className="text-neutral-500 text-sm">Última atualização: 19 de junho de 2026</p>
      </div>

      {/* Conteúdo */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 pb-20 space-y-14">

        {/* Intro */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-sm text-neutral-400 leading-relaxed">
          Sua privacidade é uma prioridade absoluta para o{" "}
          <strong className="text-white">Food Pronto</strong>. Esta política detalha como
          coletamos, usamos e protegemos suas informações ao utilizar nosso aplicativo e serviços
          associados.
        </div>

        {/* 1. Informações que Coletamos */}
        <section>
          <SectionTitle number="01" title="Informações que Coletamos" />
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={15} className="text-[#E24B4A]" />
              <span className="text-[#E24B4A] text-sm font-semibold">Localização (GPS)</span>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Solicitamos acesso à sua localização para mostrar os food trucks mais próximos. Estes dados são processados apenas enquanto o
              app está em uso e não são armazenados permanentemente ou vendidos.
            </p>
          </div>
        </section>

        {/* 2. Uso das Informações */}
        <section>
          <SectionTitle number="02" title="Uso das Informações" />
          <ul className="space-y-3">
            {[
              "Operação técnica do aplicativo e processamento de pedidos em tempo real.",
              "Envio de notificações push para avisar quando seu pedido estiver pronto.",
              "Melhoria contínua da experiência do usuário baseada em análises anônimas.",
              "Prevenção de fraudes e garantia da segurança das transações.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-neutral-400">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E24B4A] shrink-0 mt-2" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* 3. Compartilhamento com Terceiros */}
        <section>
          <SectionTitle number="03" title="Compartilhamento com Terceiros" />
          <p className="text-neutral-400 text-sm mb-4 leading-relaxed">
            Trabalhamos com parceiros de confiança que seguem rigorosos padrões de segurança:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm text-neutral-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E24B4A] shrink-0 mt-2" />
              <span>
                <strong className="text-white">Convex:</strong> Armazenamento de dados do aplicativo e pedidos.
              </span>
            </li>
            <li className="flex items-start gap-3 text-sm text-neutral-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E24B4A] shrink-0 mt-2" />
              <span>
                <strong className="text-white">Mercado Pago:</strong> Processamento de pagamentos (os dados de cartão não passam pelos nossos servidores).
              </span>
            </li>
          </ul>
        </section>

        {/* 4. Exclusão de Dados */}
        <section>
          <SectionTitle number="04" title="Exclusão de Dados" />
          <p className="text-neutral-400 text-sm leading-relaxed">
            Você tem total controle sobre seus dados. A qualquer momento, você pode solicitar a exclusão definitiva da sua conta
            e de todos os dados associados através das configurações do aplicativo ou enviando um e-mail para nossa equipe de
            suporte.
          </p>
        </section>

        {/* Contato */}
        <div className="border-t border-neutral-800 pt-10">
          <h2 className="text-white text-xl font-bold mb-3">Contato</h2>
          <p className="text-neutral-400 text-sm">
            Dúvidas sobre sua privacidade? Entre em contato pelo e-mail:{" "}
            <a
              href="mailto:contato@foodpronto.com.br"
              className="text-[#E24B4A] hover:underline"
            >
              contato@foodpronto.com.br
            </a>
          </p>
        </div>

        {/* Voltar */}
        <div className="border-t border-neutral-800 pt-8 flex justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            <ArrowLeft size={15} />
            Voltar para o início
          </Link>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800 bg-neutral-950 py-10 px-6 text-center">
        <div className="flex items-center justify-center gap-2 text-white font-bold text-lg tracking-tight mb-5">
          <Utensils size={20} className="text-[#E24B4A]" />
          <span>Food Pronto</span>
        </div>
        <nav className="flex items-center justify-center gap-6 text-sm text-neutral-500 mb-6">
          <Link href="/" className="hover:text-neutral-300 transition-colors">Início</Link>
          <Link href="/planos" className="hover:text-neutral-300 transition-colors">Planos</Link>
          <Link href="/contato" className="hover:text-neutral-300 transition-colors">Contato</Link>
          <Link href="/termos" className="hover:text-neutral-300 transition-colors">Termos de Uso</Link>
          <Link href="/privacidade" className="hover:text-neutral-300 transition-colors text-neutral-300">Privacidade</Link>
        </nav>
        <p className="text-xs text-neutral-600">
          &copy; {new Date().getFullYear()} Cardápio Foodpronto. Todos os direitos reservados.
        </p>
        <p className="text-xs text-neutral-700 mt-1">
          CNPJ 64.465.357/0001-28
        </p>
      </footer>
    </div>
  );
}

function SectionTitle({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="text-xs font-bold text-[#E24B4A] bg-[#E24B4A]/10 px-2 py-1 rounded-lg">
        {number}
      </span>
      <h2 className="text-white text-xl font-bold">{title}</h2>
    </div>
  );
}
