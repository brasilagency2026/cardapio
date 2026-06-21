import Link from "next/link";
import {
  Utensils,
  ArrowLeft,
  Truck,
  Waves,
  ShoppingBag,
  TabletSmartphone,
  MapPin,
  CreditCard,
  Zap,
  Globe,
  Smartphone,
  ExternalLink,
} from "lucide-react";

const APPS = [
  {
    icon: Truck,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/20",
    title: "Food Trucks",
    app: "foodpronto.com.br",
    url: "https://foodpronto.com.br",
    description:
      "Solução completa para food trucks ambulantes: cardápio digital via QR Code, pedidos pelo celular, gestão de filas e pagamentos sem maquininha.",
  },
  {
    icon: Waves,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    border: "border-cyan-400/20",
    title: "Quiosques de Praia",
    app: "quiosquepraia.com",
    url: "https://quiosquepraia.com",
    description:
      "Feito para quiosques à beira-mar: pedidos na areia, cardápio adaptado ao ambiente e atendimento ágil sem papel.",
  },
  {
    icon: ShoppingBag,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20",
    title: "Delivery de Restaurantes",
    app: "delivery.foodpronto.com.br",
    url: "https://delivery.foodpronto.com.br",
    description:
      "Plataforma de delivery própria para restaurantes: aceite pedidos online, gerencie entregas e receba sem depender de grandes marketplaces.",
  },
  {
    icon: TabletSmartphone,
    color: "text-[#E24B4A]",
    bg: "bg-[#E24B4A]/10",
    border: "border-[#E24B4A]/20",
    title: "Cardápio Digital & Gestão",
    app: "cardapio.foodpronto.com.br",
    url: "https://cardapio.foodpronto.com.br",
    description:
      "Menu digital com QR Code, NFC e link direto + gestão completa de mesas, comandas, cozinha (KDS) e relatórios de vendas.",
    current: true,
  },
];

const VANTAGENS = [
  {
    icon: Globe,
    title: "Sem instalação",
    description:
      "Tudo funciona diretamente no navegador. Sem app para baixar, sem configuração complexa.",
  },
  {
    icon: TabletSmartphone,
    title: "Qualquer dispositivo",
    description:
      "Computador, smartphone ou tablet — a plataforma se adapta a qualquer tela.",
  },
  {
    icon: CreditCard,
    title: "Sem maquininha",
    description:
      "Basta uma conta no Mercado Pago, simples e rápida de abrir. Aceite PIX, crédito e débito.",
  },
  {
    icon: MapPin,
    title: "Portal geolocalizado",
    description:
      "Todas as aplicações estão conectadas a um portal com geolocalização para facilitar o comércio de proximidade.",
  },
  {
    icon: Zap,
    title: "Rápido de implantar",
    description:
      "Em menos de 30 minutos seu estabelecimento já está online e aceitando pedidos.",
  },
  {
    icon: Smartphone,
    title: "App Android",
    description:
      "Disponível também no Google Play para uma experiência ainda mais fluida nos dispositivos móveis.",
  },
];

export default function QuemSomosPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-neutral-800 bg-neutral-950 sticky top-0 z-50">
        <Link
          href="/"
          className="flex items-center gap-2 text-[#E24B4A] font-bold text-xl tracking-tight"
        >
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
      <div className="text-center pt-16 pb-12 px-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neutral-700 text-neutral-400 text-xs font-semibold tracking-widest uppercase mb-6">
          Ecossistema Food Pronto
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight text-white mb-5 max-w-3xl mx-auto leading-tight">
          Quem Somos?
        </h1>
        <p className="text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          Somos um ecossistema completo de soluções digitais dedicadas à{" "}
          <strong className="text-white">gestão e pagamento para o setor de alimentação</strong>.
          Nosso objetivo é simples: popularizar e simplificar o comércio de restauração no Brasil.
        </p>
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 pb-24 space-y-20">

        {/* Missão */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 text-center">
          <p className="text-neutral-300 text-lg leading-relaxed max-w-2xl mx-auto">
            Acreditamos que <strong className="text-white">qualquer estabelecimento</strong> —
            seja um food truck ambulante, um quiosque à beira-mar ou um restaurante no centro da
            cidade — merece acesso a ferramentas modernas, acessíveis e fáceis de usar.
            Sem burocracia, sem maquininha obrigatória, sem barreiras técnicas.
          </p>
        </div>

        {/* Nossas aplicações */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-3">Nossas Aplicações</h2>
            <p className="text-neutral-500 text-sm">
              Quatro plataformas especializadas, todas conectadas no mesmo ecossistema.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {APPS.map((app) => (
              <div
                key={app.app}
                className={`bg-neutral-900 border rounded-3xl p-7 flex flex-col gap-4 hover:shadow-2xl transition-all relative ${app.border}`}
              >
                {app.current && (
                  <div className="absolute -top-3 right-5 bg-[#E24B4A] text-white text-xs font-bold px-3 py-1 rounded-full">
                    Você está aqui
                  </div>
                )}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${app.bg}`}>
                  <app.icon size={24} className={app.color} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">{app.title}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                    {app.description}
                  </p>
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold ${app.color} hover:opacity-80 transition-opacity`}
                  >
                    <ExternalLink size={13} />
                    {app.app}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Portal geolocalizado */}
        <section className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-3xl p-8">
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-green-400/10 flex items-center justify-center shrink-0">
              <MapPin size={24} className="text-green-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-xl mb-3">Portal Geolocalizado</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Todas as nossas aplicações estão interligadas através de um{" "}
                <strong className="text-white">portal com geolocalização</strong>. O cliente
                acessa o portal, vê os estabelecimentos próximos da sua localização e pode
                navegar pelos cardápios e fazer pedidos em segundos. Uma vitrine digital de
                proximidade para impulsionar seu comércio local.
              </p>
            </div>
          </div>
        </section>

        {/* App Android */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center shrink-0">
            <Smartphone size={32} className="text-green-400" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-white font-bold text-xl mb-2">Disponível no Google Play</h3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-4">
              Nossa aplicação Android oferece uma experiência ainda mais fluida para os clientes
              realizarem pedidos e acompanharem entregas diretamente pelo smartphone.
            </p>
            <a
              href="https://play.google.com/store/apps/details?id=com.foodpronto.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
            >
              <Smartphone size={16} />
              Ver no Google Play
              <ExternalLink size={13} />
            </a>
          </div>
        </section>

        {/* Vantagens */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-3">Por que escolher o Food Pronto?</h2>
            <p className="text-neutral-500 text-sm">
              Tudo pensado para simplificar, não complicar.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VANTAGENS.map((v) => (
              <div
                key={v.title}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-[#E24B4A]/10 flex items-center justify-center mb-4">
                  <v.icon size={20} className="text-[#E24B4A]" />
                </div>
                <h3 className="text-white font-semibold mb-2">{v.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#E24B4A]/20 to-orange-500/20 border border-[#E24B4A]/30 rounded-3xl p-10 text-center">
          <h2 className="text-white text-2xl font-bold mb-3">
            Pronto para modernizar seu estabelecimento?
          </h2>
          <p className="text-neutral-400 text-sm mb-7 max-w-lg mx-auto">
            Comece com 30 dias grátis, sem cartão de crédito. Em menos de 30 minutos você
            já está online.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/cadastro"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#E24B4A] to-orange-500 text-white px-8 py-3.5 rounded-full font-semibold hover:shadow-lg hover:shadow-[#E24B4A]/30 transition-all active:scale-95"
            >
              Começar grátis
            </Link>
            <Link
              href="/contato"
              className="inline-flex items-center gap-2 border border-neutral-700 text-neutral-300 px-8 py-3.5 rounded-full font-semibold hover:border-neutral-500 transition-colors"
            >
              Falar com a gente
            </Link>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800 bg-neutral-950 py-10 px-6 text-center">
        <div className="flex items-center justify-center gap-2 text-white font-bold text-lg tracking-tight mb-5">
          <Utensils size={20} className="text-[#E24B4A]" />
          <span>Food Pronto</span>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-neutral-500 mb-6">
          <Link href="/" className="hover:text-neutral-300 transition-colors">Início</Link>
          <Link href="/planos" className="hover:text-neutral-300 transition-colors">Planos</Link>
          <Link href="/quem-somos" className="hover:text-neutral-300 transition-colors text-neutral-300">Quem Somos</Link>
          <Link href="/contato" className="hover:text-neutral-300 transition-colors">Contato</Link>
          <Link href="/termos" className="hover:text-neutral-300 transition-colors">Termos de Uso</Link>
          <Link href="/privacidade" className="hover:text-neutral-300 transition-colors">Privacidade</Link>
          <Link href="/trabalhe-conosco" className="hover:text-neutral-300 transition-colors">Trabalhe Conosco</Link>
        </nav>
        <p className="text-xs text-neutral-600">
          &copy; {new Date().getFullYear()} Cardápio Foodpronto. Todos os direitos reservados.
        </p>
        <p className="text-xs text-neutral-700 mt-1">CNPJ 64.465.357/0001-28</p>
      </footer>
    </div>
  );
}
