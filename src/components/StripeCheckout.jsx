import { useState } from 'react';

export default function StripeCheckout({ amount, onClose }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});

  // Stripe Checkout configuration
  const STRIPE_CONFIG = {
    publishableKey: 'pk_test_YOUR_PUBLISHABLE_KEY_HERE', // Replace with your actual key
    currency: 'gbp',
    country: 'GB'
  };

  const handleInputChange = (field, value) => {
    setDonorInfo(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!donorInfo.name.trim()) newErrors.name = 'Name is required';
    if (!donorInfo.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(donorInfo.email)) newErrors.email = 'Email is invalid';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStripeCheckout = async () => {
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // In a real implementation, you would:
      // 1. Call your backend to create a Stripe Checkout session
      // 2. Redirect to Stripe Checkout
      // 3. Handle success/cancel redirects

      console.log('Creating Stripe Checkout session...', {
        amount: amount,
        currency: STRIPE_CONFIG.currency,
        donor: donorInfo
      });

      // Create checkout session
      const checkoutSession = await createCheckoutSession(amount, donorInfo);
      
      // Check if we're in demo mode or have real Stripe keys
      if (STRIPE_CONFIG.publishableKey.includes('YOUR_PUBLISHABLE_KEY') || checkoutSession.id.includes('demo')) {
        // Demo mode - show alert instead of redirecting
        alert(`Demo Mode: Stripe Checkout would redirect you to pay £${amount.toFixed(2)}\n\nDonor: ${donorInfo.name}\nEmail: ${donorInfo.email}\n\nCheckout URL: ${checkoutSession.url}`);
        onClose();
      } else {
        // Real mode - redirect to Stripe Checkout
        window.location.href = checkoutSession.url;
      }

    } catch (error) {
      console.error('Checkout failed:', error);
      setErrors({ general: 'Failed to initialize checkout. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  // Create Stripe Checkout session via backend API
  const createCheckoutSession = async (amount, donorInfo) => {
    try {
      // In a real implementation, replace with your actual backend URL
      const API_BASE_URL = 'http://localhost:3001/api'; // Replace with your backend URL
      
      const response = await fetch(`${API_BASE_URL}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          donor_info: donorInfo
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const data = await response.json();
      return {
        id: data.session_id,
        url: data.checkout_url
      };

    } catch (error) {
      console.error('API call failed, using demo mode:', error);
      
      // Fallback to demo mode if API is not available
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: 'cs_demo_' + Math.random().toString(36).substr(2, 9),
            url: 'https://checkout.stripe.com/pay/cs_demo_example'
          });
        }, 1000);
      });
    }
  };

  return (
    <div className="payment-overlay">
      <div className="payment-modal checkout-modal">
        <div className="payment-header">
          <h2>Complete Your Zakat Payment</h2>
          <button className="close-btn" onClick={onClose} disabled={isProcessing}>
            ×
          </button>
        </div>

        <div className="payment-amount">
          <div className="amount-display">
            <span className="currency">£</span>
            <span className="amount">{amount.toFixed(2)}</span>
          </div>
          <p>Your Zakat obligation</p>
        </div>

        <div className="payment-form">
          {errors.general && (
            <div className="error-message">
              {errors.general}
            </div>
          )}

          <div className="form-section">
            <h3>Donor Information</h3>
            <p className="form-description">Please provide your details for the receipt</p>
            
            <div className="form-group">
              <input
                type="text"
                id="donor-name"
                value={donorInfo.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Full Name"
                disabled={isProcessing}
              />
              <label htmlFor="donor-name">Full Name *</label>
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <input
                type="email"
                id="donor-email"
                value={donorInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="email@example.com"
                disabled={isProcessing}
              />
              <label htmlFor="donor-email">Email Address *</label>
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <input
                type="tel"
                id="donor-phone"
                value={donorInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Phone Number (Optional)"
                disabled={isProcessing}
              />
              <label htmlFor="donor-phone">Phone Number</label>
            </div>
          </div>

          <div className="payment-actions">
            <button
              className="modern-btn payment-btn"
              onClick={handleStripeCheckout}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <span className="spinner"></span>
                  Processing...
                </>
              ) : (
                <>
                  Continue to Stripe Checkout
                </>
              )}
            </button>
            
            <div className="security-info">
              <p>You will be redirected to Stripe's secure checkout page</p>
              <p>We accept all major credit and debit cards</p>
              {STRIPE_CONFIG.publishableKey.includes('YOUR_PUBLISHABLE_KEY') && (
                <div className="demo-info">
                  <p><strong>Demo Mode:</strong> This is a demonstration. No actual payment will be processed.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}