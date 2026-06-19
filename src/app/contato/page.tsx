import Link from "next/link";
import { Utensils, Mail, Phone, MessageCircle, ArrowLeft } from "lucide-react";

const WHATSAPP_NUMBER = "5513982032534";
const WHATSAPP_MESSAGE = encodeURIComponent("Olá! Tenho interesse no cardápio digital da Foodpronto. Gostaria de saber mais informações.");

export default function ContatoPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-neutral-200 bg-white sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 text-[#E24B4A] font-bold text-xl tracking-tight">
          <Utensils size={28} />
          <span>Foodpronto</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Voltar ao início
        </Link>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-2xl w-full mx-auto">
          {/* Título */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 mb-4">
              Fale com a gente 👋
            </h1>
            <p className="text-lg text-neutral-500">
              Tire suas dúvidas, solicite uma demonstração ou comece seu teste grátis. Estamos aqui para ajudar.
            </p>
          </div>

          {/* Cards de contato */}
          <div className="grid sm:grid-cols-2 gap-6">
            {/* WhatsApp */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white border border-neutral-200 rounded-3xl p-8 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mb-5 group-hover:bg-green-500 transition-colors duration-300">
                <MessageCircle size={32} className="text-green-500 group-hover:text-white transition-colors duration-300" />
              </div>
              <h2 className="text-xl font-bold text-neutral-900 mb-1">WhatsApp</h2>
              <p className="text-neutral-500 text-sm mb-4">(13) 98203-2534</p>
              <span className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full font-semibold text-sm shadow-md shadow-green-200 group-hover:bg-green-600 transition-colors">
                <MessageCircle size={16} />
                Conversar agora
              </span>
              <p className="text-xs text-neutral-400 mt-4 italic">
                Resposta rápida em horário comercial
              </p>
            </a>

            {/* E-mail */}
            <a
              href="mailto:contato@foodpronto.com.br?subject=Interesse no cardápio digital"
              className="group bg-white border border-neutral-200 rounded-3xl p-8 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#E24B4A]/10 flex items-center justify-center mb-5 group-hover:bg-[#E24B4A] transition-colors duration-300">
                <Mail size={32} className="text-[#E24B4A] group-hover:text-white transition-colors duration-300" />
              </div>
              <h2 className="text-xl font-bold text-neutral-900 mb-1">E-mail</h2>
              <p className="text-neutral-500 text-sm mb-4">contato@foodpronto.com.br</p>
              <span className="inline-flex items-center gap-2 bg-[#E24B4A] text-white px-6 py-3 rounded-full font-semibold text-sm shadow-md shadow-red-200 group-hover:bg-[#c93f3e] transition-colors">
                <Mail size={16} />
                Enviar e-mail
              </span>
              <p className="text-xs text-neutral-400 mt-4 italic">
                Respondemos em até 24 horas
              </p>
            </a>
          </div>

          {/* CTA final */}
          <div className="mt-12 bg-neutral-900 rounded-3xl p-8 text-center">
            <p className="text-neutral-400 text-sm mb-3">Prefere testar antes de falar com alguém?</p>
            <h3 className="text-white text-xl font-bold mb-5">Crie sua conta e explore grátis por 30 dias</h3>
            <Link
              href="/cadastro"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#E24B4A] to-orange-500 text-white px-8 py-3.5 rounded-full font-semibold hover:shadow-lg hover:shadow-[#E24B4A]/40 transition-all active:scale-95"
            >
              Começar grátis agora
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-8 px-6 text-center">
        <div className="flex items-center justify-center gap-2 text-white font-bold text-lg tracking-tight mb-2">
          <Utensils size={20} className="text-[#E24B4A]" />
          <span>Foodpronto</span>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-neutral-500 mb-3">
          <Link href="/planos" className="hover:text-neutral-300 transition-colors">Planos</Link>
          <Link href="/quem-somos" className="hover:text-neutral-300 transition-colors">Quem Somos</Link>
          <Link href="/contato" className="hover:text-neutral-300 transition-colors">Contato</Link>
          <Link href="/termos" className="hover:text-neutral-300 transition-colors">Termos de Uso</Link>
          <Link href="/privacidade" className="hover:text-neutral-300 transition-colors">Privacidade</Link>
        </nav>
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Cardápio Foodpronto. Todos os direitos reservados.
        </p>
        <p className="text-xs text-neutral-600 mt-1">
          CNPJ 64.465.357/0001-28
        </p>
      </footer>
    </div>
  );
}
