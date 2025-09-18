require('dotenv').config();
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function test() {
  try {
    const session = await stripe.checkout.sessions.retrieve('cs_test_a1jOvjyJ53OyGiyaHBdaIG9QeBh5keurVVGyvxWqDY9rsDGjNDJdLRQwl3');
    console.log('SUCCESS:', session.id);
  } catch (error) {
    console.log('ERROR:', error.message);
  }
}

test();