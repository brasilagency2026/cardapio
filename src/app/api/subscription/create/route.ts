import { NextRequest, NextResponse } from "next/server";

const MP_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN!;

const PLAN_CONFIG = {
  DIGITAL_MENU: {
    reason: "Foodpronto – Cardápio Digital",
    transaction_amount: 40.0,
  },
  RESTAURANT_SMART: {
    reason: "Foodpronto – Gestão Completa",
    transaction_amount: 89.0,
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { plan, restaurantId, payerEmail } = body as {
      plan: "DIGITAL_MENU" | "RESTAURANT_SMART";
      restaurantId: string;
      payerEmail: string;
    };

    if (!plan || !restaurantId || !payerEmail) {
      return NextResponse.json(
        { error: "Parâmetros obrigatórios: plan, restaurantId, payerEmail" },
        { status: 400 }
      );
    }

    const config = PLAN_CONFIG[plan];
    if (!config) {
      return NextResponse.json({ error: "Plano inválido" }, { status: 400 });
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? "https://cardapio.foodpronto.com.br";

    const payload = {
      reason: config.reason,
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: config.transaction_amount,
        currency_id: "BRL",
      },
      payer_email: payerEmail,
      back_url: `${baseUrl}/dashboard/assinatura?status=success`,
      external_reference: JSON.stringify({ restaurantId, plan }),
      status: "pending",
    };

    const response = await fetch("https://api.mercadopago.com/preapproval", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Erro ao criar preapproval MP:", error);
      return NextResponse.json(
        { error: "Erro ao criar assinatura no Mercado Pago", detail: error },
        { status: 500 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      id: data.id,
      init_point: data.init_point, // URL de pagamento do MP
      status: data.status,
    });
  } catch (err) {
    console.error("Erro interno:", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
