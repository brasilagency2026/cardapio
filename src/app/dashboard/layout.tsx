"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";
import {
  LayoutDashboardIcon,
  TableIcon,
  ShoppingBagIcon,
  ChefHatIcon,
  UtensilsIcon,
  BarChart3Icon,
  MenuIcon,
  QrCodeIcon,
  SettingsIcon,
  TagIcon,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Início", icon: LayoutDashboardIcon },
  { href: "/dashboard/tables", label: "Mesas", icon: TableIcon },
  { href: "/dashboard/orders", label: "Pedidos", icon: ShoppingBagIcon },
  { href: "/dashboard/menu", label: "Cardápio", icon: MenuIcon },
  { href: "/kitchen", label: "Cozinha (KDS)", icon: ChefHatIcon },
  { href: "/waiter", label: "Garçom", icon: UtensilsIcon },
  { href: "/dashboard/reports", label: "Relatórios", icon: BarChart3Icon },
  { href: "/dashboard/settings", label: "Configurações", icon: SettingsIcon },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-100 flex flex-col shrink-0">
        {/* Logo */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <UtensilsIcon className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900 text-sm">
              Cardápio <span className="text-red-500">Foodpronto</span>
            </span>
          </div>
        </div>

        {/* Org switcher */}
        <div className="px-4 py-3 border-b border-gray-100">
          <OrganizationSwitcher
            hidePersonal
            appearance={{
              elements: {
                rootBox: "w-full",
                organizationSwitcherTrigger:
                  "w-full justify-start text-sm rounded-lg px-2 py-1.5 hover:bg-gray-50",
              },
            }}
          />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-red-50 text-red-600 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-gray-100 flex items-center gap-3">
          <UserButton
            appearance={{
              elements: { avatarBox: "w-8 h-8" },
            }}
          />
          <span className="text-xs text-gray-500">Minha conta</span>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
