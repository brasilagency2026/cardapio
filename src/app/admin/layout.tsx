"use client";

import { useUser, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldIcon,
  BuildingIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  CreditCardIcon,
} from "lucide-react";

const SUPER_ADMIN_EMAIL = "glwebagency2@gmail.com";

const NAV = [
  { href: "/admin", label: "Visão Geral", icon: LayoutDashboardIcon },
  { href: "/admin/restaurantes", label: "Restaurantes", icon: BuildingIcon },
  { href: "/admin/assinaturas", label: "Assinaturas", icon: CreditCardIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const email = user?.primaryEmailAddress?.emailAddress;

  useEffect(() => {
    if (!isLoaded) return;
    if (!user || email !== SUPER_ADMIN_EMAIL) {
      router.replace("/entrar");
    }
  }, [isLoaded, user, email, router]);

  if (!isLoaded || !user || email !== SUPER_ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-neutral-400 text-sm flex items-center gap-2">
          <ShieldIcon className="w-4 h-4" />
          Verificando permissões...
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-300">
      {/* Sidebar */}
      <aside className="w-56 bg-neutral-900 border-r border-neutral-800 flex flex-col shrink-0">
        {/* Logo */}
        <div className="px-5 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#E24B4A] rounded-lg flex items-center justify-center">
              <ShieldIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Super Admin</p>
              <p className="text-neutral-500 text-xs">Foodpronto</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-[#E24B4A]/20 text-[#E24B4A] font-medium"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-neutral-800 flex items-center gap-3">
          <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
          <div className="min-w-0">
            <p className="text-xs text-neutral-300 truncate">{email}</p>
            <p className="text-xs text-neutral-600">Super Admin</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto bg-neutral-950">{children}</main>
    </div>
  );
}
