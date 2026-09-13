import React from 'react';
import { NavLink } from 'react-router-dom';
import DonationForm from '../components/DonationForm';
import BankTransfer from '../components/BankTransfer';

export default function Donate() {
    return (
        <div className="container" style={{ paddingTop: '4rem' }}>
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

            <section className="gift-aid-consent" aria-labelledby="gift-aid-heading">
                <div className="gift-aid-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 12v10H4V12" />
                        <path d="M2 7h20v5H2z" />
                        <path d="M12 22V7" />
                        <path d="M12 7H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7Z" />
                        <path d="M12 7h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7Z" />
                    </svg>
                </div>

                <div className="gift-aid-content">
                    <p className="gift-aid-eyebrow">Make your donation go further</p>
                    <h2 id="gift-aid-heading">Gloucester Zakat Fund – Gift Aid Consent</h2>
                    <p>
                        Alhamdulillah, we are finally registered with HMRC to reclaim Gift Aid on all donations made to Gloucester Zakat Fund. If you are a UK taxpayer, we can reclaim an extra 25p in Gift Aid for every £1 you give through the government&apos;s Gift Aid scheme. This does not cost you a penny.
                    </p>
                    <p>
                        We have prepared a very short form to complete. It will take no longer than a minute or so. All details remain strictly confidential and compliant with data protection guidelines. Gift Aid we reclaim will be used to further our local contributions and cover any admin and operational costs.
                    </p>
                    <a
                        className="btn gift-aid-button"
                        href="https://forms.gle/jRVfkhwLFDy49Vf77"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Complete the Gift Aid form
                        <span aria-hidden="true">↗</span>
                    </a>
                    <p className="gift-aid-thanks">
                        JazakAllah khaira, as always, for supporting your local community.
                    </p>
                </div>
            </section>

            <div style={{ textAlign: 'center', marginTop: '2rem', marginBottom: '4rem' }}>
                <NavLink to="/calculatezakat" className="btn btn-secondary" style={{ padding: '0.8rem 2rem' }}>
                    Need to calculate your Zakat first?
                </NavLink>
            </div>
        </div>
    );
}
