import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function Donate() {
    const [amount, setAmount] = useState('');
    const [donationType, setDonationType] = useState('zakat'); // zakat, sadaqah, lillah

    const GIVING_FUND_URL = "https://www.paypal.com/gb/fundraiser/charity/5731751";

    const handleGivingFundDonate = () => {
        let message = `You are about to be redirected to the PayPal Giving Fund.\n\n`;
        message += `Please manually enter your donation amount on the PayPal page.\n`;
        message += `Your selected type: ${donationType.toUpperCase()}`;

        if (amount) {
            message += `\nRecommended amount to enter: £${amount}`;
        }

        alert(message);
        window.open(GIVING_FUND_URL, '_blank', 'noopener,noreferrer');
    };

    const handleStandardPayPalDonate = () => {
        if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            alert("Please enter a valid donation amount.");
            return;
        }

        const displayNames = {
            'zakat': 'Zakat',
            'sadaqah': 'Sadaqah',
            'lillah': 'Lillah'
        };

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
        <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ color: 'var(--primary-green)', fontWeight: '700', marginBottom: '1rem' }}>Donate to Gloucester Zakat Fund</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    Your Zakat and Sadaqah help local families in need. 100% of your donation policy applies.
                </p>
            </div>

            <div className="standalone-donate-section">
                <div className="card donate-card" style={{ textAlign: 'center', padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                    <h2>Make a Donation</h2>
                    <p style={{ marginBottom: '1.5rem' }}>Select your donation type and amount below.</p>

                    {/* Donation Type Toggles */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                        {['zakat', 'sadaqah', 'lillah'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setDonationType(type)}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    border: '2px solid var(--primary-green)',
                                    background: donationType === type ? 'var(--primary-green)' : 'white',
                                    color: donationType === type ? 'white' : 'var(--primary-green)',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    textTransform: 'capitalize',
                                    flex: '1 1 auto',
                                    maxWidth: '120px'
                                }}
                            >
                                {type}
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

                    {/* Payment Buttons */}
                    <div className="donate-action" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>

                        {/* Quick & Easy (Standard PayPal) */}
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

                        <div style={{ fontSize: '0.9rem', color: '#666' }}>— OR —</div>

                        {/* No Fees (Giving Fund) */}
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

            {/* Bank Transfer */}
            <div className="card" style={{ textAlign: 'center', marginTop: '3rem', maxWidth: '800px', margin: '3rem auto 0 auto' }}>
                <h2 style={{ color: 'var(--primary-green)', marginBottom: '1rem' }}>Bank Transfer</h2>
                <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                    Direct transfer to our charity account is the most efficient way to donate.
                </p>

                <div style={{ background: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: '12px', textAlign: 'left', display: 'inline-block', width: '100%', maxWidth: '400px' }}>
                    <div style={{ marginBottom: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Bank:</span>
                        <span>HSBC</span>
                    </div>
                    <div style={{ marginBottom: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Account Name:</span>
                        <span>Gloucester Zakat Fund</span>
                    </div>
                    <div style={{ marginBottom: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Sort Code:</span>
                        <span style={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>40-22-09</span>
                    </div>
                    <div style={{ marginBottom: '0', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Account No:</span>
                        <span style={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>32684810</span>
                    </div>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#888', marginTop: '1rem' }}>
                    Please use "ZAKAT", "SADAQAH" or "LILLAH" as your payment reference.
                </p>
            </div>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <NavLink to="/calculatezakat" className="btn btn-secondary" style={{ padding: '0.8rem 2rem' }}>
                    Need to calculate your Zakat first?
                </NavLink>
            </div>
        </div>
    );
}
