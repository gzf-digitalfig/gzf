import React from 'react';

// Reusing list helper could be good, but inline is fine for now
const renderDynamicList = (title, list, field, updateState, state, placeholder) => {
    const addItem = () => {
        const newList = [...list, { name: '', amount: '' }];
        updateState('assets', { ...state.assets, [field]: newList });
    };
    const removeItem = (idx) => {
        const newList = list.filter((_, i) => i !== idx);
        updateState('assets', { ...state.assets, [field]: newList });
    };
    const updateItem = (idx, key, val) => {
        const newList = [...list];
        newList[idx] = { ...newList[idx], [key]: val };
        updateState('assets', { ...state.assets, [field]: newList });
    };

    return (
        <div className="form-group">
            <label className="form-label">{title}</label>
            {list.map((item, idx) => (
                <div className="list-item" key={idx}>
                    <input
                        type="text"
                        className="form-input"
                        placeholder={placeholder}
                        value={item.name}
                        onChange={(e) => updateItem(idx, 'name', e.target.value)}
                    />
                    <input
                        type="number"
                        className="form-input"
                        placeholder="Amount"
                        value={item.amount}
                        onChange={(e) => updateItem(idx, 'amount', e.target.value)}
                    />
                    <button className="btn-remove" onClick={() => removeItem(idx)}>✕</button>
                </div>
            ))}
            <button className="btn-add" onClick={addItem}>+ Add Item</button>
        </div>
    );
};

export function BusinessAssetsStep({ state, updateState }) {
    const toggleBusiness = (e) => {
        updateState('includeBusinessAssets', e.target.checked);
    };

    return (
        <div>
            <p className="section-description">Toggle on if you are self-employed, run a business, or own goods bought for resale.</p>

            <div className="form-group">
                <label className="checkbox-group">
                    <input
                        type="checkbox"
                        checked={state.includeBusinessAssets}
                        onChange={toggleBusiness}
                    />
                    <span>I have business assets to include</span>
                </label>
            </div>

            {state.includeBusinessAssets ? (
                <>
                    <div className="info-box compact">
                        💼 If you own a business, zakat is due on:<br />
                        • Goods or stock bought with the intention to sell<br />
                        • Raw materials used to produce items for sale<br />
                        • Cash in hand or in the bank<br />
                        • Receivables (money owed to the business)
                    </div>

                    <div className="form-group">
                        <label className="form-label">Business Stock Value</label>
                        <input
                            type="number"
                            className="form-input"
                            placeholder="Value of inventory"
                            value={state.assets.businessStock}
                            onChange={(e) => updateState('assets', { ...state.assets, businessStock: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Business Invoices (Due to you)</label>
                        <input
                            type="number"
                            className="form-input"
                            placeholder="Unpaid invoices"
                            value={state.assets.businessInvoices}
                            onChange={(e) => updateState('assets', { ...state.assets, businessInvoices: e.target.value })}
                        />
                    </div>

                    {renderDynamicList('Business Bank Accounts', state.assets.businessAccounts, 'businessAccounts', updateState, state, 'Account Name')}
                </>
            ) : (
                <p className="empty-state">Business assets are not included in your calculation.</p>
            )}
        </div>
    );
}

export function ReceivablesStep({ state, updateState }) {
    return (
        <div>
            <div className="info-box">
                💵 <strong>Strong debts</strong> (likely to be repaid): Fully zakatable (e.g. personal loans, trade debts).<br /><br />
                <strong>Weak debts</strong> (uncertain repayment): Zakat is only due once repayment is received, then pay one year's zakat on it.
            </div>

            {renderDynamicList('Receivables (Money owed to you)', state.assets.receivables, 'receivables', updateState, state, 'Description')}
        </div>
    );
}
