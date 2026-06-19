import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isPublicRoute = createRouteMatcher([
  "/",
  "/entrar(.*)",
  "/cadastro(.*)",
  "/planos(.*)",
  "/contato(.*)",
  "/termos(.*)",
  "/privacidade(.*)",
  "/quem-somos(.*)",
  "/menu(.*)",
  "/:slug",
]);

const SUPER_ADMIN_EMAIL = "glwebagency2@gmail.com";

export default clerkMiddleware(async (auth, req) => {
  // Rotas admin: exige autenticação
  if (isAdminRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
