import React, { useMemo } from 'react';
import { formatCurrency, convertFromGBP, sanitizeNumber } from '../../utils/zakatHelpers';
import DonationForm from '../DonationForm';
import BankTransfer from '../BankTransfer';

export default function ZakatSummary({ state, exchangeRates }) {
    // ... (rest of the component logic kept intact via previous edits, confirming it works) ...
    // Using previous replace_file_content logic but ensuring BankTransfer is added.
    // Re-declaring component body parts to ensure match.

    // ... (logic) ...
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
                const caratMultipliers = { '24K': 1, '22K': 0.916, '21K': 0.875, '18K': 0.75, '14K': 0.583, '9K': 0.375 };
                const multiplier = caratMultipliers[item.carat] || 1;
                const pureGrams = sanitizeNumber(item.weight) * multiplier;
                const valGBP = pureGrams * goldPrice;
                assets += convertFromGBP(valGBP, selectedCurrency, exchangeRates);
            } else {
                const val = sanitizeNumber(item.value);
                assets += val;
            }
        });

        if (state.assets.silver.mode === 'weight') {
            const valGBP = sanitizeNumber(state.assets.silver.weight) * silverPrice;
            assets += convertFromGBP(valGBP, selectedCurrency, exchangeRates);
        } else {
            assets += sanitizeNumber(state.assets.silver.value);
        }

        assets += sanitizeNumber(state.assets.cashInHand);

        const sumList = (list, multiplier = 1) => {
            return list.reduce((acc, item) => acc + (sanitizeNumber(item.amount) * multiplier), 0);
        };

        assets += sumList(state.assets.bankAccounts);
        assets += sumList(state.assets.digitalWallets);
        assets += sumList(state.assets.crypto);
        assets += sumList(state.assets.isas);
        assets += sumList(state.assets.stocks, 0.4);
        assets += sumList(state.assets.otherAssets);
        assets += sumList(state.assets.receivables);

        if (state.includeBusinessAssets) {
            assets += sanitizeNumber(state.assets.businessStock);
            assets += sanitizeNumber(state.assets.businessInvoices);
            assets += sumList(state.assets.businessAccounts);
        }

        if (state.pension.type === 'DC' && state.pension.access === 'Accessible' && state.pension.include) {
            assets += (sanitizeNumber(state.pension.value) * 0.4);
        }

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

            {/* Donation Form appears if Zakat is due OR if user wants to donate voluntarily */}
            <div style={{ marginTop: '3rem' }}>
                <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary-green)' }}>
                    {totals.isAbove ? 'Pay Your Zakat' : 'Make a Voluntary Donation'}
                </h3>
                <DonationForm
                    initialAmount={totals.isAbove ? totals.zakatPayable.toFixed(2) : ''}
                    initialType="zakat"
                />
            </div>

            {/* Bank Transfer Details */}
            <div style={{ marginTop: '2rem' }}>
                <BankTransfer />
            </div>
        </div>
    );
}
