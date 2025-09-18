import Stripe from "stripe";

if (process.env.NODE_ENV !== "production") {
  const dotenv = await import("dotenv");
  dotenv.config();
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  try {
    const { session_id } = req.query;
    if (!session_id) return res.status(400).send("Missing session_id");

    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

  

    
    const verificationSession = await stripe.identity.verificationSessions.create({
      type: "document",
      customer: checkoutSession.customer || undefined,
      metadata: checkoutSession.customer_email ? { email: checkoutSession.customer_email } : undefined,
      return_url: `http://localhost:3000/verification-complete?verification_session=${verificationSession.id}`
    });


    res.writeHead(302, { Location: verificationSession.url });
    res.end();

  } catch (err) {
    console.error("redirect-verification error:", err);
    res.status(500).json({ error: err.message });
  }
}
