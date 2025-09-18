// /pages/api/check-verification.js
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ error: 'Missing session_id parameter' });
  }

  try {
    // Retrieve the Stripe Identity Verification Session
    const verificationSession = await stripe.identity.verificationSessions.retrieve(session_id);

    // Return only the status
    res.status(200).json({ status: verificationSession.status });
  } catch (error) {
    console.error('Error retrieving verification session:', error);
    res.status(500).json({ error: error.message });
  }
}
