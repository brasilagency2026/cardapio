import { SignIn } from "@clerk/nextjs";
import { Suspense } from "react";

function SignInContent() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-50 p-4">
      <SignIn
        path="/entrar"
        routing="path"
        signUpUrl="/cadastro"
        forceRedirectUrl="/auth/redirect"
      />
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-50" />}>
      <SignInContent />
    </Suspense>
  );
}
