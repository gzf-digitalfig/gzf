
export default function FAQ() {
  const categories = [
    { id: 'general', title: 'General Questions', icon: 'grid_view' },
    { id: 'donors', title: 'For Donors', icon: 'volunteer_activism' },
    { id: 'applicants', title: 'For Applicants', icon: 'diversity_3' },
    { id: 'volunteering', title: 'Volunteering & Community', icon: 'handshake' },
    { id: 'privacy', title: 'Privacy & Transparency', icon: 'security' },
    { id: 'compliance', title: 'Islamic Compliance', icon: 'balance' }
  ];

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      <div className="mb-8 max-w-3xl">
        <h1 className="mb-4">Frequently Asked <span style={{ color: 'var(--primary-green)' }}>Questions</span></h1>
        <p className="lead">Find clear answers about your Zakat obligations, how we distribute funds locally, and transparency in our donation process.</p>
      </div>

      <div className="faq-layout">
        {/* Sidebar */}
        <aside className="faq-sidebar">
          <nav className="faq-nav">
            <h3 className="faq-nav-title">Categories</h3>
            {categories.map(cat => (
              <a key={cat.id} href={`#${cat.id}`} className="faq-nav-link group">
                <span className="material-symbols-outlined">{cat.icon}</span>
                {cat.title}
              </a>
            ))}
          </nav>


        </aside>

        {/* Main Content */}
        <main className="faq-content">
          <section id="general" className="faq-section">
            <div className="section-header">
              <div className="icon-box"><span className="material-symbols-outlined">grid_view</span></div>
              <h2>General Questions</h2>
            </div>
            <div className="faq-grid">
              <details className="faq-item">
                <summary className="faq-summary">
                  <span>What is Zakat?</span>
                  <span className="material-symbols-outlined expand-icon">expand_more</span>
                </summary>
                <div className="faq-answer-content">
                  <p>Zakat is an obligatory form of charity for eligible Muslims, usually calculated as 2.5% of one's surplus wealth. It purifies wealth and supports those in financial difficulty. Zakat is one of the five pillars of Islam.</p>
                </div>
              </details>
              <details className="faq-item">
                <summary className="faq-summary">
                  <span>What is the purpose of the Gloucester Zakat Fund?</span>
                  <span className="material-symbols-outlined expand-icon">expand_more</span>
                </summary>
                <div className="faq-answer-content">
                  <p>Our charity collects and distributes Zakat locally to eligible Muslims in Gloucestershire, with a particular focus on Gloucester, helping those in hardship while adhering to Islamic principles.</p>
                </div>
              </details>
              <details className="faq-item">
                <summary className="faq-summary">
                  <span>Is the fund managed by qualified individuals?</span>
                  <span className="material-symbols-outlined expand-icon">expand_more</span>
                </summary>
                <div className="faq-answer-content">
                  <p>Yes, the fund is overseen by a trusted team including community leaders and advisors with knowledge of Islamic finance and local welfare needs. All applications are reviewed with confidentiality, care, and accountability.</p>
                </div>
              </details>
            </div>
          </section>

          <section id="donors" className="faq-section">
            <div className="section-header">
              <div className="icon-box"><span className="material-symbols-outlined">volunteer_activism</span></div>
              <h2>For Donors</h2>
            </div>
            <div className="faq-grid">
              <details className="faq-item">
                <summary className="faq-summary">
                  <span>Can I give my Zakat to a local cause?</span>
                  <span className="material-symbols-outlined expand-icon">expand_more</span>
                </summary>
                <div className="faq-answer-content">
                  <p>Absolutely. Islam encourages giving Zakat to eligible individuals within your own locality (ahl al-balad), and our fund ensures it stays within the local community.</p>
                </div>
              </details>
              <details className="faq-item">
                <summary className="faq-summary">
                  <span>How do you assess if someone is eligible to receive Zakat?</span>
                  <span className="material-symbols-outlined expand-icon">expand_more</span>
                </summary>
                <div className="faq-answer-content">
                  <p>We assess based on Islamic criteria, including assets, debts, income, and liabilities. The applicant must fall below the nisāb threshold and fit within one of the eight eligible categories mentioned in the Qur'ān (9:60).</p>
                </div>
              </details>
              <details className="faq-item">
                <summary className="faq-summary">
                  <span>Do you only accept Zakat, or can I give Sadaqa too?</span>
                  <span className="material-symbols-outlined expand-icon">expand_more</span>
                </summary>
                <div className="faq-answer-content">
                  <p>We accept both Zakat and Sadaqa. While Zakat has strict guidelines, Sadaqa allows more flexibility to support a broader range of needs including non-Muslims, community projects, and urgent hardship.</p>
                </div>
              </details>
              <details className="faq-item">
                <summary className="faq-summary">
                  <span>Can I choose where my Zakat goes?</span>
                  <span className="material-symbols-outlined expand-icon">expand_more</span>
                </summary>
                <div className="faq-answer-content">
                  <p>Zakat donations are pooled to ensure fair distribution based on need and eligibility. While we can't guarantee donor-directed allocations, you're welcome to contact us if you have a preference for supporting specific causes (e.g., refugees, housing support).</p>
                </div>
              </details>
              <details className="faq-item">
                <summary className="faq-summary">
                  <span>Will I get a receipt?</span>
                  <span className="material-symbols-outlined expand-icon">expand_more</span>
                </summary>
                <div className="faq-answer-content">
                  <p>Receipts are automatically emailed for online donations. Receipts for cash and bank transfers can be arranged, if required.</p>
                </div>
              </details>
              <details className="faq-item">
                <summary className="faq-summary">
                  <span>Is my donation secure and confidential?</span>
                  <span className="material-symbols-outlined expand-icon">expand_more</span>
                </summary>
                <div className="faq-answer-content">
                  <p>Yes. All donations are processed securely, and your personal data is protected under GDPR guidelines.</p>
                </div>
              </details>
              <details className="faq-item">
                <summary className="faq-summary">
                  <span>What is the current niṣāb threshold?</span>
                  <span className="material-symbols-outlined expand-icon">expand_more</span>
                </summary>
                <div className="faq-answer-content">
                  <p>The niṣāb is the minimum wealth a Muslim must have before Zakat becomes obligatory. It is based on the value of:</p>
                  <ul className="list-disc pl-5 mt-2 mb-2">
                    <li>87.48g of gold (~£X) or</li>
                    <li>612.36g of silver (~£X)</li>
                  </ul>
                  <p>We recommend using the silver value to ensure more people benefit, but individuals may follow their preferred scholarly opinion. Please check updated prices before calculating your Zakat.</p>
                </div>
              </details>
            </div>
          </section>

          <section id="applicants" className="faq-section">
            <div className="section-header">
              <div className="icon-box"><span className="material-symbols-outlined">diversity_3</span></div>
              <h2>For Applicants</h2>
            </div>
            <div className="faq-grid">
              <details className="faq-item">
                <summary className="faq-summary">
                  <span>Who can apply for Zakat through this fund?</span>
                  <span className="material-symbols-outlined expand-icon">expand_more</span>
                </summary>
                <div className="faq-answer-content">
                  <p>Muslims residing in Gloucestershire (particularly Gloucester) who are in financial hardship and fall below the niṣāb threshold may apply.</p>
                </div>
              </details>
              <details className="faq-item">
                <summary className="faq-summary">
                  <span>How do I apply?</span>
                  <span className="material-symbols-outlined expand-icon">expand_more</span>
                </summary>
                <div className="faq-answer-content">
                  <p>You can apply using our online form, or request paper forms or in-person help. We will ask for ID and basic financial documents to assess eligibility.</p>
                </div>
              </details>
              <details className="faq-item">
                <summary className="faq-summary">
                  <span>What kind of help can I get?</span>
                  <span className="material-symbols-outlined expand-icon">expand_more</span>
                </summary>
                <div className="faq-answer-content">
                  <p>If eligible, we may assist with:</p>
                  <ul className="list-disc pl-5 mt-2">
                    <li>Rent or utility arrears</li>
                    <li>Essential food or clothing</li>
                    <li>School or education costs</li>
                    <li>Emergency living expenses</li>
                  </ul>
                </div>
              </details>
              <details className="faq-item">
                <summary className="faq-summary">
                  <span>How long does the process take?</span>
                  <span className="material-symbols-outlined expand-icon">expand_more</span>
                </summary>
                <div className="faq-answer-content">
                  <p>We aim to respond to most applications within 5–10 working days. Emergency requests may be fast-tracked.</p>
                </div>
              </details>
              <details className="faq-item">
                <summary className="faq-summary">
                  <span>Do I need to be on benefits to qualify?</span>
                  <span className="material-symbols-outlined expand-icon">expand_more</span>
                </summary>
                <div className="faq-answer-content">
                  <p>Not necessarily. Eligibility is based on Islamic criteria, not just benefit status. We consider your overall financial situation.</p>
                </div>
              </details>
              <details className="faq-item">
                <summary className="faq-summary">
                  <span>Will applying for Zakat affect my benefits or immigration status?</span>
                  <span className="material-symbols-outlined expand-icon">expand_more</span>
                </summary>
                <div className="faq-answer-content">
                  <p>No. Zakat is classed as charitable support and does not count as income for benefit purposes. It is also safe for individuals with no recourse to public funds.</p>
                </div>
              </details>
            </div>
          </section>

          <section id="volunteering" className="faq-section">
            <div className="section-header">
              <div className="icon-box"><span className="material-symbols-outlined">handshake</span></div>
              <h2>Volunteering & Community</h2>
            </div>
            <div className="faq-grid">
              <details className="faq-item">
                <summary className="faq-summary">
                  <span>How can I help?</span>
                  <span className="material-symbols-outlined expand-icon">expand_more</span>
                </summary>
                <div className="faq-answer-content">
                  <p>You can support our work by volunteering your time or skills. Please contact us using the details on our website to offer help.</p>
                </div>
              </details>
            </div>
          </section>

          <section id="privacy" className="faq-section">
            <div className="section-header">
              <div className="icon-box"><span className="material-symbols-outlined">security</span></div>
              <h2>Privacy & Transparency</h2>
            </div>
            <div className="faq-grid">
              <details className="faq-item">
                <summary className="faq-summary">
                  <span>Is my information kept confidential?</span>
                  <span className="material-symbols-outlined expand-icon">expand_more</span>
                </summary>
                <div className="faq-answer-content">
                  <p>Yes. All data is stored securely, and only authorised reviewers will access it for the purpose of assessing need. We are fully GDPR compliant.</p>
                </div>
              </details>
              <details className="faq-item">
                <summary className="faq-summary">
                  <span>Do you publish reports or audits?</span>
                  <span className="material-symbols-outlined expand-icon">expand_more</span>
                </summary>
                <div className="faq-answer-content">
                  <p>We intend to publish anonymised annual reports to show how Zakat was distributed, building community trust and transparency.</p>
                </div>
              </details>
            </div>
          </section>

          <section id="compliance" className="faq-section">
            <div className="section-header">
              <div className="icon-box"><span className="material-symbols-outlined">balance</span></div>
              <h2>Islamic Compliance</h2>
            </div>
            <div className="faq-grid">
              <details className="faq-item">
                <summary className="faq-summary">
                  <span>How do you ensure Zakat is distributed correctly?</span>
                  <span className="material-symbols-outlined expand-icon">expand_more</span>
                </summary>
                <div className="faq-answer-content">
                  <p>Zakat is only given to those who meet the Islamic criteria in Qur'ān 9:60. There is no scenario in which Zakat is used for admin purposes, except where those directly reviewing or distributing it are themselves eligible to receive Zakat (e.g., ʿāmilīn ʿalayhā).</p>
                </div>
              </details>
              <details className="faq-item">
                <summary className="faq-summary">
                  <span>Which Islamic scholars or schools do you follow?</span>
                  <span className="material-symbols-outlined expand-icon">expand_more</span>
                </summary>
                <div className="faq-answer-content">
                  <p>Our understanding and application of Zakat is based on the Qur'ān and Sunnah, and predominantly the interpretation of Ḥanafī scholars.</p>
                </div>
              </details>
            </div>
          </section>

          <div className="contact-cta-card">
            <div className="icon-circle">
              <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>support_agent</span>
            </div>
            <h3>Still have questions?</h3>
            <p>Zakat can be complex. Our dedicated team of scholars and support staff are here to help you navigate your specific situation.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              <a href="/contact" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>mail</span> Contact Support
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
