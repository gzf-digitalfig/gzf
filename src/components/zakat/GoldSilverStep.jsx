import React, { useState } from 'react';
import { sanitizeNumber, formatCurrency, convertFromGBP, CARAT_MULTIPLIERS } from '../../utils/zakatHelpers';

export default function GoldSilverStep({ state, updateState, exchangeRates }) {
    const [showGoldModal, setShowGoldModal] = useState(false);
    const [goldItem, setGoldItem] = useState({
        name: '',
        inputType: 'weight',
        weight: '',
        carat: '18K',
        value: '' // in local currency
    });

    // Derived Values
    const selectedCurrency = state.currency || 'GBP';
    const silverPrice = state.prices.silver || 0;
    const goldPrice = state.prices.gold || 0;

    // -- Modal Helpers --
    const openModal = () => {
        setGoldItem({
            name: '',
            inputType: 'weight',
            weight: '',
            carat: '18K',
            value: ''
        });
        setShowGoldModal(true);
    };

    const closeModal = () => setShowGoldModal(false);

    const saveGoldItem = () => {
        const newItem = { ...goldItem };

        // Calculate GBP value immediately for uniform storage (or store raw and calc later)
        // Here we'll store inputs and calculate total in main app or helper
        // But for display in list, we might want derived value.

        // Let's store raw input to allow currency switching to affect value-based items correctly if re-calc'd
        // Ideally, value-based items are fixed in the currency they were entered? 
        // For simplicity, we assume "value" entered is in CURRENT selected currency.
        // If we want to persist exact value across currency changes, we should convert to GBP and store that.

        if (newItem.inputType === 'value') {
            // Convert input value to GBP for storage
            // Note: Helper convertToGBP requires rates. 
            // We'll pass raw inputs back to parent, parent handles logic? 
            // Better: Just store what user entered + metadata.
        }

        // Add to list
        const newGoldList = [...state.assets.goldItems, newItem];
        updateState('assets', { ...state.assets, goldItems: newGoldList });
        closeModal();
    };

    const removeGoldItem = (index) => {
        const newGoldList = state.assets.goldItems.filter((_, i) => i !== index);
        updateState('assets', { ...state.assets, goldItems: newGoldList });
    };

    // -- Inline Updates --
    const updateSilver = (field, value) => {
        updateState('assets', {
            ...state.assets,
            silver: {
                ...state.assets.silver,
                [field]: value
            }
        });
    };

    return (
        <div>
            {/* Valuation Date */}
            <div className="form-group">
                <label className="form-label">📅 Valuation Date</label>
                <input
                    type="date"
                    className="form-input"
                    value={state.calculationDate}
                    onChange={(e) => updateState('calculationDate', e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                />
                <div className="help-text">This is your Zakat 'snapshot' date. All asset values must be from this date.</div>
            </div>

            {/* Info Box */}
            <div className="info-box">
                🪙 <strong>All gold and silver is zakatable</strong> according to the Hanafi school, including all jewellery worn for personal use.<br /><br />
                <strong>INCLUDE THE FULL VALUE:</strong> You must include the total market value of all the gold and silver you owned on your calculation date.
            </div>

            {/* GOLD SECTION */}
            <div className="form-group">
                <label className="form-label">🥇 Gold Items</label>

                {state.assets.goldItems.map((item, idx) => (
                    <div className="gold-item-card" key={idx}>
                        <div className="gold-item-header">
                            <span className="gold-item-name">{item.name || 'Unnamed item'}</span>
                            <div className="gold-item-actions">
                                {/* Only allow delete for simplicity for now, edit is complex */}
                                <button className="btn-icon" onClick={() => removeGoldItem(idx)}>🗑️</button>
                            </div>
                        </div>
                        <div className="gold-item-details">
                            {item.inputType === 'weight'
                                ? `Weight: ${item.weight}g (${item.carat})`
                                : `Value: ${formatCurrency(sanitizeNumber(item.value), selectedCurrency)} (entered)`
                            }
                        </div>
                    </div>
                ))}

                <button className="btn-add" onClick={openModal}>+ Add Gold Item</button>
            </div>

            {/* YELLOW METAL MODAL */}
            {showGoldModal && (
                <div className="zakat-calculator-wizard-modal-overlay">
                    <div className="zakat-calculator-wizard-modal">
                        <div className="zakat-calculator-wizard-modal-header">
                            <h2 className="zakat-calculator-wizard-modal-title">Add Gold Item</h2>
                            <button className="zakat-calculator-wizard-modal-close" onClick={closeModal}>&times;</button>
                        </div>

                        <div className="zakat-calculator-wizard-modal-body">
                            <div className="form-group">
                                <label className="form-label">Item Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g., Wedding ring"
                                    value={goldItem.name}
                                    onChange={(e) => setGoldItem({ ...goldItem, name: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Input Method</label>
                                <div className="segmented-control">
                                    <button
                                        className={goldItem.inputType === 'weight' ? 'active' : ''}
                                        onClick={() => setGoldItem({ ...goldItem, inputType: 'weight' })}
                                    >By Weight</button>
                                    <button
                                        className={goldItem.inputType === 'value' ? 'active' : ''}
                                        onClick={() => setGoldItem({ ...goldItem, inputType: 'value' })}
                                    >By Value</button>
                                </div>
                            </div>

                            {goldItem.inputType === 'weight' ? (
                                <>
                                    <div className="form-group">
                                        <label className="form-label">Weight (grams)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            placeholder="0.00"
                                            value={goldItem.weight}
                                            onChange={(e) => setGoldItem({ ...goldItem, weight: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Carat / Purity</label>
                                        <select
                                            className="form-input"
                                            value={goldItem.carat}
                                            onChange={(e) => setGoldItem({ ...goldItem, carat: e.target.value })}
                                        >
                                            {Object.keys(CARAT_MULTIPLIERS).map(k => (
                                                <option key={k} value={k}>{k}</option>
                                            ))}
                                        </select>
                                    </div>
                                </>
                            ) : (
                                <div className="form-group">
                                    <label className="form-label">Current Value in {selectedCurrency}</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        placeholder="0.00"
                                        value={goldItem.value}
                                        onChange={(e) => setGoldItem({ ...goldItem, value: e.target.value })}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="zakat-calculator-wizard-modal-footer">
                            <button className="btn btn-previous" onClick={closeModal}>Cancel</button>
                            <button className="btn btn-add-primary" onClick={saveGoldItem}>Save Item</button>
                        </div>
                    </div>
                </div>
            )}

            {/* SILVER SECTION */}
            <div className="form-group">
                <label className="form-label">🥈 Silver</label>
                <div className="segmented-control">
                    <button
                        className={state.assets.silver.mode === 'weight' ? 'active' : ''}
                        onClick={() => updateSilver('mode', 'weight')}
                    >By Weight</button>
                    <button
                        className={state.assets.silver.mode === 'value' ? 'active' : ''}
                        onClick={() => updateSilver('mode', 'value')}
                    >By Value</button>
                </div>

                {state.assets.silver.mode === 'weight' ? (
                    <>
                        <input
                            type="number"
                            className="form-input"
                            placeholder="Weight in grams"
                            value={state.assets.silver.weight}
                            onChange={(e) => updateSilver('weight', e.target.value)}
                        />
                        {state.assets.silver.weight && (
                            <div className="help-text">
                                Approx Value: {formatCurrency(convertFromGBP(sanitizeNumber(state.assets.silver.weight) * silverPrice, selectedCurrency, exchangeRates), selectedCurrency)}
                            </div>
                        )}
                    </>
                ) : (
                    <input
                        type="number"
                        className="form-input"
                        placeholder="Current market value"
                        value={state.assets.silver.value}
                        onChange={(e) => updateSilver('value', e.target.value)}
                    />
                )}
            </div>

        </div>
    );
}
