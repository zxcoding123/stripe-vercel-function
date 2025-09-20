"use strict";(()=>{var e={};e.id=982,e.ids=[982],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},4014:e=>{e.exports=import("iron-session")},6326:e=>{e.exports=import("resend")},6090:e=>{e.exports=import("stripe")},8:(e,t,o)=>{o.a(e,async(e,r)=>{try{o.r(t),o.d(t,{config:()=>p,default:()=>l,routeModule:()=>c});var i=o(1802),a=o(7153),s=o(6249),n=o(3155),d=e([n]);n=(d.then?(await d)():d)[0];let l=(0,s.l)(n,"default"),p=(0,s.l)(n,"config"),c=new i.PagesAPIRouteModule({definition:{kind:a.x.PAGES_API,page:"/api/redirect-verification",pathname:"/api/redirect-verification",bundlePath:"",filename:""},userland:n});r()}catch(e){r(e)}})},3155:(e,t,o)=>{o.a(e,async(e,r)=>{try{o.r(t),o.d(t,{default:()=>handler});var i=o(6090),a=o(6326),s=o(6713),n=e([i,a,s]);[i,a,s]=n.then?(await n)():n;let d=new i.default(process.env.STRIPE_SECRET_KEY),l=new a.Resend(process.env.RESEND_API_KEY);async function handler(e,t){try{let{session_id:o,product_name:r}=e.query;if(!o)return t.status(400).send("Missing session_id");if(!r)return t.status(400).send("Missing product_name");let i=await d.checkout.sessions.retrieve(o),a=await d.identity.verificationSessions.create({type:"document",customer:i.customer||void 0,metadata:{email:i.customer_email||i.customer_details?.email,product:r},return_url:"https://stripe-vercel-function.vercel.app/verification-complete"}),n={verificationSessionId:a.id,product:r,email:i.customer_email||i.customer_details?.email,createdAt:Date.now()},p=await (0,s.e)(n);t.setHeader("Set-Cookie",`verification_session=${p}; Path=/; HttpOnly; Secure; SameSite=Lax`),i.customer_details?.email&&await l.emails.send({from:"Get Tax Relief Now <donotreply@updates.gettaxreliefnow.com>",to:i.customer_details.email,subject:`Your Purchase Confirmation: ${r}`,html:`
        <html>
          <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6; background-color: #f9fafb; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
              
              <h1 style="color: #635bff;">Thank You for Your Purchase!</h1>
              <p>Hello ${i.customer_details.name||""},</p>
              <p>We’ve successfully received your order. Below is a summary of your purchase, refund policy, and the next steps to complete your process.</p>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />

              <h2 style="color: #444;">Purchase Summary</h2>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;">Product</td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">${r}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;">Amount Paid</td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">${(i.amount_total/100).toFixed(2)} ${i.currency.toUpperCase()}</td>
                </tr>
                <tr>
                  <td style="padding: 8px;">Payment Method</td>
                  <td style="padding: 8px; font-weight: bold;">${i.payment_method_types.join(", ")}</td>
                </tr>
              </table>

              <h2 style="color: #444;">Refund Details</h2>
              <p>Refunds are available within <strong>7 days</strong> of your purchase. If you need a refund, please contact our support team at <a href="mailto:support@gettaxreliefnow.com">support@gettaxreliefnow.com</a>.</p>
              
              <h2 style="color: #444;">Next Steps</h2>
              <ol>
                <li>Click the button below to start your identity verification.</li>
                <li>Complete the verification process on Stripe’s secure portal.</li>
                <li>Once verified, your request will be processed within 3–5 business days.</li>
                <li>You will receive a confirmation email when your process is complete.</li>
              </ol>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${a.url}" style="display:inline-block;padding:15px 30px;background:#635bff;color:white;font-weight:bold;text-decoration:none;border-radius:8px;font-size:16px;">
                  Start Identity Verification
                </a>
              </div>

              <p style="font-size: 12px; color: #888;">If the button above does not work, copy and paste this URL into your browser: <br /> <a href="${a.url}" style="color: #635bff;">${a.url}</a></p>
              
              <p style="color:#555;">Thank you for trusting <strong>Get Tax Relief Now</strong>.</p>
            </div>
          </body>
        </html>
        `}),t.writeHead(302,{Location:a.url}),t.end()}catch(e){console.error("redirect-verification error:",e),t.status(500).json({error:e.message})}}r()}catch(e){r(e)}})}};var t=require("../../webpack-api-runtime.js");t.C(e);var __webpack_exec__=e=>t(t.s=e),o=t.X(0,[222,713],()=>__webpack_exec__(8));module.exports=o})();