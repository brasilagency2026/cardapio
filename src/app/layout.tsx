import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cardápio Foodpronto — Cardápio Digital para Restaurantes",
  description:
    "Plataforma SaaS de cardápio digital e gestão completa para restaurantes, bares, cafeterias e food trucks brasileiros.",
  keywords: ["cardápio digital", "qr code restaurante", "sistema restaurante", "comanda digital"],
  openGraph: {
    title: "Cardápio Foodpronto",
    description: "Cardápio digital e gestão completa para o seu restaurante",
    url: "https://foodpronto.com.br",
    siteName: "Cardápio Foodpronto",
    locale: "pt_BR",
    type: "website",
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
