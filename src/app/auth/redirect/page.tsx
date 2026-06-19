"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Utensils } from "lucide-react";
import { Suspense } from "react";

const SUPER_ADMIN_EMAIL = "glwebagency2@gmail.com";

function RedirectHandler() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isLoaded || !user) return;

    const email = user.primaryEmailAddress?.emailAddress;
    const redirectUrl = searchParams.get("redirect_url");

    if (email === SUPER_ADMIN_EMAIL) {
      // Super admin → sempre vai para /admin
      router.replace("/admin");
    } else if (redirectUrl && redirectUrl.startsWith("/")) {
      router.replace(redirectUrl);
    } else {
      router.replace("/dashboard");
    }
  }, [isLoaded, user, router, searchParams]);

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 bg-[#E24B4A] rounded-xl flex items-center justify-center">
        <Utensils className="w-5 h-5 text-white" />
      </div>
      <div className="w-6 h-6 border-2 border-[#E24B4A] border-t-transparent rounded-full animate-spin" />
      <p className="text-neutral-500 text-sm">Redirecionando...</p>
    </div>
  );
}

export default function AuthRedirectPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#E24B4A] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <RedirectHandler />
    </Suspense>
  );
}
