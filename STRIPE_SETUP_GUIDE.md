# Stripe Integration Setup Guide

This guide will help you set up Stripe payments for the GZF Zakat Calculator.

## Prerequisites

1. **Stripe Account**: Sign up at [stripe.com](https://stripe.com)
2. **Node.js**: Install Node.js for the backend server
3. **SSL Certificate**: Required for production (Stripe requires HTTPS)

## Step 1: Stripe Account Setup

### 1.1 Create Stripe Account
1. Go to [stripe.com](https://stripe.com) and sign up
2. Complete account verification
3. Enable your account for live payments

### 1.2 Get API Keys
1. Go to Stripe Dashboard → Developers → API Keys
2. Copy your **Publishable Key** (starts with `pk_`)
3. Copy your **Secret Key** (starts with `sk_`)
4. Keep these keys secure and never commit them to version control

### 1.3 Configure Webhooks
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Enter your webhook URL: `https://yourdomain.com/api/stripe-webhook`
4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the webhook signing secret

## Step 2: Frontend Configuration

### 2.1 Update Stripe Configuration
Edit `src/components/StripeCheckout.jsx`:

```javascript
// Stripe Checkout configuration
const STRIPE_CONFIG = {
  publishableKey: 'pk_live_YOUR_ACTUAL_PUBLISHABLE_KEY', // Replace with your actual key
  currency: 'gbp',
  country: 'GB'
};
```

And update the API_BASE_URL in the `createCheckoutSession` function:

```javascript
const API_BASE_URL = 'https://yourdomain.com/api'; // Replace with your backend URL
```

### 2.2 Environment Variables
Create `.env` file in your project root:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_ACTUAL_PUBLISHABLE_KEY
VITE_API_BASE_URL=https://yourdomain.com/api
```

## Step 3: Backend Setup

### 3.1 Install Dependencies
```bash
cd backend-example
npm install
```

### 3.2 Environment Configuration
Create `.env` file in backend directory:

```env
STRIPE_SECRET_KEY=sk_live_YOUR_ACTUAL_SECRET_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
PORT=3001
NODE_ENV=production
```

### 3.3 Update Server Configuration
Edit `backend-example/server.js`:

```javascript
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Update webhook secret
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
```

### 3.4 Deploy Backend
Deploy your backend to a service like:
- **Heroku**: Easy deployment with Git
- **Vercel**: Serverless functions
- **AWS Lambda**: Serverless with API Gateway
- **DigitalOcean**: VPS hosting
- **Railway**: Simple deployment

### 3.5 Stripe Checkout Integration
The application uses Stripe Checkout for a simplified payment flow:

1. **Frontend**: Collects donor information and calls backend
2. **Backend**: Creates Stripe Checkout session
3. **Redirect**: User is redirected to Stripe's hosted checkout page
4. **Return**: User returns to success/cancel pages after payment

Key endpoints needed:
- `POST /api/create-checkout-session` - Creates checkout session
- `GET /success` - Handles successful payments
- `GET /cancel` - Handles cancelled payments
- `POST /api/stripe-webhook` - Processes webhook events

## Step 4: Testing

### 4.1 Test Mode
Use Stripe test keys for development:
- Test Publishable Key: `pk_test_...`
- Test Secret Key: `sk_test_...`

### 4.2 Test Cards
Use Stripe test cards:
- **Success**: `4242424242424242`
- **Declined**: `4000000000000002`
- **Insufficient Funds**: `4000000000009995`

### 4.3 Test Webhooks
Use Stripe CLI for local testing:
```bash
stripe listen --forward-to localhost:3001/api/stripe-webhook
```

## Step 5: Security Considerations

### 5.1 Environment Variables
- Never commit API keys to version control
- Use environment variables for all sensitive data
- Use different keys for development and production

### 5.2 HTTPS
- Stripe requires HTTPS in production
- Use SSL certificates (Let's Encrypt is free)
- Redirect HTTP to HTTPS

### 5.3 Validation
- Validate all input on both frontend and backend
- Implement rate limiting
- Use CORS properly
- Validate webhook signatures

## Step 6: Production Checklist

### 6.1 Before Going Live
- [ ] Replace all test keys with live keys
- [ ] Test with real payment methods
- [ ] Set up webhook endpoints
- [ ] Configure SSL/HTTPS
- [ ] Test error handling
- [ ] Set up monitoring and logging
- [ ] Configure email notifications
- [ ] Test mobile responsiveness

### 6.2 Compliance
- [ ] Review Stripe's terms of service
- [ ] Implement proper data handling
- [ ] Add privacy policy
- [ ] Add terms and conditions
- [ ] Consider PCI compliance requirements

## Step 7: Additional Features

### 7.1 Enhanced Features You Can Add
- **Recurring Donations**: Set up subscription payments
- **Multiple Currencies**: Support international donors
- **Apple Pay/Google Pay**: Add digital wallet support
- **Bank Transfers**: Add ACH/SEPA payment methods
- **Receipts**: Generate PDF receipts
- **Donor Portal**: Allow donors to view payment history

### 7.2 Integration Examples
```javascript
// Apple Pay setup
const paymentRequest = stripe.paymentRequest({
  country: 'GB',
  currency: 'gbp',
  total: {
    label: 'Zakat Payment',
    amount: amount * 100,
  },
  requestPayerName: true,
  requestPayerEmail: true,
});
```

## Troubleshooting

### Common Issues
1. **CORS Errors**: Configure CORS properly in backend
2. **Webhook Failures**: Check webhook URL and signature verification
3. **Payment Failures**: Check test card numbers and error handling
4. **SSL Issues**: Ensure HTTPS is properly configured

### Support Resources
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)
- [Stripe Community](https://github.com/stripe)

## Cost Considerations

### Stripe Fees (UK)
- **Online payments**: 1.4% + 20p per transaction
- **European cards**: 2.9% + 20p per transaction
- **Non-European cards**: 2.9% + 20p per transaction

### Volume Discounts
- Contact Stripe for custom pricing on high volumes
- Consider Stripe Connect for marketplace scenarios

---

**Important**: This is a comprehensive setup guide. Start with test mode and gradually move to production after thorough testing.