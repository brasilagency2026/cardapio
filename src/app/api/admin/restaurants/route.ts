import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL!;
const SUPER_ADMIN_EMAIL = "glwebagency2@gmail.com";

async function checkAdmin() {
  const { userId } = await auth();
  if (!userId) return false;
  // On vérifie via Clerk backend
  const { clerkClient } = await import("@clerk/nextjs/server");
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const email = user.emailAddresses[0]?.emailAddress;
  return email === SUPER_ADMIN_EMAIL;
}

// GET — lista todos os restaurantes
export async function GET(req: NextRequest) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const res = await fetch(`${CONVEX_URL}/api/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      path: "restaurants:adminListAll",
      args: {},
      format: "json",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: 500 });
  }

  const data = await res.json();
  return NextResponse.json(data);
}

// PATCH — atualiza um restaurante
export async function PATCH(req: NextRequest) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const body = await req.json();

  const res = await fetch(`${CONVEX_URL}/api/mutation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      path: "restaurants:adminUpdatePlan",
      args: body,
      format: "json",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

// DELETE — remove um restaurante
export async function DELETE(req: NextRequest) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const { id } = await req.json();

  const res = await fetch(`${CONVEX_URL}/api/mutation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      path: "restaurants:adminDelete",
      args: { id },
      format: "json",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
