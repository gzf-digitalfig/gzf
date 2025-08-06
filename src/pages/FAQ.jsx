import { useState } from 'react';

function FAQItem({ question, children, isOpen, onToggle }) {
  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      marginBottom: '1rem',
      overflow: 'hidden',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          padding: '1rem 1.5rem',
          backgroundColor: isOpen ? '#f8f9fa' : '#fff',
          border: 'none',
          textAlign: 'left',
          fontSize: '1.1rem',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'background-color 0.2s'
        }}
      >
        <span>{question}</span>
        <span style={{ 
          fontSize: '1.2rem',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s'
        }}>
          ▼
        </span>
      </button>
      {isOpen && (
        <div style={{
          padding: '1rem 1.5rem',
          backgroundColor: '#fafafa',
          borderTop: '1px solid #e0e0e0'
        }}>
          {children}
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
      <h1>FAQs</h1>
      
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#2c3e50', fontSize: '1.3rem' }}>🕌 GENERAL QUESTIONS</h2>
        
        <FAQItem 
          question="What is Zakat?" 
          isOpen={openItems['general-1']} 
          onToggle={() => toggleItem('general-1')}
        >
          <p>Zakat is an obligatory form of charity for eligible Muslims, usually calculated as 2.5% of one's surplus wealth. It purifies wealth and supports those in financial difficulty. Zakat is one of the five pillars of Islam.</p>
        </FAQItem>
        
        <FAQItem 
          question="What is the purpose of the Gloucester Zakat Fund?" 
          isOpen={openItems['general-2']} 
          onToggle={() => toggleItem('general-2')}
        >
          <p>Our fund collects and distributes Zakat locally to eligible Muslims in Gloucestershire, with a particular focus on Gloucester, helping those in hardship while adhering to Islamic principles.</p>
        </FAQItem>
        
        <FAQItem 
          question="Is the fund managed by qualified individuals?" 
          isOpen={openItems['general-3']} 
          onToggle={() => toggleItem('general-3')}
        >
          <p>Yes, the fund is overseen by a trusted team including community leaders and advisors with knowledge of Islamic finance and local welfare needs. All applications are reviewed with confidentiality, care, and accountability.</p>
        </FAQItem>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#2c3e50', fontSize: '1.3rem' }}>💰 FOR DONORS</h2>
        
        <FAQItem 
          question="Can I give my Zakat to a local cause?" 
          isOpen={openItems['donors-1']} 
          onToggle={() => toggleItem('donors-1')}
        >
          <p>Absolutely. Islam encourages giving Zakat to eligible individuals within your own locality (ahl al-balad), and our fund ensures it stays within the local community.</p>
        </FAQItem>
        
        <FAQItem 
          question="How do you assess if someone is eligible to receive Zakat?" 
          isOpen={openItems['donors-2']} 
          onToggle={() => toggleItem('donors-2')}
        >
          <p>We assess based on Islamic criteria, including assets, debts, income, and liabilities. The applicant must fall below the nisāb threshold and fit within one of the eight eligible categories mentioned in the Qur'ān (9:60).</p>
        </FAQItem>
        
        <FAQItem 
          question="Do you only accept Zakat, or can I give Sadaqah too?" 
          isOpen={openItems['donors-3']} 
          onToggle={() => toggleItem('donors-3')}
        >
          <p>We accept both Zakat and Sadaqah. While Zakat has strict guidelines, Sadaqah allows more flexibility to support a broader range of needs including non-Muslims, community projects, and urgent hardship.</p>
        </FAQItem>
        
        <FAQItem 
          question="Can I choose where my Zakat goes?" 
          isOpen={openItems['donors-4']} 
          onToggle={() => toggleItem('donors-4')}
        >
          <p>Zakat donations are pooled to ensure fair distribution based on need and eligibility. While we can't guarantee donor-directed allocations, you're welcome to contact us if you have a preference for supporting specific causes (e.g., refugees, housing support).</p>
        </FAQItem>
        
        <FAQItem 
          question="Will I get a receipt?" 
          isOpen={openItems['donors-5']} 
          onToggle={() => toggleItem('donors-5')}
        >
          <p>Receipts are automatically emailed for online donations. Receipts for cash and bank transfers can be arranged, if required.</p>
        </FAQItem>
        
        <FAQItem 
          question="Is my donation secure and confidential?" 
          isOpen={openItems['donors-6']} 
          onToggle={() => toggleItem('donors-6')}
        >
          <p>Yes. All donations are processed securely, and your personal data is protected under GDPR guidelines.</p>
        </FAQItem>
        
        <FAQItem 
          question="What is the current niṣāb threshold?" 
          isOpen={openItems['donors-7']} 
          onToggle={() => toggleItem('donors-7')}
        >
          <div>
            <p>The niṣāb is the minimum wealth a Muslim must have before Zakat becomes obligatory. It is based on the value of:</p>
            <ul>
              <li>87.48g of gold (~£X) or</li>
              <li>612.36g of silver (~£X)</li>
            </ul>
            <p>We recommend using the silver value to ensure more people benefit, but individuals may follow their preferred scholarly opinion. Please check updated prices before calculating your Zakat.</p>
          </div>
        </FAQItem>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#2c3e50', fontSize: '1.3rem' }}>🧕 FOR APPLICANTS</h2>
        
        <FAQItem 
          question="Who can apply for Zakat through this fund?" 
          isOpen={openItems['applicants-1']} 
          onToggle={() => toggleItem('applicants-1')}
        >
          <p>Muslims residing in Gloucestershire (particularly Gloucester) who are in financial hardship and fall below the niṣāb threshold may apply.</p>
        </FAQItem>
        
        <FAQItem 
          question="How do I apply?" 
          isOpen={openItems['applicants-2']} 
          onToggle={() => toggleItem('applicants-2')}
        >
          <p>You can apply using our online form, or request paper forms or in-person help. We will ask for ID and basic financial documents to assess eligibility.</p>
        </FAQItem>
        
        <FAQItem 
          question="What kind of help can I get?" 
          isOpen={openItems['applicants-3']} 
          onToggle={() => toggleItem('applicants-3')}
        >
          <div>
            <p>If eligible, we may assist with:</p>
            <ul>
              <li>Rent or utility arrears</li>
              <li>Essential food or clothing</li>
              <li>School or education costs</li>
              <li>Emergency living expenses</li>
            </ul>
          </div>
        </FAQItem>
        
        <FAQItem 
          question="How long does the process take?" 
          isOpen={openItems['applicants-4']} 
          onToggle={() => toggleItem('applicants-4')}
        >
          <p>We aim to respond to most applications within 5–10 working days. Emergency requests may be fast-tracked.</p>
        </FAQItem>
        
        <FAQItem 
          question="Do I need to be on benefits to qualify?" 
          isOpen={openItems['applicants-5']} 
          onToggle={() => toggleItem('applicants-5')}
        >
          <p>Not necessarily. Eligibility is based on Islamic criteria, not just benefit status. We consider your overall financial situation.</p>
        </FAQItem>
        
        <FAQItem 
          question="Will applying for Zakat affect my benefits or immigration status?" 
          isOpen={openItems['applicants-6']} 
          onToggle={() => toggleItem('applicants-6')}
        >
          <p>No. Zakat is classed as charitable support and does not count as income for benefit purposes. It is also safe for individuals with no recourse to public funds.</p>
        </FAQItem>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#2c3e50', fontSize: '1.3rem' }}>🙋 VOLUNTEERING & COMMUNITY</h2>
        
        <FAQItem 
          question="How can I help?" 
          isOpen={openItems['volunteering-1']} 
          onToggle={() => toggleItem('volunteering-1')}
        >
          <p>You can support our work by volunteering your time or skills. Please contact us using the details on our website to offer help.</p>
        </FAQItem>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#2c3e50', fontSize: '1.3rem' }}>🔐 PRIVACY & TRANSPARENCY</h2>
        
        <FAQItem 
          question="Is my information kept confidential?" 
          isOpen={openItems['privacy-1']} 
          onToggle={() => toggleItem('privacy-1')}
        >
          <p>Yes. All data is stored securely, and only authorised reviewers will access it for the purpose of assessing need. We are fully GDPR compliant.</p>
        </FAQItem>
        
        <FAQItem 
          question="Do you publish reports or audits?" 
          isOpen={openItems['privacy-2']} 
          onToggle={() => toggleItem('privacy-2')}
        >
          <p>We intend to publish anonymised annual reports to show how Zakat was distributed, building community trust and transparency.</p>
        </FAQItem>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#2c3e50', fontSize: '1.3rem' }}>🧭 ISLAMIC COMPLIANCE</h2>
        
        <FAQItem 
          question="How do you ensure Zakat is distributed correctly?" 
          isOpen={openItems['compliance-1']} 
          onToggle={() => toggleItem('compliance-1')}
        >
          <p>Zakat is only given to those who meet the Islamic criteria in Qur'ān 9:60. There is no scenario in which Zakat is used for admin purposes, except where those directly reviewing or distributing it are themselves eligible to receive Zakat (e.g., ʿāmilīn ʿalayhā).</p>
        </FAQItem>
        
        <FAQItem 
          question="Which Islamic scholars or schools do you follow?" 
          isOpen={openItems['compliance-2']} 
          onToggle={() => toggleItem('compliance-2')}
        >
          <p>Our understanding and application of Zakat is based on the Qur'ān and Sunnah, and predominantly the interpretation of Ḥanafī scholars.</p>
        </FAQItem>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#2c3e50', fontSize: '1.3rem' }}>📩 STILL HAVE QUESTIONS?</h2>
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e0e0e0'
        }}>
          <p style={{ margin: 0 }}>Please contact us using the form or contact details on our website. We're happy to help.</p>
        </div>
      </section>
    </div>
  );
}
