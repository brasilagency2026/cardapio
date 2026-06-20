import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-50 p-4">
      <SignIn
        path="/entrar"
        routing="path"
        signUpUrl="/cadastro"
        fallbackRedirectUrl="/auth/redirect"
      />
    </div>
  );
}
