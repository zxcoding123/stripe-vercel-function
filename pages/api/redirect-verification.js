import Stripe from "stripe";
import { Resend } from "resend";
import { createSession } from '../../lib/session';

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
      return_url: `https://stripe-vercel-function.vercel.app/verification-complete`,
    });

    // 3. Create a server-side session with the verification data
    const sessionData = {
      verificationSessionId: verificationSession.id,
      product: product_name,
      email: checkoutSession.customer_email || checkoutSession.customer_details?.email,
      createdAt: Date.now()
    };

    const sealedSession = await createSession(sessionData);

    // 4. Set the session as a cookie
    res.setHeader('Set-Cookie', `verification_session=${sealedSession}; Path=/; HttpOnly; Secure; SameSite=Lax`);

    // 5. Send comprehensive confirmation email via Resend
    if (checkoutSession.customer_details?.email) {
      await resend.emails.send({
        from: "Get Tax Relief Now <donotreply@updates.gettaxreliefnow.com>",
        to: checkoutSession.customer_details.email,
        subject: `Your Purchase Confirmation: ${product_name}`,
        html: `
  <html>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6; background-color: #f9fafb; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        
        <h1 style="color: #635bff;">Thank You for Your Purchase!</h1>
        <p>Hello ${checkoutSession.customer_details.name || ''},</p>
        <p>We’ve successfully received your order. Below is a summary of your purchase, refund policy, and the next steps to complete your process.</p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />

        <h2 style="color: #635bff;">Purchase Summary</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">Product</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">${product_name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">Amount Paid</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">${(checkoutSession.amount_total / 100).toFixed(2)} ${checkoutSession.currency.toUpperCase()}</td>
          </tr>
          <tr>
            <td style="padding: 8px;">Payment Method</td>
            <td style="padding: 8px; font-weight: bold;">${checkoutSession.payment_method_types.join(', ')}</td>
          </tr>
        </table>

        <h2 style="color: #635bff;">Refund Details</h2>
        <p>Refunds are available within <strong>7 days</strong> of your purchase. If you need a refund, please contact our support team at <a href="mailto:support@gettaxreliefnow.com" style="color: #635bff;">support@gettaxreliefnow.com</a>.</p>
        
        <h2 style="color: #635bff;">Next Steps</h2>
        <ol>
          <li>Click the button below to start your identity verification.</li>
          <li>Complete the verification process on Stripe’s secure portal.</li>
          <li>Once verified, your request will be processed within 3–5 business days.</li>
          <li>You will receive a confirmation email when your process is complete.</li>
        </ol>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationSession.url}" style="display:inline-block;padding:15px 30px;background:#635bff;color:white;font-weight:bold;text-decoration:none;border-radius:8px;font-size:16px;">
            Start Identity Verification
          </a>
        </div>

        <p style="font-size: 12px; color: #888;">If the button above does not work, copy and paste this URL into your browser: <br /> <a href="${verificationSession.url}" style="color: #635bff;">${verificationSession.url}</a></p>
        
        <p style="color:#555;">Thank you for trusting <strong>Get Tax Relief Now</strong>.</p>
      </div>
    </body>
  </html>
  `,
      });

    }

    // 6. Redirect immediately to Stripe Identity Verification
    res.writeHead(302, { Location: verificationSession.url });
    res.end();
  } catch (err) {
    console.error("redirect-verification error:", err);
    res.status(500).json({ error: err.message });
  }
}
