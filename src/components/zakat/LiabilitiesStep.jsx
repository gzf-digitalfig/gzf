import React from 'react';

const renderDynamicList = (title, list, field, updateState, state) => {
    const addItem = () => {
        const newList = [...list, { amount: '' }]; // Simple amount only for liabilities usually? Or name + amount
        // Looking at calc.js, lists have 'amount'. Some might have description?
        // "creditCards" -> just amounts in calc.js? No, creates `list-item` with input.
        // Let's assume description + amount for clarity
        updateState('liabilities', { ...state.liabilities, [field]: [...list, { name: '', amount: '' }] });
    };
    const removeItem = (idx) => {
        const newList = list.filter((_, i) => i !== idx);
        updateState('liabilities', { ...state.liabilities, [field]: newList });
    };
    const updateItem = (idx, key, val) => {
        const newList = [...list];
        newList[idx] = { ...newList[idx], [key]: val };
        updateState('liabilities', { ...state.liabilities, [field]: newList });
    };

    return (
        <div className="form-group">
            <label className="form-label">{title}</label>
            {list.map((item, idx) => (
                <div className="list-item" key={idx}>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Description"
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

export default function LiabilitiesStep({ state, updateState }) {
    return (
        <div>
            <p className="section-description">Enter your current debts and immediate liabilities.</p>

            <div className="info-box compact">
                ℹ️ Deduct up to 12 months worth of repayments for long-term debts such as student loans, car finance, or personal loans.
            </div>

            <div className="form-group">
                <label className="form-label">Student Loans (12 months)</label>
                <input
                    type="number"
                    className="form-input"
                    value={state.liabilities.studentLoan}
                    onChange={(e) => updateState('liabilities', { ...state.liabilities, studentLoan: e.target.value })}
                />
            </div>

            <div className="form-group">
                <label className="form-label">Car Finance (12 months)</label>
                <input
                    type="number"
                    className="form-input"
                    value={state.liabilities.carFinance}
                    onChange={(e) => updateState('liabilities', { ...state.liabilities, carFinance: e.target.value })}
                />
            </div>

            <div className="form-group">
                <label className="form-label">Council Tax Arrears</label>
                <input
                    type="number"
                    className="form-input"
                    value={state.liabilities.councilTax}
                    onChange={(e) => updateState('liabilities', { ...state.liabilities, councilTax: e.target.value })}
                />
            </div>

            <div className="form-group">
                <label className="form-label">Mortgage / Rent (12 months)</label>
                <input
                    type="number"
                    className="form-input"
                    value={state.liabilities.mortgage}
                    onChange={(e) => updateState('liabilities', { ...state.liabilities, mortgage: e.target.value })}
                />
            </div>

            {renderDynamicList('Credit Cards', state.liabilities.creditCards, 'creditCards', updateState, state)}
            {renderDynamicList('Personal Loans', state.liabilities.personalLoans, 'personalLoans', updateState, state)}
            {renderDynamicList('Other Bills', state.liabilities.otherBills, 'otherBills', updateState, state)}

            {state.includeBusinessAssets && (
                <>
                    <div className="form-group">
                        <label className="form-label">Business Taxes Due</label>
                        <input
                            type="number"
                            className="form-input"
                            value={state.liabilities.businessTaxes}
                            onChange={(e) => updateState('liabilities', { ...state.liabilities, businessTaxes: e.target.value })}
                        />
                    </div>
                    {renderDynamicList('Business Loans', state.liabilities.businessLoans, 'businessLoans', updateState, state)}
                </>
            )}
        </div>
    );
}
