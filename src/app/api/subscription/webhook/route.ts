import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const MP_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data } = body;

    // Mercado Pago envia notificações de tipo "subscription_preapproval"
    if (type !== "subscription_preapproval" || !data?.id) {
      return NextResponse.json({ received: true });
    }

    // Buscar detalhes da assinatura no MP
    const mpResponse = await fetch(
      `https://api.mercadopago.com/preapproval/${data.id}`,
      {
        headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` },
      }
    );

    if (!mpResponse.ok) {
      console.error("Erro ao buscar preapproval:", await mpResponse.text());
      return NextResponse.json({ error: "Erro ao buscar assinatura" }, { status: 500 });
    }

    const preapproval = await mpResponse.json();
    const { status, external_reference, id: mpSubscriptionId } = preapproval;

    // external_reference = JSON.stringify({ restaurantId, plan })
    let restaurantId: string | null = null;
    try {
      const ref = JSON.parse(external_reference ?? "{}");
      restaurantId = ref.restaurantId ?? null;
    } catch {
      console.error("external_reference inválido:", external_reference);
      return NextResponse.json({ error: "external_reference inválido" }, { status: 400 });
    }

    if (!restaurantId) {
      return NextResponse.json({ error: "restaurantId não encontrado" }, { status: 400 });
    }

    // Mapear status MP → planStatus do app
    const statusMap: Record<string, "ACTIVE" | "CANCELLED" | "PAST_DUE"> = {
      authorized: "ACTIVE",
      cancelled: "CANCELLED",
      paused: "PAST_DUE",
    };

    const planStatus = statusMap[status];
    if (!planStatus) {
      // Status desconhecido — apenas logar
      console.log(`Status MP desconhecido: ${status} — ignorando`);
      return NextResponse.json({ received: true });
    }

    // Calcular próxima data de cobrança (30 dias a partir de agora se ativou)
    const nextBillingDate =
      planStatus === "ACTIVE"
        ? Date.now() + 30 * 24 * 60 * 60 * 1000
        : undefined;

    // Atualizar restaurante no Convex
    await convex.mutation(api.restaurants.updateSubscription, {
      restaurantId: restaurantId as any,
      planStatus,
      mpSubscriptionId,
      nextBillingDate,
    });

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
