import React, { useState } from 'react';
import { formatCurrency, sanitizeNumber } from '../../utils/zakatHelpers';

export default function LiquidAssetsStep({ state, updateState, exchangeRates }) {
    const selectedCurrency = state.currency || 'GBP';

    // -- Local State for Quick Stock Calculator --
    const [quickStock, setQuickStock] = useState({ name: '', value: '' });

    // -- Generic List Helpers --
    const addItem = (field, item) => {
        updateState('assets', {
            ...state.assets,
            [field]: [...state.assets[field], item]
        });
    };

    const removeItem = (field, index) => {
        const list = state.assets[field].filter((_, i) => i !== index);
        updateState('assets', { ...state.assets, [field]: list });
    };

    const updateItem = (field, index, key, value) => {
        const list = [...state.assets[field]];
        list[index] = { ...list[index], [key]: value };
        updateState('assets', { ...state.assets, [field]: list });
    };

    const renderDynamicList = (title, field, placeholderName) => (
        <div className="form-group">
            <label className="form-label">{title}</label>
            {state.assets[field].map((item, idx) => (
                <div className="list-item" key={idx}>
                    <input
                        type="text"
                        className="form-input"
                        placeholder={placeholderName}
                        value={item.name}
                        onChange={(e) => updateItem(field, idx, 'name', e.target.value)}
                    />
                    <input
                        type="number"
                        className="form-input"
                        placeholder="Amount"
                        value={item.amount}
                        onChange={(e) => updateItem(field, idx, 'amount', e.target.value)}
                    />
                    <button className="btn-remove" onClick={() => removeItem(field, idx)}>✕</button>
                </div>
            ))}
            <button
                className="btn-add"
                onClick={() => addItem(field, { name: '', amount: '' })}
            >
                + Add {title.slice(0, -1)}
            </button>
        </div>
    );

    // -- Stock Calculator Logic --
    const addToStocks = () => {
        if (!quickStock.value) return;
        addItem('stocks', {
            name: quickStock.name || 'Portfolio',
            amount: quickStock.value
        });
        setQuickStock({ name: '', value: '' });
    };

    const quickZakatable = quickStock.value ? (parseFloat(quickStock.value) * 0.4).toFixed(2) : '-';
    const quickZakatDue = quickStock.value ? (parseFloat(quickStock.value) * 0.4 * 0.025).toFixed(2) : '-';

    return (
        <div>
            <p className="section-description">Enter your cash holdings, bank accounts, and investment portfolios.</p>

            <div className="info-box compact">
                💰 Include all cash you own: money at home, in bank accounts, and digital wallets (e.g. PayPal, Revolut). Current and savings accounts are both zakatable.
            </div>

            {/* Cash in Hand */}
            <div className="form-group">
                <label className="form-label">Cash in Hand</label>
                <input
                    type="number"
                    className="form-input"
                    placeholder="Physical cash you own"
                    value={state.assets.cashInHand}
                    onChange={(e) => updateState('assets', { ...state.assets, cashInHand: e.target.value })}
                />
            </div>

            {/* Lists */}
            {renderDynamicList('Bank Accounts', 'bankAccounts', 'Account name')}
            {renderDynamicList('Digital Wallets', 'digitalWallets', 'Wallet name')}
            {renderDynamicList('Cryptocurrency', 'crypto', 'Crypto name')}
            {renderDynamicList('ISAs', 'isas', 'ISA name')}

            {/* Stocks & Shares */}
            <div className="form-group">
                <label className="form-label">Stocks & Shares</label>
                <div className="help-text" style={{ marginBottom: 15 }}>
                    Enter the current market value. Zakat will be calculated on 40% of this amount (roughly 1% of total share value).
                </div>

                {/* Quick Stock Adder */}
                <div className="quick-calculator">
                    <h4>📊 Quick Add Stock</h4>

                    <div className="form-group" style={{ marginBottom: 15 }}>
                        <label>Stock Name (optional)</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. Portfolio"
                            value={quickStock.name}
                            onChange={(e) => setQuickStock({ ...quickStock, name: e.target.value })}
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: 15 }}>
                        <label>Total Portfolio Value</label>
                        <input
                            type="number"
                            className="form-input"
                            placeholder="0.00"
                            value={quickStock.value}
                            onChange={(e) => setQuickStock({ ...quickStock, value: e.target.value })}
                            style={{ fontSize: 18, fontWeight: 'bold' }}
                        />
                    </div>

                    <div className="quick-calc-results">
                        <div className="quick-calc-item">
                            <span>Zakatable Amount (40%):</span>
                            <span className="quick-calc-value">{quickStock.value ? formatCurrency(parseFloat(quickZakatable), selectedCurrency) : '-'}</span>
                        </div>
                        <div className="quick-calc-item highlight">
                            <span>Zakat Due (2.5%):</span>
                            <span className="quick-calc-value">{quickStock.value ? formatCurrency(parseFloat(quickZakatDue), selectedCurrency) : '-'}</span>
                        </div>
                    </div>

                    <button
                        className="btn btn-add-primary"
                        style={{ width: '100%' }}
                        onClick={addToStocks}
                    >
                        ➕ Add to Stocks & Shares
                    </button>
                </div>

                {/* Stocks List */}
                {state.assets.stocks.map((item, idx) => (
                    <div className="list-item" key={idx}>
                        <input
                            type="text"
                            className="form-input"
                            value={item.name}
                            onChange={(e) => updateItem('stocks', idx, 'name', e.target.value)}
                        />
                        <input
                            type="number"
                            className="form-input"
                            value={item.amount}
                            onChange={(e) => updateItem('stocks', idx, 'amount', e.target.value)}
                        />
                        <button className="btn-remove" onClick={() => removeItem('stocks', idx)}>✕</button>
                    </div>
                ))}
            </div>

            {renderDynamicList('Other Assets', 'otherAssets', 'Asset name')}
        </div>
    );
}
