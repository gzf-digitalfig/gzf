import React from 'react';
import { formatCurrency, sanitizeNumber } from '../../utils/zakatHelpers';

export default function PensionStep({ state, updateState }) {
    const selectedCurrency = state.currency || 'GBP';

    // Pension Logic Helpers
    const isAccessibleDC = state.pension.type === 'DC' && state.pension.access === 'Accessible';
    const pensionVal = sanitizeNumber(state.pension.value);
    const zakatableAmount = pensionVal * 0.4;
    const zakatDue = zakatableAmount * 0.025; // 1% of total

    return (
        <div>
            <div className="info-box">
                💼 <strong>Pension Zakat - Important Information</strong><br /><br />
                Pension Zakat rules depend on the type of pension and whether you can access it. Most scholars agree that accessible pensions are zakatable.
            </div>

            <div className="form-group">
                <label className="form-label">Do you have a pension?</label>
                <select
                    className="form-input"
                    value={state.pension.type}
                    onChange={(e) => updateState('pension', { ...state.pension, type: e.target.value })}
                >
                    <option value="NotSure">Not Sure / Don't Know</option>
                    <option value="None">No Pension</option>
                    <option value="DB">Defined Benefit (DB) - Final Salary</option>
                    <option value="DC">Defined Contribution (DC) - Pension Pot</option>
                </select>
            </div>

            {state.pension.type === 'None' && <p className="empty-state">No pension to include.</p>}

            {state.pension.type === 'NotSure' && (
                <div className="info-box-warning">
                    ℹ️ <strong>How to check:</strong><br />
                    • Workplace pensions are usually Defined Contribution (DC)<br />
                    • Public sector pensions are usually Defined Benefit (DB)
                </div>
            )}

            {state.pension.type === 'DB' && (
                <div className="result-box result-box-success" style={{ background: '#E8F5E9' }}>
                    ✓ No Zakat due on your DB pension (it is not a growing asset you own yet).
                </div>
            )}

            {state.pension.type === 'DC' && (
                <>
                    <div className="form-group">
                        <label className="form-label">Can you access your pension pot?</label>
                        <select
                            className="form-input"
                            value={state.pension.access}
                            onChange={(e) => updateState('pension', { ...state.pension, access: e.target.value })}
                        >
                            <option value="Locked">🔒 Locked - Cannot access yet (under pension age)</option>
                            <option value="Accessible">🔓 Accessible - Can withdraw now (over 55/57)</option>
                        </select>
                    </div>

                    {state.pension.access === 'Locked' ? (
                        <div className="result-box result-box-success" style={{ background: '#E8F5E9' }}>
                            ✓ No Zakat due on locked pensions.
                        </div>
                    ) : (
                        // Accessible DC
                        <>
                            <div className="info-box">
                                🔓 <strong>Accessible DC Pension - Zakat May Be Due</strong><br /><br />
                                We apply a <strong>1% rate</strong> on the total value (equivalent to 2.5% of the 40% zakatable portion).
                            </div>

                            <div className="form-group">
                                <label className="checkbox-group">
                                    <input
                                        type="checkbox"
                                        checked={state.pension.include}
                                        onChange={(e) => updateState('pension', { ...state.pension, include: e.target.checked })}
                                    />
                                    <span>Yes, include my accessible DC pension</span>
                                </label>
                            </div>

                            {state.pension.include && (
                                <div className="form-group">
                                    <label className="form-label">Total Pension Pot Value</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        placeholder="0.00"
                                        value={state.pension.value}
                                        onChange={(e) => updateState('pension', { ...state.pension, value: e.target.value })}
                                    />

                                    {state.pension.value && (
                                        <div className="pension-calc-box">
                                            <strong>Pension Zakat Calculation:</strong><br />
                                            Pot Value: {formatCurrency(pensionVal, selectedCurrency)}<br />
                                            Zakatable (40%): {formatCurrency(zakatableAmount, selectedCurrency)}<br />
                                            <strong className="pension-zakat-due">Zakat Due (1%): {formatCurrency(zakatDue, selectedCurrency)}</strong>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}
