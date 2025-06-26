// Example Node.js/Express backend for Stripe integration
// This file shows how to set up the backend when you're ready to implement it

const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('sk_test_YOUR_SECRET_KEY_HERE'); // Replace with your secret key

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Create Payment Intent endpoint
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'gbp', donor_info } = req.body;

    // Validate amount (convert to pence for Stripe)
    const amountInPence = Math.round(amount * 100);
    
    if (amountInPence < 100) { // Minimum £1
      return res.status(400).json({ 
        error: 'Amount must be at least £1' 
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInPence,
      currency: currency,
      metadata: {
        type: 'zakat_payment',
        donor_name: donor_info?.name || '',
        donor_email: donor_info?.email || '',
        donor_phone: donor_info?.phone || ''
      },
      receipt_email: donor_info?.email,
      description: `Zakat Payment - £${amount.toFixed(2)}`
    });

    res.json({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ 
      error: 'Failed to create payment intent' 
    });
  }
});

// Confirm Payment endpoint (optional - for additional processing)
app.post('/api/confirm-payment', async (req, res) => {
  try {
    const { payment_intent_id } = req.body;

    // Retrieve payment intent to check status
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

    if (paymentIntent.status === 'succeeded') {
      // Payment successful - you can:
      // 1. Save to database
      // 2. Send confirmation email
      // 3. Generate receipt
      // 4. Update donor records
      
      console.log('Payment succeeded:', {
        id: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        donor: paymentIntent.metadata
      });

      res.json({
        success: true,
        payment_intent: paymentIntent
      });
    } else {
      res.status(400).json({
        error: 'Payment not completed',
        status: paymentIntent.status
      });
    }

  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ 
      error: 'Failed to confirm payment' 
    });
  }
});

// Stripe Webhook endpoint (for handling events)
app.post('/api/stripe-webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = 'whsec_YOUR_WEBHOOK_SECRET_HERE'; // Replace with your webhook secret

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      
      // Handle successful payment:
      // - Save to database
      // - Send confirmation email
      // - Generate tax receipt
      // - Update donor records
      
      break;
      
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      
      // Handle failed payment:
      // - Log the failure
      // - Notify relevant parties
      // - Update records
      
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Remember to:');
  console.log('1. Replace Stripe keys with your actual keys');
  console.log('2. Set up webhook endpoints in Stripe dashboard');
  console.log('3. Configure CORS for your frontend domain');
  console.log('4. Add proper error handling and logging');
  console.log('5. Implement database storage for payments');
});

module.exports = app;