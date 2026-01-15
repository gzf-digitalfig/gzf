import React, { useState, useEffect } from "react";
import "./CalculateZakat.css";
import { FALLBACK_CURRENCIES, FALLBACK_RATES } from "../utils/zakatHelpers";

// Components
import WizardProgress from "../components/zakat/WizardProgress";
import GoldSilverStep from "../components/zakat/GoldSilverStep";
import LiquidAssetsStep from "../components/zakat/LiquidAssetsStep";
import { BusinessAssetsStep, ReceivablesStep } from "../components/zakat/BusinessAssetsStep";
import PensionStep from "../components/zakat/PensionStep";
import LiabilitiesStep from "../components/zakat/LiabilitiesStep";
import ZakatSummary from "../components/zakat/ZakatSummary";

export default function CalculateZakat() {
  const [currentStep, setCurrentStep] = useState(1);
  const TOTAL_STEPS = 7;

  // -- MAIN STATE --
  const [state, setState] = useState({
    calculationDate: new Date().toISOString().split('T')[0],
    currency: 'GBP',
    prices: {
      gold: 110.57, // Updated 2026-01-15
      silver: 2.13, // Updated 2026-01-15
      nisab: 1305.36 // silver * 612.36
    },
    // Assets
    assets: {
      goldItems: [], // { name, weight, carat, value, inputType }
      silver: { mode: 'weight', weight: '', value: '' },
      cashInHand: '',
      bankAccounts: [],
      digitalWallets: [],
      crypto: [],
      isas: [],
      stocks: [],
      otherAssets: [],

      // Business
      businessStock: '',
      businessInvoices: '',
      businessAccounts: [],

      receivables: []
    },
    includeBusinessAssets: false,

    // Pension
    pension: {
      type: 'NotSure', // NotSure, None, DB, DC
      access: 'Locked', // Locked, Accessible
      include: false,
      value: ''
    },

    // Liabilities
    liabilities: {
      studentLoan: '',
      carFinance: '',
      councilTax: '',
      mortgage: '',
      creditCards: [],
      personalLoans: [],
      otherBills: [],
      businessTaxes: '',
      businessLoans: []
    }
  });

  const [currencies, setCurrencies] = useState(FALLBACK_CURRENCIES);
  const [exchangeRates, setExchangeRates] = useState(FALLBACK_RATES);
  const [loading, setLoading] = useState(true);

  // -- DATA FETCHING --
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Prices
        const priceRes = await fetch('https://gloucesterprayertimes.com/zakatapp/nisab_history.php');
        if (priceRes.ok) {
          const history = await priceRes.json();
          if (history && history.length > 0) {
            const today = history[0];
            setState(prev => ({
              ...prev,
              prices: {
                gold: parseFloat(today.gold_price_gbp),
                silver: parseFloat(today.silver_price_gbp),
                nisab: parseFloat(today.silver_price_gbp) * 612.36
              }
            }));
          }
        }

        // 2. Currencies
        const currRes = await fetch('https://gloucesterprayertimes.com/zakatapp/currencies.php');
        if (currRes.ok) {
          const data = await currRes.json();
          if (data.result === 'success') {
            const list = Object.entries(data.currencies).map(([code, name]) => ({ code, name }));
            list.sort((a, b) => a.name.localeCompare(b.name));
            setCurrencies(list);
          }
        }

        // 3. Rates
        const rateRes = await fetch('https://gloucesterprayertimes.com/zakatapp/get_rates.php');
        if (rateRes.ok) {
          const data = await rateRes.json();
          if (data.result === 'success') {
            setExchangeRates(data.conversion_rates);
          }
        }

      } catch (err) {
        console.warn("Error loading live data, using fallbacks. Details:", err);
        console.error("Fetch failed. This is likely due to CORS if running locally. Default values will be used.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  // -- HANDLERS --
  const updateState = (field, value) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) setCurrentStep(c => c + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(c => c - 1);
    window.scrollTo(0, 0);
  };

  const getStepTitle = (step) => {
    const titles = {
      1: 'Gold & Silver',
      2: 'Cash & Investments',
      3: 'Business Assets',
      4: 'Money Owed to You',
      5: 'Pension',
      6: 'Debts & Liabilities',
      7: 'Zakat Summary'
    };
    return titles[step];
  };

  if (loading) return <div className="zakat-calculator-wizard"><div className="loading"><div className="spinner"></div><p>Loading Rates...</p></div></div>;

  return (
    <div className="zakat-calculator-wizard">
      <div className="container">
        <div className="header">
          <h1>Zakat Calculator</h1>
          <p>Gloucester Zakat Fund</p>
        </div>
        {/* Global Controls */}
        <div className="currency-selector">
          <label>Currency:</label>
          <select
            value={state.currency}
            onChange={(e) => updateState('currency', e.target.value)}
          >
            {currencies.map(c => (
              <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
            ))}
          </select>
        </div>

        <div className="nisab-card">
          <h2>📊 Nisab Threshold</h2>
          {/* Note converting NISAB to selected currency for display */}
          <div className="nisab-value">
            {new Intl.NumberFormat('en-GB', { style: 'currency', currency: state.currency }).format(
              state.prices.nisab * (state.currency === 'GBP' ? 1 : (exchangeRates[state.currency] || 1))
            )}
          </div>
          <p>Based on Silver (Hanafi). Updated Daily.</p>
        </div>

        {/* Wizard Progress */}
        <WizardProgress
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          stepTitle={getStepTitle(currentStep)}
        />

        {/* Content Area */}
        <div className="content-card">
          {currentStep === 1 && <GoldSilverStep state={state} updateState={updateState} exchangeRates={exchangeRates} />}
          {currentStep === 2 && <LiquidAssetsStep state={state} updateState={updateState} exchangeRates={exchangeRates} />}
          {currentStep === 3 && <BusinessAssetsStep state={state} updateState={updateState} />}
          {currentStep === 4 && <ReceivablesStep state={state} updateState={updateState} />}
          {currentStep === 5 && <PensionStep state={state} updateState={updateState} />}
          {currentStep === 6 && <LiabilitiesStep state={state} updateState={updateState} />}
          {currentStep === 7 && <ZakatSummary state={state} exchangeRates={exchangeRates} />}
        </div>

        {/* Nav Buttons */}
        <div className="navigation-buttons">
          {currentStep > 1 && (
            <button className="btn btn-previous" onClick={prevStep}>⬅ Previous</button>
          )}
          {currentStep < TOTAL_STEPS && (
            <button className="btn btn-next" onClick={nextStep}>Next ➡</button>
          )}
        </div>

      </div>
    </div>
  );
}
