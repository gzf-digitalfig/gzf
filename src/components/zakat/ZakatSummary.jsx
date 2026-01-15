import React, { useMemo } from 'react';
import { formatCurrency, convertFromGBP, sanitizeNumber, convertToGBP } from '../../utils/zakatHelpers';

export default function ZakatSummary({ state, exchangeRates }) {
    const selectedCurrency = state.currency || 'GBP';
    const nisabValue = convertFromGBP(state.prices.nisab, selectedCurrency, exchangeRates);
    const silverPrice = state.prices.silver || 0;
    const goldPrice = state.prices.gold || 0;

    // -- CALCULATION LOGIC --
    const totals = useMemo(() => {
        let assets = 0;
        let liabilities = 0;

        // 1. Gold
        state.assets.goldItems.forEach(item => {
            if (item.inputType === 'weight') {
                // Calculate value from weight
                // Helper CARAT_MULTIPLIERS logic needed here or in helper?
                // Let's duplicate simple map for now or import
                const caratMultipliers = { '24K': 1, '22K': 0.916, '21K': 0.875, '18K': 0.75, '14K': 0.583, '9K': 0.375 };
                const multiplier = caratMultipliers[item.carat] || 1;
                // Convert to pure gold grams
                const pureGrams = sanitizeNumber(item.weight) * multiplier;
                // Value in GBP
                const valGBP = pureGrams * goldPrice;
                assets += convertFromGBP(valGBP, selectedCurrency, exchangeRates);
            } else {
                // Value mode
                const val = sanitizeNumber(item.value);
                // Assuming user entered in current currency? 
                // If stored as is, we just add it. 
                assets += val;
            }
        });

        // 2. Silver
        if (state.assets.silver.mode === 'weight') {
            const valGBP = sanitizeNumber(state.assets.silver.weight) * silverPrice;
            assets += convertFromGBP(valGBP, selectedCurrency, exchangeRates);
        } else {
            assets += sanitizeNumber(state.assets.silver.value);
        }

        // 3. Liquid Assets
        assets += sanitizeNumber(state.assets.cashInHand);

        const sumList = (list, multiplier = 1) => {
            return list.reduce((acc, item) => acc + (sanitizeNumber(item.amount) * multiplier), 0);
        };

        assets += sumList(state.assets.bankAccounts);
        assets += sumList(state.assets.digitalWallets);
        assets += sumList(state.assets.crypto);
        assets += sumList(state.assets.isas);
        assets += sumList(state.assets.stocks, 0.4); // 40% rule
        assets += sumList(state.assets.otherAssets);

        // 4. Receivables
        assets += sumList(state.assets.receivables);

        // 5. Business
        if (state.includeBusinessAssets) {
            assets += sanitizeNumber(state.assets.businessStock);
            assets += sanitizeNumber(state.assets.businessInvoices);
            assets += sumList(state.assets.businessAccounts);
        }

        // 6. Pension (Accessible DC only)
        if (state.pension.type === 'DC' && state.pension.access === 'Accessible' && state.pension.include) {
            // Calculation: 40% of pot is zakatable
            // But wait, the vanilla calc adds 40% to assets, then later calcs 2.5% on net.
            // EXCEPT spec says "Pension Zakat = 1% of TOTAL".
            // 1% of Total == 2.5% of 40%.
            // So adding 40% to 'Net Zakatable Assets' works perfectly with standard 2.5% rate.
            assets += (sanitizeNumber(state.pension.value) * 0.4);
        }

        // -- LIABILITIES --
        liabilities += sanitizeNumber(state.liabilities.studentLoan);
        liabilities += sanitizeNumber(state.liabilities.carFinance);
        liabilities += sanitizeNumber(state.liabilities.councilTax);
        liabilities += sanitizeNumber(state.liabilities.mortgage);

        liabilities += sumList(state.liabilities.creditCards);
        liabilities += sumList(state.liabilities.personalLoans);
        liabilities += sumList(state.liabilities.otherBills);

        if (state.includeBusinessAssets) {
            liabilities += sanitizeNumber(state.liabilities.businessTaxes);
            liabilities += sumList(state.liabilities.businessLoans);
        }

        const netAssets = assets - liabilities;
        const zakatPayable = netAssets >= nisabValue ? (netAssets * 0.025) : 0;

        return { assets, liabilities, netAssets, zakatPayable, isAbove: netAssets >= nisabValue };

    }, [state, selectedCurrency, exchangeRates, nisabValue, goldPrice, silverPrice]);

    return (
        <div>
            <div className={`summary-status ${totals.isAbove ? 'status-above' : 'status-below'}`}>
                <span className="status-icon">{totals.isAbove ? '✅' : 'ℹ️'}</span>
                <div className="status-title">
                    {totals.isAbove ? 'Zakat is Due' : 'No Zakat Due'}
                </div>
                <div className="status-subtitle">
                    {totals.isAbove
                        ? `Your net assets exceed the Nisab threshold of ${formatCurrency(nisabValue, selectedCurrency)}`
                        : `Your wealth is below the Nisab threshold of ${formatCurrency(nisabValue, selectedCurrency)}`
                    }
                </div>
            </div>

            <div className="summary-details">
                <div className="summary-header">
                    <h3>Breakdown</h3>
                </div>

                <div className="summary-row">
                    <span>Total Assets</span>
                    <span className="value-positive">{formatCurrency(totals.assets, selectedCurrency)}</span>
                </div>
                <div className="summary-row">
                    <span>Total Liabilities</span>
                    <span className="value-negative">-{formatCurrency(totals.liabilities, selectedCurrency)}</span>
                </div>
                <div className="summary-row summary-row-final">
                    <span>Net Zakatable Assets</span>
                    <span>{formatCurrency(totals.netAssets, selectedCurrency)}</span>
                </div>

                {totals.isAbove && (
                    <div className="summary-row" style={{ marginTop: 20, paddingTop: 20, borderTop: '1px dashed #ccc' }}>
                        <span className="value-zakat">Zakat Due (2.5%)</span>
                        <span className="value-zakat">{formatCurrency(totals.zakatPayable, selectedCurrency)}</span>
                    </div>
                )}
            </div>

            {totals.isAbove && (
                <div className="payment-section">
                    <div className="payment-header">
                        <h3>Pay Your Zakat</h3>
                        <p>Secure payment powered by Stripe / PayPal</p>
                    </div>

                    <div className="payment-amount-display">
                        <span className="payment-label">Amount to Pay</span>
                        <span className="payment-value">{formatCurrency(totals.zakatPayable, selectedCurrency)}</span>
                    </div>

                    <div className="paypal-container">
                        {/* 
                   In a real integration, we'd mount the PayPal Button here 
                   or link to a payment page with the amount pre-filled via URL params 
                */}
                        <a
                            href="https://www.paypal.com/gb/fundraiser/charity/5731751"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-next"
                            style={{ display: 'block', textAlign: 'center', width: '100%', padding: '20px', fontSize: '18px' }}
                        >
                            Pay with PayPal via Giving Fund
                        </a>
                        <p style={{ textAlign: 'center', marginTop: 10, fontSize: 13, color: '#666' }}>
                            Redirects to our registered charity donation page
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
