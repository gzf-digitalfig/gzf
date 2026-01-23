import { useState, useEffect } from "react";
import aboutData from "../content/pages/about.json";
import "./About.css";

const trustees = aboutData.trustees.list || [];

function TrusteeCard({ name, role, bio, onReadMore }) {
  return (
    <div className="trustee-card">
      <div className="trustee-image">
        <span className="material-symbols-outlined">person</span>
      </div>
      <div className="trustee-content">
        <h3>{name}</h3>
        <span className="trustee-role">{role}</span>
        <p className="trustee-bio-preview">
          {bio}
        </p>
        <button
          className="read-more-link"
          onClick={onReadMore}
        >
          Read More
        </button>
      </div>
    </div>
  );
}

function BioModal({ trustee, onClose }) {
  if (!trustee) return null;

  return (
    <div className="bio-modal-overlay" onClick={onClose}>
      <div className="bio-modal-content" onClick={e => e.stopPropagation()}>
        <button className="bio-modal-close" onClick={onClose}>
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="bio-modal-header">
          <div className="bio-modal-avatar">
            <span className="material-symbols-outlined">person</span>
          </div>
          <div>
            <h2>{trustee.name}</h2>
            <span className="trustee-role">{trustee.role}</span>
          </div>
        </div>
        <div className="bio-modal-body">
          <p>{trustee.bio}</p>
        </div>
      </div>
    </div>
  );
}

export default function About() {
  const [selectedTrustee, setSelectedTrustee] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-page">
      {/* ============================================
          1. HERO SECTION
          ============================================ */}
      <header className="about-hero">
        <div className="about-hero-content">
          <h1>
            {aboutData.heroTitle && aboutData.heroTitle.split('\n').map((line, i) => (
              <span key={i} style={{ display: 'block', color: i === 1 ? 'var(--primary-green)' : 'inherit' }}>{line}</span>
            ))}
            {!aboutData.heroTitle && <>About Gloucester<br /><span>Zakat Fund</span></>}
          </h1>
          <p>
            {aboutData.heroSubtitle}
          </p>
          <div className="hero-buttons">
            <a href="/donate" className="btn">
              Donate Now
            </a>
            <a href="/apply" className="btn btn-secondary" style={{ background: 'white', border: '1px solid #e5e7eb' }}>
              Apply for Help
            </a>
          </div>
        </div>
      </header>

      {/* ============================================
          2. CHARITY INFORMATION SECTION
          ============================================ */}
      <section className="policy-section">
        <div className="policy-container">
          <div className="policy-card">
            <div className="policy-content">
              <div className="policy-text">
                <span className="policy-badge">
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>verified</span>
                  Registered Charity
                </span>
                <h2>{aboutData.policySection?.title || "Charity Information"}</h2>
                <p>
                  {aboutData.policySection?.intro}
                </p>

                <div className="charity-info-table-wrapper">
                  <table className="charity-info-table">
                    <tbody>
                      <tr>
                        <td>Charity Number</td>
                        <td>{aboutData.policySection?.charityNumber}</td>
                      </tr>
                      <tr>
                        <td>Registration</td>
                        <td>{aboutData.policySection?.registration}</td>
                      </tr>
                      <tr>
                        <td>Focus Area</td>
                        <td>{aboutData.policySection?.focusArea}</td>
                      </tr>
                      <tr>
                        <td>Target Community</td>
                        <td>{aboutData.policySection?.targetCommunity}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          3. KEY SERVICES SECTION (was Mission/Vision)
          ============================================ */}
      <section className="mission-section">
        <div className="mission-container">
          <div className="trustees-header">
            <div className="trustees-header-text">
              <h2>{aboutData.keyServices?.title}</h2>
              <p>
                {aboutData.keyServices?.intro}
              </p>
            </div>
            <div></div>
          </div>

          <div className="mission-grid">
            {aboutData.keyServices?.services?.map((service, index) => (
              <div className="mission-card" key={index}>
                <div className="mission-icon">
                  <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>{service.icon}</span>
                </div>
                <h2>{service.title}</h2>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ============================================
          4. TRUSTEES SECTION
          ============================================ */}
      <section className="trustees-section">
        <div className="trustees-container">
          <div className="trustees-header">
            <div className="trustees-header-text">
              <h2>{aboutData.trustees?.title}</h2>
              <p>
                {aboutData.trustees?.intro}
              </p>
            </div>
            {/* Link removed as requested */}
            <div></div>
          </div>

          <div className="trustees-grid">
            {trustees.map((trustee, index) => (
              <TrusteeCard
                key={index}
                {...trustee}
                onReadMore={() => setSelectedTrustee(trustee)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Bio Modal */}
      <BioModal
        trustee={selectedTrustee}
        onClose={() => setSelectedTrustee(null)}
      />


      {/* ============================================
          5. GZF IN THE COMMUNITY (Timeline)
          ============================================ */}
      <section className="timeline-section">
        <div className="timeline-container">
          <div className="timeline-header">
            <h2>{aboutData.timeline?.title}</h2>
            <p>
              {aboutData.timeline?.intro}
            </p>
          </div>

          <div className="timeline-list">
            {aboutData.timeline?.items?.map((item, index) => (
              <div className="timeline-item" key={index}>
                <div className="timeline-marker"></div>
                <div className="timeline-item-content">
                  <span className="timeline-badge">{item.badge}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Merged Partners Section */}
          <div className="partners-inline-content">
            <h3>{aboutData.introTitle}</h3>
            <p>{aboutData.introText}</p>
            <div className="org-tags">
              {aboutData.organizations.map((org, index) => (
                <a
                  key={index}
                  href={org.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="org-tag"
                >
                  {org.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
