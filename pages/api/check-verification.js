import Stripe from "stripe";
import { getSessionData } from '../../lib/session';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  try {
    // Get the session cookie
    const sessionCookie = req.cookies.verification_session;
    
    if (!sessionCookie) {
      return res.status(400).json({ error: "No verification session found" });
    }

    // Decrypt the session data
    const sessionData = await getSessionData(sessionCookie);
    
    // Check if session is expired (e.g., 1 hour)
    const sessionAge = Date.now() - sessionData.createdAt;
    if (sessionAge > 60 * 60 * 1000) {
      return res.status(400).json({ error: "Session expired" });
    }

    const session = await stripe.identity.verificationSessions.retrieve(
      sessionData.verificationSessionId
    );

    res.status(200).json({
      id: session.id,
      status: session.status,
      verified: session.status === "verified",
      product: sessionData.product, // Use product from session data
      email: sessionData.email,     // Use email from session data
    });
  } catch (err) {
    console.error("check-verification error:", err);
    res.status(500).json({ error: err.message });
  }
}