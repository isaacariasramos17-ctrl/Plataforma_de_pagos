import type { Stripe } from "stripe";

import PrintObject from "@/app/donate/components/PrintObject";
import { stripe } from "@/app/Lib/stripe";
import { JSX } from "react/jsx-runtime";

export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<{ payment_intent?: string }>; // ✅ Es una Promise
}): Promise<JSX.Element> {
  // ✅ IMPORTANTE: Await searchParams
  const params = await searchParams;
  
  if (!params.payment_intent) {
    throw new Error("Please provide a valid payment_intent (`pi_...`)");
  }

  const paymentIntent: Stripe.PaymentIntent =
    await stripe.paymentIntents.retrieve(params.payment_intent);

  return (
    <>
      <h2>Status: {paymentIntent.status}</h2>
      <h3>Payment Intent response:</h3>
      <PrintObject content={paymentIntent} />
    </>
  );
}