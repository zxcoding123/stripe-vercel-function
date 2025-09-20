import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  try {
    const { verification_session } = req.query;
    if (!verification_session) {
      return res.status(400).json({ error: "Missing verification_session" });
    }

    // 1. Retrieve the verification session from Stripe
    const session = await stripe.identity.verificationSessions.retrieve(
      verification_session
    );

    // 2. Respond with details (status + metadata)
    res.status(200).json({
      id: session.id,
      status: session.status,
      verified: session.status === "verified",
      product: session.metadata?.product,
      email: session.metadata?.email,
    });
  } catch (err) {
    console.error("check-verification error:", err);
    res.status(500).json({ error: err.message });
  }
}
