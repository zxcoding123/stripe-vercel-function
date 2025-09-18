// /api/create-verification.js
import Stripe from "stripe";

if (process.env.NODE_ENV !== "production") {
  const dotenv = await import("dotenv");
  dotenv.config();
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ error: "Missing sessionId" });
    }

    // 1. Get checkout session
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    // 2. Create verification session
    const verificationSession = await stripe.identity.verificationSessions.create({
      type: "document",
      metadata: { customer_email: checkoutSession.customer_email },
      return_url: "https://stripe-vercel-function.vercel.app//verification-success",
    });

    // 3. Return verification link
    res.status(200).json({ url: verificationSession.url });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
}
