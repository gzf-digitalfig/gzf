import { useState, useEffect } from 'react';
import faqData from '../content/pages/faq.json';
import ReactMarkdown from 'react-markdown';

export default function FAQ() {
  const { pageTitle, introText, sections } = faqData;

  useEffect(() => {
    // Handle hash scrolling if present
    if (window.location.hash) {
      const element = document.querySelector(window.location.hash);
      if (element) {
        setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, []);

  return (
    <div className="container faq-page" style={{ paddingBottom: '4rem', paddingTop: '4rem' }}>
      <div className="mb-8 max-w-3xl">
        <h1 className="mb-4">
          {pageTitle.split(' ').map((word, i, arr) => (
            <span key={i} style={{ color: i === arr.length - 1 ? 'var(--primary-green)' : 'inherit' }}>{word} </span>
          ))}
        </h1>
        <p className="lead">{introText}</p>
      </div>

      <div className="faq-layout">
        {/* Sidebar */}
        <aside className="faq-sidebar">
          <nav className="faq-nav">
            <h3 className="faq-nav-title">Categories</h3>
            {sections.map(cat => (
              <a key={cat.id} href={`#${cat.id}`} className="faq-nav-link group">
                <span className="material-symbols-outlined">{cat.icon}</span>
                {cat.title}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="faq-content">
          {sections.map(section => (
            <section key={section.id} id={section.id} className="faq-section">
              <div className="section-header">
                <div className="icon-box"><span className="material-symbols-outlined">{section.icon}</span></div>
                <h2>{section.title}</h2>
              </div>
              <div className="faq-grid">
                {section.items.map((item, idx) => (
                  <details className="faq-item" key={idx}>
                    <summary className="faq-summary">
                      <span>{item.question}</span>
                      <span className="material-symbols-outlined expand-icon">expand_more</span>
                    </summary>
                    <div className="faq-answer-content">
                      <ReactMarkdown>{item.answer}</ReactMarkdown>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}

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
