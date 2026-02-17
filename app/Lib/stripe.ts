import "server-only";
import Stripe from "stripe";

// Validamos que la clave exista para evitar errores en tiempo de ejecución
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("ERROR: STRIPE_SECRET_KEY no está configurada en .env.local");
}

export const stripe = new Stripe(stripeSecretKey, {
  // Versión exacta que te solicita el compilador de TypeScript
  apiVersion: "2026-01-28.clover",
  appInfo: {
    name: "nextjs-with-stripe-typescript-demo",
    version: "0.1.0",
    url: "https://nextjs-with-stripe-typescript-demo.vercel.app",
  },
  typescript: true,
});