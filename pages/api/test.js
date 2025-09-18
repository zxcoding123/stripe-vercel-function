// Simple test function - no Stripe yet
export default async function handler(req, res) {
  console.log('✅ Function was called!');
  res.status(200).json({ 
    message: 'It works!',
    query: req.query,
    timestamp: new Date().toISOString()
  });
}