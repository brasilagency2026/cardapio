"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-50 p-4">
      <SignUp path="/cadastro" routing="path" signInUrl="/entrar" fallbackRedirectUrl="/onboarding" />
    </div>
  );
}
