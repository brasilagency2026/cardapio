# 🍽️ Cardápio Foodpronto

Plataforma SaaS de cardápio digital e gestão completa para restaurantes brasileiros.

## Stack tecnológica

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 15 + React 19 + TypeScript |
| Estilização | TailwindCSS + Shadcn UI |
| Autenticação | Clerk (multi-tenant via Organizations) |
| Banco de dados | Convex (reativo, tempo real) |
| Upload de imagens | AWS S3 |
| Pagamentos | Mercado Pago Assinaturas |
| Deploy | Vercel (frontend) + Convex Cloud (backend) |

---

## Planos disponíveis

### 🟥 Cardápio Digital — R$ 50/mês
- Cardápio via QR Code ou NFC
- Categorias e produtos ilimitados
- Fotos e galeria
- URL própria + SEO

### 🟦 Restaurante Smart — R$ 200/mês
- Tudo do Cardápio Digital
- Pedidos digitais pela mesa
- Comanda digital
- Gestão de mesas (FREE / OCCUPIED / WAITING_PAYMENT / RESERVED)
- Painel de cozinha KDS (tela cheia)
- Painel do garçom com alertas
- Controle de pagamentos (PIX, Crédito, Débito, Dinheiro)
- Dashboard + Relatórios
- Notificações em tempo real

---

## Instalação e configuração

### 1. Clone e instale dependências

```bash
git clone https://github.com/seu-usuario/cardapio-foodpronto
cd cardapio-foodpronto
npm install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env.local
```

Preencha todas as variáveis no `.env.local`.

### 3. Configure o Clerk

1. Crie uma conta em [clerk.com](https://clerk.com)
2. Crie um novo projeto
3. Ative **Organizations** (Settings → Organizations)
4. Configure os roles: `OWNER`, `MANAGER`, `WAITER`, `KITCHEN`
5. Copie as chaves para o `.env.local`

### 4. Configure o Convex

```bash
npx convex dev
```

Isso cria o projeto no Convex e gera o `NEXT_PUBLIC_CONVEX_URL`.

### 5. Rode em desenvolvimento

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## Estrutura do projeto

```
cardapio-foodpronto/
├── convex/                    # Backend Convex
│   ├── schema.ts              # Schema completo (todas as tabelas)
│   ├── restaurants.ts         # Queries/mutations restaurantes
│   ├── products.ts            # Categorias e produtos
│   ├── tables.ts              # Mesas
│   ├── tabs.ts                # Comandas
│   ├── orders.ts              # Pedidos + relatórios
│   └── _generated/            # Gerado automaticamente pelo Convex
│
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Layout raiz (Clerk + Convex providers)
│   │   ├── dashboard/         # Painel administrativo
│   │   │   ├── layout.tsx     # Sidebar de navegação
│   │   │   ├── page.tsx       # Dashboard principal
│   │   │   ├── tables/        # Gestão de mesas
│   │   │   ├── menu/          # Gestão de cardápio
│   │   │   ├── orders/        # Listagem de pedidos
│   │   │   └── reports/       # Relatórios
│   │   ├── kitchen/           # Painel da cozinha (KDS)
│   │   │   └── page.tsx
│   │   ├── waiter/            # Painel do garçom
│   │   │   └── page.tsx
│   │   └── menu/              # Cardápio público (cliente)
│   │       └── [slug]/[table]/page.tsx
│   │
│   ├── components/
│   │   ├── providers/
│   │   │   └── convex-provider.tsx
│   │   └── shared/
│   │       ├── order-status-badge.tsx
│   │       └── table-status-badge.tsx
│   │
│   └── lib/
│       └── utils.ts           # Helpers (formatCurrency, slugify...)
```

---

## Fluxo de pedido

```
Cliente (QR Code)
    └─→ Seleciona produtos → Confirma pedido
          └─→ [Convex] orders.create() → status: PENDING
                └─→ Notificação em tempo real → Cozinha
                      └─→ ACCEPTED → PREPARING → READY
                            └─→ Alerta para garçom
                                  └─→ DELIVERED
                                        └─→ Cliente solicita conta
                                              └─→ Mesa: WAITING_PAYMENT
                                                    └─→ Garçom recebe pagamento
                                                          └─→ tabs.close() → Mesa: FREE
```

---

## Multi-tenancy

Cada restaurante é uma **Clerk Organization**. O `clerkOrgId` é o `tenantId` que isola todos os dados no Convex. Não há compartilhamento de dados entre restaurantes.

---

## Deploy

### Vercel (frontend)
```bash
vercel deploy
```

### Convex (backend)
```bash
npx convex deploy
```

---

## Roadmap

- [x] Autenticação multi-tenant (Clerk)
- [x] Schema completo (Convex)
- [x] Cardápio público (QR Code)
- [x] Painel da cozinha (KDS)
- [x] Painel do garçom
- [x] Dashboard com métricas
- [ ] Gestão de mesas (CRUD)
- [ ] Gestão de produtos (CRUD + upload S3)
- [ ] Relatórios avançados
- [ ] Integração Mercado Pago
- [ ] Notificações sonoras (Web Audio API)
- [ ] PWA (instalável no celular)
- [ ] Programa de fidelidade
- [ ] Delivery
- [ ] Integração iFood
