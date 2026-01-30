import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

/** Inicializa Stripe solo en runtime para no fallar el build cuando faltan env vars. */
function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key || key === "") return null;
  return new Stripe(key, { apiVersion: "2025-02-24.acacia" });
}

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe no configurado. Configura STRIPE_SECRET_KEY en Vercel." },
        { status: 500 }
      );
    }
    const { documentId, price, saveToAccount } = await request.json();
    const origin = request.headers.get("origin") || "";
    const successBase = `${origin}/documentos/${documentId}/success?session_id={CHECKOUT_SESSION_ID}`;
    const successUrl = saveToAccount ? `${successBase}&save=1` : successBase;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "mxn",
            product_data: {
              name: `Documento Legal: ${documentId}`,
              description: saveToAccount
                ? "Generación de documento legal con IA + guardado permanente en Mi cuenta"
                : "Generación de documento legal con IA",
            },
            unit_amount: price, // cliente envía centavos
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: `${origin}/documentos/${documentId}`,
      metadata: {
        documentId,
        saveToAccount: saveToAccount ? "1" : "0",
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
