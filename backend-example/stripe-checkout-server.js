// Example Node.js/Express backend for Stripe Checkout integration
// This file shows how to set up Stripe Checkout when you're ready to implement it

const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('sk_test_YOUR_SECRET_KEY_HERE'); // Replace with your secret key

const app = express();
const PORT = process.env.PORT || 3001;

// Your domain - replace with your actual domain
const YOUR_DOMAIN = 'http://localhost:3000'; // or https://yourdomain.com

// Middleware
app.use(cors());
app.use(express.json());

// Create Checkout Session endpoint
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { amount, donor_info } = req.body;

    // Validate amount
    if (!amount || amount < 1) {
      return res.status(400).json({ 
        error: 'Amount must be at least £1' 
      });
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'gbp',
          product_data: {
            name: 'Zakat Payment',
            description: `Zakat payment for ${donor_info?.name || 'Anonymous'}`,
            images: ['https://yourdomain.com/logo.png'], // Optional: Add your logo
          },
          unit_amount: Math.round(amount * 100), // Convert to pence
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/cancel`,
      customer_email: donor_info?.email,
      metadata: {
        donor_name: donor_info?.name || '',
        donor_phone: donor_info?.phone || '',
        payment_type: 'zakat',
        amount: amount.toString()
      },
      // Optional: Collect additional information
      billing_address_collection: 'auto',
      // Optional: Set up automatic tax calculation
      // automatic_tax: { enabled: true },
    });

    res.json({
      checkout_url: session.url,
      session_id: session.id
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error.message 
    });
  }
});

// Handle successful payment (redirect from Stripe)
app.get('/success', async (req, res) => {
  const { session_id } = req.query;

  try {
    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    if (session.payment_status === 'paid') {
      // Payment successful - you can:
      // 1. Save to database
      // 2. Send confirmation email
      // 3. Generate receipt
      // 4. Update donor records
      
      console.log('Payment successful:', {
        session_id: session.id,
        amount: session.amount_total / 100,
        donor: session.metadata
      });

      // Redirect to success page or show success message
      res.send(`
        <html>
          <head><title>Payment Successful</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #28a745;">Payment Successful!</h1>
            <p>Thank you for your Zakat donation of £${(session.amount_total / 100).toFixed(2)}.</p>
            <p>A receipt has been sent to your email address.</p>
            <p><a href="${YOUR_DOMAIN}">Return to website</a></p>
          </body>
        </html>
      `);
    } else {
      res.send(`
        <html>
          <head><title>Payment Pending</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #ffc107;">Payment Pending</h1>
            <p>Your payment is being processed.</p>
            <p><a href="${YOUR_DOMAIN}">Return to website</a></p>
          </body>
        </html>
      `);
    }

  } catch (error) {
    console.error('Error retrieving session:', error);
    res.status(500).send('Error processing payment confirmation');
  }
});

// Handle cancelled payment (redirect from Stripe)
app.get('/cancel', (req, res) => {
  res.send(`
    <html>
      <head><title>Payment Cancelled</title></head>
      <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
        <h1 style="color: #dc3545;">Payment Cancelled</h1>
        <p>Your payment was cancelled. No charges were made.</p>
        <p><a href="${YOUR_DOMAIN}">Return to website</a></p>
      </body>
    </html>
  `);
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
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Checkout session completed:', session.id);
      
      // Handle successful payment:
      // - Save to database
      // - Send confirmation email
      // - Generate tax receipt
      // - Update donor records
      
      break;
      
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      break;
      
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'GZF Stripe Checkout API'
  });
});

app.listen(PORT, () => {
  console.log(`Stripe Checkout server running on port ${PORT}`);
  console.log('Setup checklist:');
  console.log('1. ✅ Replace YOUR_SECRET_KEY_HERE with your Stripe secret key');
  console.log('2. ✅ Replace YOUR_WEBHOOK_SECRET_HERE with your webhook secret');
  console.log('3. ✅ Update YOUR_DOMAIN with your actual domain');
  console.log('4. ✅ Configure webhook endpoints in Stripe dashboard');
  console.log('5. ✅ Test with Stripe test cards');
  console.log('6. ✅ Set up success/cancel pages on your frontend');
});

module.exports = app;