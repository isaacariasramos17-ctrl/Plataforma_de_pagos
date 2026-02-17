"use server";

import type { Stripe } from "stripe";
import { headers } from "next/headers";
import { CURRENCY } from "@/app/Config/index";
import { formatAmountForStripe } from "@/app/utils/stripe-helpers";
import { stripe } from "@/app/Lib/stripe";

export async function createCheckoutSession(
  data: FormData,
): Promise<{ client_secret: string | null; url: string | null }> {
  const ui_mode = (data.get("uiMode") as Stripe.Checkout.SessionCreateParams.UiMode) || "hosted";
  const headerList = await headers();
  const origin = headerList.get("origin") as string;
  const amount = Number(data.get("customDonation") as string);

  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.create({
      mode: "payment",
      submit_type: "donate",
      ui_mode,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: CURRENCY,
            product_data: {
              name: "Custom amount donation",
            },
            unit_amount: formatAmountForStripe(amount, CURRENCY),
          },
        },
      ],
      ...(ui_mode === "hosted" ? {
        success_url: `${origin}/donate/components/with-checkout/result?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/donate/components/with-checkout`,
      } : {
        return_url: `${origin}/donate/components/with-embedded-checkout/result?session_id={CHECKOUT_SESSION_ID}`,
      }),
    });

  return {
    client_secret: checkoutSession.client_secret,
    url: checkoutSession.url,
  };
}

export async function createPaymentIntent(
  data: FormData,
): Promise<{ client_secret: string }> {
  const amount = Number(data.get("customDonation") as string);

  const paymentIntent: Stripe.PaymentIntent =
    await stripe.paymentIntents.create({
      amount: formatAmountForStripe(amount, CURRENCY),
      automatic_payment_methods: { enabled: true },
      currency: CURRENCY,
    });

  if (!paymentIntent.client_secret) {
    throw new Error("No se pudo crear el Client Secret del Payment Intent");
  }

  return { client_secret: paymentIntent.client_secret };
}