import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Donate() {
    const PAYPAL_URL = "https://www.paypal.com/gb/fundraiser/charity/5731751";

    const handleDonate = () => {
        window.open(PAYPAL_URL, '_blank', 'noopener,noreferrer');
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
                <div className="card donate-card" style={{ textAlign: 'center', padding: '2rem' }}>
                    <h2>Make a Donation</h2>
                    <p style={{ marginBottom: '1.5rem' }}>Want to donate zakat without calculating first? You can make a direct donation to support our community now.</p>

                    <div className="donate-action" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                        <button
                            onClick={handleDonate}
                            className="btn btn-primary donate-btn"
                            style={{ width: '100%', maxWidth: '300px', fontSize: '1.1rem', padding: '10px 20px' }}
                        >
                            Donate Now
                        </button>
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
                    textAlign: 'center'
                }}>
                    <p style={{ margin: 0 }}>
                        We kindly ask that you click the <strong>Gift Aid</strong> button on your emailed receipt. This allows us to reclaim an extra 25p for every £1 you donate at no extra cost to you, which allows us to pay our admin costs.
                    </p>
                </div>
            </div>

            {/* Bank Transfer */}
            <div className="card" style={{ textAlign: 'center', marginTop: '3rem' }}>
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
                    Please use "ZAKAT" or "SADAQAH" as your payment reference.
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
