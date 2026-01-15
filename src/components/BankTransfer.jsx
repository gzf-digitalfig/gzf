import React from 'react';

export default function BankTransfer() {
    return (
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
                Please use "ZAKAT", "SADAQA", "LILLAH" or "FITR" as your payment reference.
            </p>
        </div>
    );
}
