import React from 'react';
import { NavLink } from 'react-router-dom';
import DonationForm from '../components/DonationForm';
import BankTransfer from '../components/BankTransfer';

export default function Donate() {
    return (
        <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ color: 'var(--primary-green)', fontWeight: '700', marginBottom: '1rem' }}>Donate to Gloucester Zakat Fund</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    Your Zakat and Sadaqa help local families in need. 100% of your donation policy applies.
                </p>
            </div>

            <div className="standalone-donate-section">
                <div className="card donate-card" style={{ textAlign: 'center', padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                    <h2>Make a Donation</h2>
                    <p style={{ marginBottom: '1.5rem' }}>Select your donation type and amount below.</p>

                    <DonationForm />
                </div>
            </div>

            {/* Bank Transfer */}
            <BankTransfer />

            <div style={{ textAlign: 'center', marginTop: '2rem', marginBottom: '4rem' }}>
                <NavLink to="/calculatezakat" className="btn btn-secondary" style={{ padding: '0.8rem 2rem' }}>
                    Need to calculate your Zakat first?
                </NavLink>
            </div>
        </div>
    );
}
