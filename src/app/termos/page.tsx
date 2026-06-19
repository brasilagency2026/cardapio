import Link from "next/link";
import { Utensils, Shield, AlertTriangle, Bot, CheckCircle, XCircle, Info } from "lucide-react";

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-neutral-800 bg-neutral-950 sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 text-[#E24B4A] font-bold text-xl tracking-tight">
          <Utensils size={26} />
          <span>Food Pronto</span>
        </Link>
        <Link
          href="/cadastro"
          className="text-sm font-semibold bg-[#E24B4A] text-white px-5 py-2 rounded-full hover:bg-[#c93f3e] transition-all"
        >
          Começar Grátis
        </Link>
      </header>

      {/* Hero */}
      <div className="text-center pt-16 pb-10 px-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800 text-neutral-400 text-xs font-medium mb-6">
          <Shield size={12} />
          Documento Legal
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight text-white mb-3">
          Termos de Uso
        </h1>
        <p className="text-neutral-500 text-sm">Última atualização: 19 de junho de 2025</p>
      </div>

      {/* Conteúdo */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 pb-20 space-y-12">

        {/* 1. Identificação */}
        <section>
          <SectionTitle number="1" title="Identificação da Empresa" />
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {[
                  ["Razão Social", "GERALD DAVID MICHEL LEVESQUE"],
                  ["CNPJ", "64.465.357/0001-28"],
                  ["Tipo", "Microempreendedor Individual (MEI)"],
                  ["Localização", "Guarujá – SP, Brasil"],
                  ["Contato", "contato@foodpronto.com.br"],
                ].map(([label, value], i) => (
                  <tr key={label} className={i % 2 === 0 ? "bg-neutral-900" : "bg-neutral-800/40"}>
                    <td className="px-5 py-3 text-neutral-500 font-medium w-40">{label}</td>
                    <td className="px-5 py-3 text-neutral-200">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 2. Natureza do Produto */}
        <section>
          <SectionTitle number="2" title="Natureza do Produto" />
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#E24B4A]/20 flex items-center justify-center shrink-0 mt-0.5">
              <Bot size={20} className="text-[#E24B4A]" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">Aplicação desenvolvida 100% por Inteligência Artificial.</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                O Food Pronto é um produto digital desenvolvido integralmente com ferramentas de inteligência
                artificial. A empresa comercializa o acesso a esta plataforma e não é distribuidora direta de produtos
físicos, sem participação no processo de desenvolviment de código fonte da aplicação.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Limitação de Responsabilidade */}
        <section>
          <SectionTitle number="3" title="Limitação de Responsabilidade Técnica" />
          <div className="bg-neutral-900 border border-amber-500/30 rounded-2xl p-6 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                <AlertTriangle size={18} className="text-amber-400" />
              </div>
              <p className="text-amber-300 font-semibold text-sm">A empresa comercializadora não se responsabiliza por:</p>
            </div>
            <ul className="space-y-2 text-sm text-neutral-400 pl-2">
              {[
                "Falhas técnicas, bugs ou interrupções no funcionamento da aplicação",
                "Perda de dados, interrupção ou informações incorretas do banco de dados",
                "Indisponibilidade temporária ou definitiva da plataforma",
                "Problemas de integração com serviços de terceiros (Mercado Pago, Convex, etc.)",
                "Danos diretos ou indiretos causados pelo uso ou impossibilidade de uso da sistema",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-neutral-600 mt-1">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-neutral-500 text-sm leading-relaxed">
            Por tratar-se de um produto de tecnologia desenvolvido por Inteligência Artificial, o contratante está ciente
            de que eventuais falhas fazem parte da natureza do produto e que a empresa comercializadora
            não dispõe de equipe de desenvolvimento para corrigi-las.
          </p>
        </section>

        {/* 4. Escopo do Serviço */}
        <section>
          <SectionTitle number="4" title="Escopo do Serviço Comercializado" />
          <p className="text-neutral-400 text-sm mb-4 leading-relaxed">
            A contratação do Food Pronto abrange exclusivamente o <strong className="text-white">acesso e uso da plataforma digital</strong> durante o
            prazo da assinatura ativa. Não estão expressamente incluídos os serviços:
          </p>
          <ul className="space-y-2 text-sm text-neutral-400 mb-6 pl-2">
            {[
              { text: "Desenvolvimento de modificações no código-fonte da aplicação", highlight: false },
              { text: "Customizações de quaisquer recursos, funcionalidades ou integrações", highlight: false },
              { text: "Adaptações específicas por solicitação do contratante", highlight: false },
              { text: "Garantia de novos recursos em versões futuras", highlight: false },
            ].map((item) => (
              <li key={item.text} className="flex items-start gap-2">
                <span className="text-neutral-600 mt-1">—</span>
                {item.text}
              </li>
            ))}
          </ul>
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-5 flex gap-4">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <Info size={16} className="text-blue-400" />
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed">
              <strong className="text-white">Nenhuma modificação pode ser solicitada.</strong> A empresa comercializadora não aceita nem se
              compromete a realizar qualquer alteração no código do produto, personalizações ou validação.
            </p>
          </div>
        </section>

        {/* 5. Suporte */}
        <section>
          <SectionTitle number="5" title="Suporte Disponível" />
          <p className="text-neutral-400 text-sm mb-5 leading-relaxed">
            O único suporte oferecido para o plano comercializado tem um caráter <strong className="text-white">educacional</strong>, destinando-se a
            orientar o contratante sobre como utilizar as funcionalidades da plataforma.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-neutral-900 border border-green-500/30 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={16} className="text-green-400" />
                <span className="text-green-400 font-semibold text-sm">Suporte incluso</span>
              </div>
              <ul className="space-y-1.5 text-xs text-neutral-400">
                <li>— Orientação sobre como usar os recursos da plataforma</li>
                <li>— Esclarecimento de dúvidas via WhatsApp ou e-mail</li>
              </ul>
            </div>
            <div className="bg-neutral-900 border border-red-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <XCircle size={16} className="text-red-400" />
                <span className="text-red-400 font-semibold text-sm">Não incluso</span>
              </div>
              <ul className="space-y-1.5 text-xs text-neutral-400">
                <li>— Criação de novas funcionalidades ou integrações</li>
                <li>— Resolução de bugs ou problemas técnicos da plataforma</li>
                <li>— Personalização visual ou estrutural</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 6. Contrato e Faturamento */}
        <section>
          <SectionTitle number="6" title="Contrato e Faturamento" />
          <p className="text-neutral-400 text-sm leading-relaxed mb-3">
            Ao contratar o Food Pronto o cliente assina um <strong className="text-white">contrato de venda de produto digital</strong> faturado como
            fatura diretamente pelo <strong className="text-white">Mercado Pago</strong>. Este documento formaliza a relação comercial, os valores
            acordados e as condições de uso descritas nestes Termos.
          </p>
          <p className="text-neutral-400 text-sm leading-relaxed">
            Em caso de falha no serviço pelo Mercado Pago a empresa se compromete a abrir um chamado em todos os meios
            eletrônicos, sem necessidade de solicitação adicional.
          </p>
        </section>

        {/* 7. Serviços de Terceiros */}
        <section>
          <SectionTitle number="7" title="Serviços de Terceiros" />
          <p className="text-neutral-400 text-sm leading-relaxed">
            O Food Pronto utiliza serviços de terceiros para seu funcionamento, incluindo mas não se limitando
            a <strong className="text-white">Mercado Pago</strong> (pagamentos), <strong className="text-white">Convex</strong> (banco de dados em tempo real)
            e serviços de hospedagem em nuvem. A empresa comercializadora não se responsabiliza por falhas, mudanças de política ou
            descontinuação desses serviços por parte de seus respectivos fornecedores.
          </p>
        </section>

        {/* 8. Cancelamento */}
        <section>
          <SectionTitle number="8" title="Cancelamento" />
          <p className="text-neutral-400 text-sm leading-relaxed">
            O contratante pode solicitar o cancelamento da assinatura a qualquer momento, sem fidelidade contratual,
            mediante aviso pelo WhatsApp ou e-mail. Não haverá reembolso de valores já pagos referentes a períodos
            em curso. O acesso à plataforma será mantido até o fim do período contratado.
          </p>
        </section>

        {/* 9. Foro */}
        <section>
          <SectionTitle number="9" title="Foro" />
          <p className="text-neutral-400 text-sm leading-relaxed">
            Fica eleito o Foro da Comarca de Guarujá, Estado de São Paulo, para dirimir quaisquer controvérsias
            decorrentes destes Termos, com renúncia expressa a qualquer outro, por mais privilegiado que seja.
          </p>
        </section>

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
          <Link href="/termos" className="hover:text-neutral-300 transition-colors text-neutral-300">Termos de Uso</Link>
          <Link href="/privacidade" className="hover:text-neutral-300 transition-colors">Privacidade</Link>
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
      <span className="text-[#E24B4A] font-extrabold text-lg">{number}.</span>
      <h2 className="text-white text-xl font-bold">{title}</h2>
    </div>
  );
}
