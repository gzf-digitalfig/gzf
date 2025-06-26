import { useState } from "react";
import StripeCheckout from "../components/StripeCheckout";

export default function CalculateZakat() {
  const [formData, setFormData] = useState({
    cash: '',
    gold: '',
    silver: '',
    investments: '',
    businessAssets: '',
    livestock: '',
    debts: '',
    expenses: ''
  });
  const [zakat, setZakat] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [donateAmount, setDonateAmount] = useState('');
  const [errors, setErrors] = useState({});

  // Nisab threshold (current gold price equivalent - approximately £4,000)
  const NISAB_THRESHOLD = 4000;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
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
    
    // Check if at least one asset field has a value
    const assetFields = ['cash', 'gold', 'silver', 'investments', 'businessAssets', 'livestock'];
    const hasAssets = assetFields.some(field => {
      const value = formData[field];
      return value && value.trim() !== '' && Number(value) > 0;
    });
    
    if (!hasAssets) {
      newErrors.general = 'Please enter at least one asset value to calculate Zakat.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const totalAssets = 
      Number(formData.cash || 0) + 
      Number(formData.gold || 0) + 
      Number(formData.silver || 0) + 
      Number(formData.investments || 0) + 
      Number(formData.businessAssets || 0) + 
      Number(formData.livestock || 0);
    
    const totalDeductions = Number(formData.debts || 0) + Number(formData.expenses || 0);
    const netAssets = totalAssets - totalDeductions;
    
    const zakatDue = netAssets >= NISAB_THRESHOLD ? (netAssets * 0.025) : 0;
    
    setZakat({
      totalAssets,
      totalDeductions,
      netAssets,
      zakatDue,
      meetsNisab: netAssets >= NISAB_THRESHOLD
    });
  };

  const handlePayZakat = () => {
    setShowPayment(true);
  };

  const handleDonate = () => {
    if (!donateAmount || Number(donateAmount) < 1) {
      setErrors({ donate: 'Please enter a valid donation amount (minimum £1)' });
      return;
    }
    setShowDonateModal(true);
  };

  const renderNumberInput = (field, label, step = 1, min = 0) => (
    <div className="form-group">
      <input
        type="number"
        id={field}
        value={formData[field]}
        onChange={e => handleInputChange(field, e.target.value)}
        min={min}
        step={step}
        placeholder="0.00"
        style={{ paddingRight: 44 }}
      />
      <label htmlFor={field}>{label}</label>
      <span className="custom-arrows">
        <button
          type="button"
          className="arrow-btn"
          tabIndex={-1}
          aria-label="Increase"
          onClick={() => handleInputChange(field, String(Number(formData[field] || 0) + Number(step)))}
        >
          ▲
        </button>
        <button
          type="button"
          className="arrow-btn"
          tabIndex={-1}
          aria-label="Decrease"
          onClick={() => handleInputChange(field, String(Math.max(Number(formData[field] || 0) - Number(step), min)))}
        >
          ▼
        </button>
      </span>
    </div>
  );

  return (
    <div className="zakat-calculator-container">
      <div className="zakat-header">
        <h1 className="text-center">Zakat Calculator</h1>
        <p className="text-center zakat-subtitle">
          Calculate your estimated Zakat amount
        </p>
        <div className="disclaimer">
          <p><strong>Important Disclaimer:</strong> This calculator provides an estimate only and does not constitute advice from an Islamic scholar. Please consult with a qualified Islamic scholar or religious authority for guidance on your specific Zakat obligations. Individual circumstances may require different calculations or considerations not covered by this tool.</p>
        </div>
      </div>

      <div className="calculator-layout">
        <div className="calculator-form-section">
          <div className="card zakat-form-card">
            <h2>Your Assets</h2>
            <form onSubmit={handleCalculate} className="zakat-form">
              {errors.general && (
                <div className="error-message">
                  {errors.general}
                </div>
              )}
              
              <div className="form-section">
                <h3>Cash & Liquid Assets</h3>
                {renderNumberInput('cash', 'Cash & Bank Savings (£)', 100, 0)}
                {renderNumberInput('investments', 'Stocks, Bonds & Investments (£)', 100, 0)}
              </div>

              <div className="form-section">
                <h3>Precious Metals</h3>
                {renderNumberInput('gold', 'Gold Value (£)', 50, 0)}
                {renderNumberInput('silver', 'Silver Value (£)', 50, 0)}
              </div>

              <div className="form-section">
                <h3>Business & Other Assets</h3>
                {renderNumberInput('businessAssets', 'Business Assets & Inventory (£)', 100, 0)}
                {renderNumberInput('livestock', 'Livestock Value (£)', 50, 0)}
              </div>

              <div className="form-section deductions-section">
                <h3>Deductions</h3>
                {renderNumberInput('debts', 'Outstanding Debts (£)', 100, 0)}
                {renderNumberInput('expenses', 'Essential Living Expenses (£)', 100, 0)}
              </div>

              <button type="submit" className="modern-btn calculate-btn">
                Calculate My Zakat
              </button>
            </form>
          </div>
        </div>

        {zakat !== null && (
          <div className="calculator-result-section">
            <div className="card zakat-result-card">
              <div className="result-header">
                <h2>Your Zakat Calculation</h2>
              </div>
              
              <div className="calculation-breakdown">
                <div className="breakdown-item">
                  <span className="label">Total Assets:</span>
                  <span className="value">£{zakat.totalAssets.toFixed(2)}</span>
                </div>
                <div className="breakdown-item">
                  <span className="label">Total Deductions:</span>
                  <span className="value">-£{zakat.totalDeductions.toFixed(2)}</span>
                </div>
                <div className="breakdown-item total">
                  <span className="label">Net Zakatable Assets:</span>
                  <span className="value">£{zakat.netAssets.toFixed(2)}</span>
                </div>
              </div>

              <div className="nisab-status">
                {zakat.meetsNisab ? (
                  <div className="nisab-met">
                    <span className="status-icon">✅</span>
                    <span>Your assets meet the Nisab threshold (£{NISAB_THRESHOLD.toLocaleString()})</span>
                  </div>
                ) : (
                  <div className="nisab-not-met">
                    <span className="status-icon">ℹ️</span>
                    <span>Your assets are below the Nisab threshold. No Zakat is due.</span>
                  </div>
                )}
              </div>

              <div className="zakat-due-section">
                <div className="zakat-amount">
                  <h3>Zakat Due:</h3>
                  <div className="amount">£{zakat.zakatDue.toFixed(2)}</div>
                  {zakat.zakatDue > 0 && (
                    <p className="rate-info">This is 2.5% of your net zakatable assets</p>
                  )}
                </div>

                {zakat.zakatDue > 0 && (
                  <div className="payment-section">
                    <button 
                      onClick={handlePayZakat}
                      className="modern-btn pay-zakat-btn"
                    >
                      Pay Zakat Now
                    </button>
                    <p className="payment-info">
                      Secure payment powered by Stripe
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="standalone-donate-section">
          <div className="card donate-card">
            <h2>Make a Donation</h2>
            <p>Want to donate without calculating zakat? You can make a direct donation to support our community.</p>
            
            {errors.donate && (
              <div className="error-message">
                {errors.donate}
              </div>
            )}
            
            <div className="donate-form">
              <div className="form-group">
                <input
                  type="number"
                  id="donate-amount"
                  value={donateAmount}
                  onChange={(e) => {
                    setDonateAmount(e.target.value);
                    if (errors.donate) {
                      setErrors(prev => ({ ...prev, donate: '' }));
                    }
                  }}
                  min="1"
                  step="10"
                  placeholder="0.00"
                />
                <label htmlFor="donate-amount">Donation Amount (£)</label>
              </div>
              
              <button 
                onClick={handleDonate}
                className="modern-btn donate-btn"
              >
                Donate Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {showPayment && zakat && zakat.zakatDue > 0 && (
        <StripeCheckout 
          amount={zakat.zakatDue}
          onClose={() => setShowPayment(false)}
        />
      )}

      {showDonateModal && donateAmount && (
        <StripeCheckout 
          amount={Number(donateAmount)}
          onClose={() => setShowDonateModal(false)}
        />
      )}
    </div>
  );
}
