import Link from "next/link";
import { ArrowRight, Utensils, QrCode, TrendingUp, Smartphone, Check, ChefHat } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 text-neutral-900">
      {/* Navbar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-neutral-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 text-[#E24B4A] font-bold text-xl tracking-tight">
          <Utensils size={28} />
          <span>Foodpronto</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link
            href="/contato"
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            Contato
          </Link>
          <Link
            href="/entrar"
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="text-sm font-medium bg-[#E24B4A] text-white px-5 py-2.5 rounded-full hover:bg-[#c93f3e] transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            Começar Grátis
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 sm:py-32 relative overflow-hidden">
        {/* Background Decorative Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[#E24B4A]/20 to-orange-400/20 rounded-full blur-[100px] -z-10" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E24B4A]/10 text-[#E24B4A] text-sm font-medium mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E24B4A] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E24B4A]"></span>
          </span>
          A Revolução do Cardápio Digital
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight max-w-4xl leading-tight mb-8">
          O Futuro do seu <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E24B4A] to-orange-500">Restaurante</span> Começa Aqui.
        </h1>
        
        <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mb-12 leading-relaxed">
          Transforme a experiência dos seus clientes com um cardápio digital interativo, moderno e extremamente rápido. Aumente suas vendas e otimize o atendimento.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <Link
            href="/cadastro"
            className="w-full sm:w-auto px-8 py-4 bg-[#E24B4A] text-white rounded-full font-semibold text-lg hover:bg-[#c93f3e] transition-all shadow-lg hover:shadow-[#E24B4A]/30 hover:-translate-y-1 flex items-center justify-center gap-2 group"
          >
            Criar meu Cardápio
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-4 bg-white border border-neutral-200 text-neutral-700 rounded-full font-semibold text-lg hover:bg-neutral-50 transition-all shadow-sm flex items-center justify-center gap-2"
          >
            Acessar Dashboard
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-white py-24 px-6 border-t border-neutral-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Tudo o que você precisa para crescer</h2>
            <p className="text-neutral-500">Recursos pensados exclusivamente para o sucesso do seu negócio gastronômico.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<QrCode size={32} className="text-[#E24B4A]" />}
              title="Acesso via QR Code"
              description="Seus clientes acessam o cardápio instantaneamente apontando a câmera do celular, sem precisar instalar aplicativos."
            />
            <FeatureCard 
              icon={<Smartphone size={32} className="text-[#E24B4A]" />}
              title="Interface Premium"
              description="Um design deslumbrante e responsivo que valoriza as fotos dos seus pratos e facilita o pedido."
            />
            <FeatureCard 
              icon={<TrendingUp size={32} className="text-[#E24B4A]" />}
              title="Gestão Simplificada"
              description="Dashboard completo para atualizar preços, adicionar produtos e gerenciar seu negócio em tempo real."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-neutral-50 py-24 px-6 border-t border-neutral-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-neutral-900">Escolha o plano ideal para você</h2>
            <p className="text-neutral-500 max-w-xl mx-auto">
              Comece com o cardápio digital e evolua quando precisar. 30 dias grátis em qualquer plano, sem cartão de crédito.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plano Cardápio Digital */}
            <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm hover:shadow-xl transition-all flex flex-col">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center mb-5">
                <QrCode size={28} className="text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-1">Cardápio Digital</h3>
              <p className="text-neutral-500 text-sm mb-6">Modernize a experiência do cliente na mesa, sem papel.</p>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-extrabold text-neutral-900">R$ 40</span>
                <span className="text-neutral-400 font-medium">/mês</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "Cardápio acessível via QR Code, NFC e link direto na mesa",
                  "Edição de produtos e preços em tempo real",
                  "Design moderno e responsivo para celular",
                  "Link personalizado do seu restaurante",
                  "Upload de fotos dos pratos",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
                    <span className="text-neutral-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/cadastro"
                className="w-full block text-center py-3.5 rounded-full border-2 border-neutral-200 text-neutral-700 font-semibold hover:border-[#E24B4A] hover:text-[#E24B4A] transition-colors"
              >
                Começar grátis
              </Link>
              <p className="text-center text-xs text-neutral-400 mt-3">30 dias grátis, sem cartão</p>
            </div>

            {/* Plano Gestão Completa */}
            <div className="bg-neutral-900 rounded-3xl p-8 border border-neutral-800 shadow-2xl flex flex-col relative transform md:-translate-y-4">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#E24B4A] to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg whitespace-nowrap">
                Mais Escolhido
              </div>

              <div className="w-14 h-14 rounded-2xl bg-[#E24B4A]/20 flex items-center justify-center mb-5 mt-2">
                <ChefHat size={28} className="text-[#E24B4A]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">Gestão Completa</h3>
              <p className="text-neutral-400 text-sm mb-6">Cardápio + pedidos + mesas + cozinha, tudo integrado.</p>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-extrabold text-white">R$ 89</span>
                <span className="text-neutral-400 font-medium">/mês</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {[
                  { text: "Tudo do plano Cardápio Digital", highlight: true },
                  { text: "Clientes fazem pedidos pelo celular direto na mesa", highlight: false },
                  { text: "Gestão de mesas e comandas digitais", highlight: false },
                  { text: "Painel KDS em tempo real para a cozinha", highlight: false },
                  { text: "Painel do garçom: entregas e pagamentos", highlight: false },
                  { text: "Relatórios de vendas e controle de caixa", highlight: false },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-3">
                    <Check size={18} className="text-[#E24B4A] shrink-0 mt-0.5" />
                    <span className={`text-sm ${item.highlight ? "text-white font-semibold" : "text-neutral-300"}`}>
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/cadastro"
                className="w-full block text-center py-3.5 rounded-full bg-gradient-to-r from-[#E24B4A] to-orange-500 text-white font-semibold hover:shadow-lg hover:shadow-[#E24B4A]/40 transition-all active:scale-95"
              >
                Testar grátis por 30 dias
              </Link>
              <p className="text-center text-xs text-neutral-500 mt-3">30 dias grátis, sem cartão</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-12 px-6 text-center">
        <div className="flex items-center justify-center gap-2 text-white font-bold text-xl tracking-tight mb-4">
          <Utensils size={24} className="text-[#E24B4A]" />
          <span>Foodpronto</span>
        </div>
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Cardápio Foodpronto. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-3xl bg-neutral-50 border border-neutral-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
      <div className="w-16 h-16 rounded-2xl bg-[#E24B4A]/10 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-neutral-900">{title}</h3>
      <p className="text-neutral-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
