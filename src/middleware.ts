import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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
  "/api(.*)",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    // Pour les routes admin, rediriger vers /entrar avec redirect_url=/admin
    if (isAdminRoute(req)) {
      await auth.protect({
        unauthenticatedUrl: `${req.nextUrl.origin}/entrar?redirect_url=/admin`,
      });
    } else {
      await auth.protect({
        unauthenticatedUrl: `${req.nextUrl.origin}/entrar`,
      });
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
