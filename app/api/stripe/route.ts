import Stripe from "stripe";
import { NextResponse } from "next/server";

const PRO_AMOUNT_CENTS = 4700;

export async function POST(request: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
    if (
      !secretKey ||
      secretKey === "sua_chave_aqui" ||
      secretKey === "sua_chave_sk_que_ja_tem"
    ) {
      return NextResponse.json(
        { error: "STRIPE_SECRET_KEY não configurada." },
        { status: 500 }
      );
    }

    const origin =
      request.headers.get("origin") ??
      process.env.NEXT_PUBLIC_APP_URL ??
      "http://localhost:3000";

    const stripe = new Stripe(secretKey);
    const priceId = process.env.STRIPE_PRO_PRICE_ID?.trim();

    const lineItems =
      priceId
        ? [{ price: priceId, quantity: 1 }]
        : [
            {
              price_data: {
                currency: "brl",
                unit_amount: PRO_AMOUNT_CENTS,
                recurring: { interval: "month" as const },
                product_data: {
                  name: "Trendify Pro",
                  description: "Clips ilimitados + AI Trends",
                },
              },
              quantity: 1,
            },
          ];

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${origin}/pricing?success=true`,
      cancel_url: `${origin}/pricing?canceled=true`,
      metadata: {
        plan: "pro",
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Não foi possível criar a sessão de checkout." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[stripe]", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao iniciar checkout.",
      },
      { status: 500 }
    );
  }
}
