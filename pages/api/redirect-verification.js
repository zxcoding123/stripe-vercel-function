import Stripe from "stripe";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  try {
    const { session_id, product_name } = req.query;

    if (!session_id) return res.status(400).send("Missing session_id");
    if (!product_name) return res.status(400).send("Missing product_name");

    // 1. Retrieve the checkout session
    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

    // 2. Create the verification session
    const verificationSession = await stripe.identity.verificationSessions.create({
      type: "document",
      customer: checkoutSession.customer || undefined,
      metadata: {
        email: checkoutSession.customer_email || checkoutSession.customer_details?.email,
        product: product_name,
      },
      // Stripe will automatically append ?verification_session=vs_xxx
      return_url: `https://stripe-vercel-function.vercel.app/verification-complete?product=${encodeURIComponent(
        product_name
      )}`,
    });

    // 3. Send confirmation email via Resend
    if (checkoutSession.customer_details?.email) {
      await resend.emails.send({
        from: "no-reply@gettaxreliefnow.com",
        to: checkoutSession.customer_details.email,
        subject: `Your Purchase Confirmation: ${product_name}`,
        html: `
          <h2>Thank you for your purchase!</h2>
          <p>Product: ${product_name}</p>
          <p>Amount: ${(checkoutSession.amount_total / 100).toFixed(2)} ${checkoutSession.currency.toUpperCase()}</p>
          <p>Refunds available within 7 days.</p>
          <p>Please complete your identity verification by clicking below:</p>
          <a href="${verificationSession.url}" style="display:inline-block;padding:10px 20px;background:#635bff;color:white;text-decoration:none;border-radius:5px;">
            Start Identity Verification
          </a>
        `,
      });
    }

    // 4. Redirect immediately to Stripe Identity Verification
    res.writeHead(302, { Location: verificationSession.url });
    res.end();
  } catch (err) {
    console.error("redirect-verification error:", err);
    res.status(500).json({ error: err.message });
  }
}
