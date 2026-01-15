import React, { useState, useEffect } from 'react';

export default function DonationForm({ initialAmount = '', initialType = 'zakat' }) {
    const [amount, setAmount] = useState(initialAmount);
    const [donationType, setDonationType] = useState(initialType);

    // Update amount if initialAmount changes (e.g. from calculator)
    useEffect(() => {
        if (initialAmount) {
            setAmount(initialAmount);
        }
    }, [initialAmount]);

    const GIVING_FUND_URL = "https://www.paypal.com/gb/fundraiser/charity/5731751";

    const displayNames = {
        'zakat': 'Zakat',
        'sadaqa_wajib': 'Sadaqa (Wajib)',
        'sadaqa_lillah': 'Sadaqa (Lillah)',
        'sadaqatul_fitr': 'Sadaqatul Fitr'
    };

    const handleGivingFundDonate = () => {
        window.open(GIVING_FUND_URL, '_blank', 'noopener,noreferrer');
    };

    const handleStandardPayPalDonate = () => {
        if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            alert("Please enter a valid donation amount.");
            return;
        }

        const paypalUrl = 'https://www.paypal.com/cgi-bin/webscr?' +
            'cmd=_xclick&' +
            'business=gloucesterzf@gmail.com&' +
            'item_name=' + encodeURIComponent(`${displayNames[donationType]} Donation - Gloucester Zakat Fund`) + '&' +
            'amount=' + parseFloat(amount).toFixed(2) + '&' +
            'currency_code=GBP&' +
            'no_shipping=1&' +
            'no_note=1&' +
            'return=' + encodeURIComponent('https://gloucesterzakat.com/donate') + '&' + // Fallback return URL
            'cancel_return=' + encodeURIComponent('https://gloucesterzakat.com/donate');

        window.open(paypalUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="donation-form-container">
            {/* Donation Type Toggles */}
            <div className="donation-type-container">
                {[
                    { id: 'zakat', label: 'Zakat' },
                    { id: 'sadaqa_wajib', label: 'Sadaqa (Wajib)' },
                    { id: 'sadaqa_lillah', label: 'Sadaqa (Lillah)' },
                    { id: 'sadaqatul_fitr', label: 'Sadaqatul Fitr' }
                ].map((type) => (
                    <button
                        key={type.id}
                        onClick={() => setDonationType(type.id)}
                        className="donation-type-btn"
                        style={{
                            background: donationType === type.id ? 'var(--primary-green)' : 'white',
                            color: donationType === type.id ? 'white' : 'var(--primary-green)',
                        }}
                    >
                        {type.label}
                    </button>
                ))}
            </div>

            {/* Amount Input */}
            <div style={{ marginBottom: '25px', maxWidth: '300px', margin: '0 auto 25px auto' }}>
                <label style={{ display: 'block', textAlign: 'left', marginBottom: '8px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    Amount (£)
                </label>
                <input
                    type="number"
                    placeholder="Enter amount (e.g. 50)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="1"
                    step="0.01"
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        fontSize: '1.1rem'
                    }}
                />
            </div>

            {/* Payment Buttons - Strict Logic: Quick & Easy only for Lillah */}
            <div className="donate-action" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>

                {donationType === 'sadaqa_lillah' ? (
                    <>
                        {/* Quick & Easy (Standard PayPal) - AVAILABLE ONLY FOR LILLAH */}
                        <button
                            onClick={handleStandardPayPalDonate}
                            className="btn"
                            style={{
                                width: '100%',
                                maxWidth: '350px',
                                padding: '15px',
                                background: '#0070BA', // PayPal Blue
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '700',
                                fontSize: '1.1rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px'
                            }}
                        >
                            <span>⚡ Pay Now (Quick & Easy)</span>
                        </button>
                        <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '-10px', maxWidth: '350px' }}>
                            Standard PayPal (fees may apply)
                        </p>

                        <div style={{ fontSize: '0.9rem', color: '#666' }}>— OR —</div>
                    </>
                ) : (
                    <div style={{ marginBottom: '5px', padding: '10px', background: '#e8f5e9', borderRadius: '8px', color: '#2e7d32', fontSize: '0.9rem', maxWidth: '350px' }}>
                        <strong>100% Donation Policy:</strong><br />To ensure no fees are deducted from your {displayNames[donationType]}, please use the Giving Fund option below.
                    </div>
                )}

                {/* No Fees (Giving Fund) - ALWAYS AVAILABLE */}
                <button
                    onClick={handleGivingFundDonate}
                    className="btn"
                    style={{
                        width: '100%',
                        maxWidth: '350px',
                        padding: '15px',
                        background: 'white',
                        color: 'var(--primary-green)',
                        border: '2px solid var(--primary-green)',
                        borderRadius: '8px',
                        fontWeight: '700',
                        fontSize: '1.1rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                    }}
                >
                    <span>💚 Pay via Giving Fund (No Fees)</span>
                </button>
                <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '-5px', maxWidth: '350px' }}>
                    100% of your donation reaches us. Requires manual entry on PayPal.
                </p>

            </div>

            <div className="gift-aid-message" style={{
                marginTop: '1.5rem',
                background: 'var(--bg-secondary)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px dashed var(--primary-green)',
                fontSize: '0.95rem',
                color: 'var(--text-primary)',
                textAlign: 'center',
                maxWidth: '800px',
                margin: '1.5rem auto 0 auto'
            }}>
                <p style={{ margin: 0 }}>
                    We kindly ask that you click the <strong>Gift Aid</strong> button on your emailed receipt (or check the box if paying via Standard PayPal). This allows us to reclaim an extra 25p for every £1 you donate at no extra cost to you.
                </p>
            </div>
        </div>
    );
}
