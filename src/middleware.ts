import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

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
  "/api(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect({
      unauthenticatedUrl: `${req.nextUrl.origin}/entrar`,
    });
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
