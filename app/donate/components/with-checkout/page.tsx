import type { Stripe } from "stripe";

import PrintObject from "@/app/donate/components/PrintObject";
import { stripe } from "@/app/Lib/stripe";
import { JSX } from "react/jsx-runtime";

export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>; // ✅ Es una Promise
}): Promise<JSX.Element> {
  // ✅ IMPORTANTE: Await searchParams
  const params = await searchParams;
  
  if (!params.session_id) {
    throw new Error("Please provide a valid session_id (`cs_test_...`)");
  }

  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.retrieve(params.session_id, {
      expand: ["line_items", "payment_intent"],
    });

  const paymentIntent = checkoutSession.payment_intent as Stripe.PaymentIntent;

  return (
    <>
      <h2>Status: {paymentIntent.status}</h2>
      <h3>Checkout Session response:</h3>
      <PrintObject content={checkoutSession} />
    </>
  );
}