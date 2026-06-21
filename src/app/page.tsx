import Link from "next/link";
import {
  ArrowRight,
  Utensils,
  QrCode,
  TrendingUp,
  Smartphone,
  Check,
  ChefHat,
  Clock,
  Zap,
  Users,
  BarChart3,
  TableIcon,
  BellRing,
  Shield,
  Star,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-white">
      {/* Navbar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 text-[#E24B4A] font-bold text-xl tracking-tight">
          <Utensils size={28} />
          <span className="text-white">Food<span className="text-[#E24B4A]">pronto</span></span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-400">
          <Link href="/quem-somos" className="hover:text-white transition-colors">Quem Somos</Link>
          <Link href="/planos" className="hover:text-white transition-colors">Planos</Link>
          <Link href="/contato" className="hover:text-white transition-colors">Contato</Link>
          <Link href="/trabalhe-conosco" className="hover:text-white transition-colors">Afiliados</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/entrar" className="text-sm text-neutral-400 hover:text-white transition-colors">
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="text-sm font-semibold bg-[#E24B4A] text-white px-5 py-2.5 rounded-full hover:bg-[#c93f3e] transition-all"
          >
            Começar Grátis
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[#E24B4A]/15 to-orange-500/10 rounded-full blur-[120px] -z-10" />

        <div className="max-w-5xl mx-auto text-center px-6 pt-24 pb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#E24B4A]/30 bg-[#E24B4A]/10 text-[#E24B4A] text-xs font-semibold tracking-widest uppercase mb-8">
            <Zap size={12} /> Pronto em 30 minutos
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-tight mb-6">
            Seu Restaurante<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E24B4A] to-orange-400">
              no Digital em 30 min.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Cardápio digital via QR Code, NFC e link direto. Gestão de pedidos, mesas, cozinha e relatórios — tudo em uma única plataforma. Simples, rápido e sem complicação.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/cadastro"
              className="px-8 py-4 bg-[#E24B4A] text-white rounded-full font-semibold text-lg hover:bg-[#c93f3e] transition-all shadow-lg shadow-[#E24B4A]/20 hover:-translate-y-1 flex items-center gap-2 group"
            >
              Criar meu Cardápio Grátis
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/planos"
              className="px-8 py-4 border border-neutral-700 text-neutral-300 rounded-full font-semibold text-lg hover:border-neutral-500 transition-all"
            >
              Ver planos
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-white">30 min</p>
              <p className="text-xs text-neutral-500 mt-1">Para estar online</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">0</p>
              <p className="text-xs text-neutral-500 mt-1">Instalação necessária</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">30 dias</p>
              <p className="text-xs text-neutral-500 mt-1">Grátis para testar</p>
            </div>
          </div>
        </div>
      </section>

      {/* Funciona em 3 etapas */}
      <section className="bg-neutral-900 py-20 px-6 border-t border-neutral-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              Seu cardápio pronto em<br /><span className="text-[#E24B4A]">3 passos simples</span>
            </h2>
            <p className="text-neutral-400 max-w-lg mx-auto">
              Sem necessidade de programador, sem app para baixar, sem equipamento especial.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { step: "1", icon: <Users size={28} />, title: "Crie sua conta", desc: "Cadastro em 2 minutos. Preencha nome, cidade e pronto." },
              { step: "2", icon: <Smartphone size={28} />, title: "Monte seu cardápio", desc: "Adicione categorias, produtos, fotos e preços pelo celular ou computador." },
              { step: "3", icon: <QrCode size={28} />, title: "Compartilhe", desc: "QR Code, NFC ou link direto. Seus clientes acessam instantaneamente." },
            ].map((s) => (
              <div key={s.step} className="bg-neutral-950 border border-neutral-800 rounded-3xl p-8 text-center hover:border-[#E24B4A]/30 transition-colors">
                <div className="w-12 h-12 bg-[#E24B4A]/10 text-[#E24B4A] rounded-2xl flex items-center justify-center mx-auto mb-5">
                  {s.icon}
                </div>
                <div className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-3 text-xs font-bold text-neutral-400">
                  {s.step}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                <p className="text-neutral-400 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section className="py-20 px-6 border-t border-neutral-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              Tudo o que seu restaurante<br /><span className="text-[#E24B4A]">precisa para crescer</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: <QrCode size={22} />, title: "QR Code + NFC + Link", desc: "Acesso instantâneo ao cardápio sem app." },
              { icon: <Smartphone size={22} />, title: "Pedidos pelo celular", desc: "Cliente faz o pedido direto da mesa." },
              { icon: <ChefHat size={22} />, title: "Painel da Cozinha (KDS)", desc: "Tela em tempo real para a equipe de preparo." },
              { icon: <TableIcon size={22} />, title: "Gestão de mesas", desc: "Controle de status e comandas por mesa." },
              { icon: <BellRing size={22} />, title: "Notificações ao garçom", desc: "Alerta sonoro para pedidos prontos e chamadas." },
              { icon: <BarChart3 size={22} />, title: "Relatórios de vendas", desc: "Receita diária, ticket médio e ranking de itens." },
              { icon: <Clock size={22} />, title: "Tempo real", desc: "Tudo é atualizado em tempo real, sem refresh." },
              { icon: <Shield size={22} />, title: "Seguro e confiável", desc: "Dados protegidos, plataforma estável 24/7." },
            ].map((f) => (
              <div key={f.title} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 bg-[#E24B4A]/10 text-[#E24B4A] rounded-xl flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="text-white font-semibold mb-1">{f.title}</h3>
                <p className="text-neutral-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Planos */}
      <section className="bg-neutral-900 py-20 px-6 border-t border-neutral-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              Planos que cabem<br /><span className="text-[#E24B4A]">no seu bolso</span>
            </h2>
            <p className="text-neutral-400">30 dias grátis. Sem cartão de crédito. Cancele quando quiser.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Cardápio Digital */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-8 flex flex-col">
              <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-5">
                <QrCode size={24} className="text-orange-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">Cardápio Digital</h3>
              <p className="text-neutral-500 text-sm mb-6">Ideal para quem quer modernizar o atendimento.</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-white">R$ 40</span>
                <span className="text-neutral-500">/mês</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "Cardápio via QR Code, NFC e link direto",
                  "Edição de produtos em tempo real",
                  "Design responsivo (celular, tablet, PC)",
                  "Link personalizado do restaurante",
                  "Upload de fotos dos pratos",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-neutral-300">
                    <Check size={16} className="text-green-400 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/cadastro" className="w-full block text-center py-3.5 rounded-full border-2 border-neutral-700 text-neutral-300 font-semibold hover:border-[#E24B4A] hover:text-[#E24B4A] transition-colors">
                Começar grátis
              </Link>
            </div>

            {/* Gestão Completa */}
            <div className="bg-gradient-to-b from-[#E24B4A]/10 to-neutral-950 border border-[#E24B4A]/30 rounded-3xl p-8 flex flex-col relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E24B4A] text-white text-xs font-bold px-4 py-1 rounded-full">
                Mais escolhido
              </div>
              <div className="w-12 h-12 bg-[#E24B4A]/20 rounded-2xl flex items-center justify-center mb-5 mt-2">
                <ChefHat size={24} className="text-[#E24B4A]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">Gestão Completa</h3>
              <p className="text-neutral-500 text-sm mb-6">Cardápio + pedidos + mesas + cozinha + pagamentos.</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-white">R$ 89</span>
                <span className="text-neutral-500">/mês</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "Tudo do plano Cardápio Digital",
                  "Pedidos pelo celular direto na mesa",
                  "Gestão de mesas e comandas digitais",
                  "Painel KDS em tempo real para a cozinha",
                  "Painel do garçom com alertas sonoros",
                  "Relatórios de vendas e ranking de itens",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-neutral-300">
                    <Check size={16} className="text-[#E24B4A] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/cadastro" className="w-full block text-center py-3.5 rounded-full bg-[#E24B4A] text-white font-semibold hover:bg-[#c93f3e] transition-colors">
                Testar grátis por 30 dias
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sem necessidade */}
      <section className="py-20 px-6 border-t border-neutral-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-10">
            Simples, rápido e<br /><span className="text-[#E24B4A]">sem complicação</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { emoji: "🚫", text: "Sem app para baixar" },
              { emoji: "📱", text: "Funciona no celular" },
              { emoji: "⚡", text: "Online em 30 min" },
              { emoji: "🖥️", text: "Celular, tablet ou PC" },
            ].map((item) => (
              <div key={item.text} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 text-center">
                <span className="text-3xl block mb-3">{item.emoji}</span>
                <p className="text-white font-medium text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Afiliados teaser */}
      <section className="bg-gradient-to-r from-green-500/10 to-neutral-950 border-t border-neutral-800 py-16 px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-extrabold text-white mb-3">
              Ganhe 50% de comissão<br />indicando restaurantes
            </h2>
            <p className="text-neutral-400 text-sm mb-5">
              Nosso programa de afiliados paga comissão recorrente todo mês. Sem limite de indicações.
            </p>
            <Link
              href="/trabalhe-conosco"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold text-sm transition-colors"
            >
              Saiba mais
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="text-center">
            <p className="text-5xl font-extrabold text-green-400">50%</p>
            <p className="text-neutral-500 text-sm mt-1">por cliente/mês</p>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 px-6 border-t border-neutral-800 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
          Pronto para modernizar<br /><span className="text-[#E24B4A]">seu restaurante?</span>
        </h2>
        <p className="text-neutral-400 max-w-md mx-auto mb-8">
          30 dias grátis, sem cartão de crédito. Em menos de 30 minutos você já está online.
        </p>
        <Link
          href="/cadastro"
          className="inline-flex items-center gap-2 bg-[#E24B4A] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#c93f3e] transition-all shadow-lg shadow-[#E24B4A]/20 group"
        >
          Começar agora — é grátis
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 border-t border-neutral-800 py-12 px-6 text-center">
        <div className="flex items-center justify-center gap-2 text-white font-bold text-xl tracking-tight mb-5">
          <Utensils size={22} className="text-[#E24B4A]" />
          <span>Foodpronto</span>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-neutral-500 mb-6">
          <Link href="/planos" className="hover:text-neutral-300 transition-colors">Planos</Link>
          <Link href="/quem-somos" className="hover:text-neutral-300 transition-colors">Quem Somos</Link>
          <Link href="/contato" className="hover:text-neutral-300 transition-colors">Contato</Link>
          <Link href="/termos" className="hover:text-neutral-300 transition-colors">Termos de Uso</Link>
          <Link href="/privacidade" className="hover:text-neutral-300 transition-colors">Privacidade</Link>
          <Link href="/trabalhe-conosco" className="hover:text-neutral-300 transition-colors">Trabalhe Conosco</Link>
        </nav>
        <p className="text-sm text-neutral-600">
          &copy; {new Date().getFullYear()} Cardápio Foodpronto. Todos os direitos reservados.
        </p>
        <p className="text-xs text-neutral-700 mt-1">CNPJ 64.465.357/0001-28</p>
      </footer>
    </div>
  );
}
