import { useState, useEffect, useRef } from "react";


export default function CalculateZakat() {
  const [formData, setFormData] = useState({
    // Gold & Silver
    gold: '',
    silver: '',
    // Cash
    cashInHand: '',
    cashInISA: '',
    bankAccounts: '',
    paypal: '',
    // Crypto
    crypto: '',
    // Stocks/Shares
    stocks: '',
    // Business
    businessAccount: '',
    businessStock: '',
    moniesOwed: '',
    // Pension
    pension: '',
    // Liabilities
    creditCards: '',
    debt: '',
    councilTax: '',
    businessInvoices: '',
    mortgage: ''
  });
  const [zakat, setZakat] = useState(null);
  const [errors, setErrors] = useState({});
  const resultRef = useRef(null);

  useEffect(() => {
    if (zakat !== null && resultRef.current) {
      // On small screens, scroll the result section into view
      if (window.innerWidth <= 768) {
        resultRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  }, [zakat]);

  const PAYPAL_URL = "https://www.paypal.com/gb/fundraiser/charity/5731751";

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
    const assetFields = ['gold', 'silver', 'cashInHand', 'cashInISA', 'bankAccounts', 'paypal', 'crypto', 'stocks', 'businessAccount', 'businessStock', 'moniesOwed', 'pension'];
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
      Number(formData.gold || 0) +
      Number(formData.silver || 0) +
      Number(formData.cashInHand || 0) +
      Number(formData.cashInISA || 0) +
      Number(formData.bankAccounts || 0) +
      Number(formData.paypal || 0) +
      Number(formData.crypto || 0) +
      (Number(formData.stocks || 0) * 0.4) + // Stocks at 40% value for Zakat calculation
      Number(formData.businessAccount || 0) +
      Number(formData.businessStock || 0) +
      Number(formData.moniesOwed || 0) +
      Number(formData.pension || 0);

    const totalDeductions =
      Number(formData.creditCards || 0) +
      Number(formData.debt || 0) +
      Number(formData.councilTax || 0) +
      Number(formData.businessInvoices || 0) +
      Number(formData.mortgage || 0);
    const netAssets = totalAssets - totalDeductions;

    const zakatDue = netAssets >= NISAB_THRESHOLD ? (netAssets * 0.025) : 0;

    setZakat({
      totalAssets,
      totalDeductions,
      netAssets,
      zakatDue,
      meetsNisab: netAssets >= NISAB_THRESHOLD,
      stocksOriginalValue: Number(formData.stocks || 0),
      stocksZakatableValue: Number(formData.stocks || 0) * 0.4
    });
  };

  const handlePayZakat = () => {
    window.open(PAYPAL_URL, '_blank', 'noopener,noreferrer');
  };

  const handleDonate = () => {
    window.open(PAYPAL_URL, '_blank', 'noopener,noreferrer');
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
        <h1 className="text-center">Calculate & Give Zakat</h1>
      </div>

      <div className="calculator-layout">
        <div className="calculator-form-section">


          <div className="card zakat-form-card">
            <h1
              className="text-center"
              style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--primary-green)', fontWeight: 700 }}
            >
              Zakat Calculator
            </h1>
            <p className="text-center zakat-subtitle" style={{ marginTop: 0, marginBottom: '1.5rem' }}>
              Calculate your estimated Zakat amount
            </p>
            <h2>Your Assets</h2>
            <form onSubmit={handleCalculate} className="zakat-form">
              {errors.general && (
                <div className="error-message">
                  {errors.general}
                </div>
              )}

              <div className="form-section">
                <h3>Gold & Silver</h3>
                {renderNumberInput('gold', 'Gold (£)', 50, 0)}
                {renderNumberInput('silver', 'Silver (£)', 50, 0)}
              </div>

              <div className="form-section">
                <h3>Cash</h3>
                {renderNumberInput('cashInHand', 'Cash in Hand (£)', 10, 0)}
                {renderNumberInput('cashInISA', 'Cash in ISA (£)', 100, 0)}
                {renderNumberInput('bankAccounts', 'Bank Accounts (£)', 100, 0)}
                {renderNumberInput('paypal', 'PayPal (£)', 10, 0)}
              </div>

              <div className="form-section">
                <h3>Crypto</h3>
                {renderNumberInput('crypto', 'Cryptocurrency (£)', 50, 0)}
              </div>

              <div className="form-section">
                <h3>Stocks/Shares</h3>
                {renderNumberInput('stocks', 'Stocks & Shares (£)', 100, 0)}
                <p style={{ fontSize: '0.9rem', color: '#666', margin: '0.5rem 0' }}>Note: Stocks are subject to 1% Zakat rate (calculated as 2.5% of 40% value)</p>
              </div>

              <div className="form-section">
                <h3>Business</h3>
                {renderNumberInput('businessAccount', 'Business Account (£)', 100, 0)}
                {renderNumberInput('businessStock', 'Stock Value (£)', 100, 0)}
                {renderNumberInput('moniesOwed', 'Monies Owed by Others (£)', 50, 0)}
              </div>

              <div className="form-section">
                <h3>Pension</h3>
                {renderNumberInput('pension', 'Pension (£)', 100, 0)}
              </div>

              <h2>Your Liabilities</h2>
              <div className="form-section deductions-section">
                {renderNumberInput('creditCards', 'Credit Cards (£)', 50, 0)}
                {renderNumberInput('debt', 'Other Debt (£)', 100, 0)}
                {renderNumberInput('councilTax', 'Council Tax Arrears (£)', 50, 0)}
                {renderNumberInput('businessInvoices', 'Business Invoices Due (£)', 100, 0)}
                {renderNumberInput('mortgage', 'Mortgage (1 year) (£)', 500, 0)}
              </div>

              <button type="submit" className="modern-btn calculate-btn">
                Calculate My Zakat
              </button>

              <div className="disclaimer" style={{ marginTop: '2rem' }}>
                <p><strong>Important Disclaimer:</strong> This calculator provides an estimate only and does not constitute advice from an Islamic scholar. Please consult with a qualified Islamic scholar or religious authority for guidance on your specific Zakat obligations. Individual circumstances may require different calculations or considerations not covered by this tool.</p>
              </div>
            </form>
          </div>
        </div>

        {zakat !== null && (
          <div className="calculator-result-section" ref={resultRef}>
            <div className="card zakat-result-card">
              <div className="result-header">
                <h2>Your Zakat Calculation</h2>
              </div>

              <div className="calculation-breakdown">
                <div className="breakdown-item">
                  <span className="label">Total Assets:</span>
                  <span className="value">£{zakat.totalAssets.toFixed(2)}</span>
                </div>
                {zakat.stocksOriginalValue > 0 && (
                  <div className="breakdown-item">
                    <span className="label">Stocks (£{zakat.stocksOriginalValue.toFixed(2)} × 40%):</span>
                    <span className="value">£{zakat.stocksZakatableValue.toFixed(2)}</span>
                  </div>
                )}
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
            <p>Want to donate zakat without calculating first? You can make a direct donation to support our community now.</p>

            <div className="donate-action" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
              <button
                onClick={handleDonate}
                className="modern-btn donate-btn"
                style={{ width: '100%' }}
              >
                Donate Now
              </button>


            </div>
          </div>

          <div className="card gift-aid-message" style={{
            marginTop: '1.5rem',
            background: 'var(--bg-secondary)',
            borderRadius: '8px',
            border: '1px dashed var(--primary-green)',
            fontSize: '0.95rem',
            color: 'var(--text-primary)',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0 }}>
              We kindly ask that you click the <strong>Gift Aid</strong> button on your emailed receipt. This allows us to reclaim an extra 25p for every £1 you donate at no extra cost to you, which allows us to pay our admin costs.
            </p>
          </div>
        </div>
      </div>




    </div>
  );
}
