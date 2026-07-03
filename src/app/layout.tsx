import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { Toaster } from "sonner";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cardápio Foodpronto — Cardápio Digital para Restaurantes",
  description:
    "Plataforma SaaS de cardápio digital e gestão completa para restaurantes, bares, cafeterias e food trucks brasileiros.",
  keywords: ["cardápio digital", "qr code restaurante", "sistema restaurante", "comanda digital"],
  metadataBase: new URL("https://cardapio.foodpronto.com.br"),
  openGraph: {
    title: "Cardápio Foodpronto — Seu restaurante no digital em 30 minutos",
    description: "Cardápio digital via QR Code, gestão de pedidos, mesas, cozinha e relatórios. 30 dias grátis.",
    url: "https://cardapio.foodpronto.com.br",
    siteName: "Cardápio Foodpronto",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Cardápio Foodpronto — Cardápio Digital para Restaurantes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cardápio Foodpronto — Seu restaurante no digital em 30 minutos",
    description: "Cardápio digital via QR Code, gestão de pedidos, mesas e cozinha. 30 dias grátis.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      localization={ptBR}
      appearance={{
        variables: {
          colorPrimary: "#E24B4A",
          colorBackground: "#ffffff",
          borderRadius: "8px",
        },
      }}
    >
      <html lang="pt-BR">
        <head>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-SWXR14S8Z6"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-SWXR14S8Z6');
            `}
          </Script>
        </head>
        <body className={inter.className}>
          <ConvexClientProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: { fontFamily: inter.style.fontFamily },
              }}
            />
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
