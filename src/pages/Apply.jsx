import { useState } from "react";
import "./Apply.css";
import applyData from '../content/pages/apply.json';

export default function Apply() {
  const { pageTitle, introText, asylumSection, formSection, locationSection } = applyData;
  const [activeTab, setActiveTab] = useState("asylum");

  return (
    <div className="apply-page container" style={{ paddingBottom: '4rem', paddingTop: '4rem' }}>
      <h1>{pageTitle}</h1>
      <p>
        {introText}
      </p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setActiveTab('asylum')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: activeTab === 'asylum' ? '#0f766e' : '#f3f4f6',
            color: activeTab === 'asylum' ? 'white' : '#374151',
            border: activeTab === 'asylum' ? '1px solid #0f766e' : '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Asylum Seeker Only
        </button>
        <button 
          onClick={() => setActiveTab('standard')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: activeTab === 'standard' ? '#0f766e' : '#f3f4f6',
            color: activeTab === 'standard' ? 'white' : '#374151',
            border: activeTab === 'standard' ? '1px solid #0f766e' : '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Everyone Else
        </button>
      </div>

      {activeTab === 'asylum' && asylumSection && (
        <div className="tab-content" style={{ animation: "fadeIn 0.3s ease-in-out" }}>
          <h2>{asylumSection.text}</h2>
          <div style={{ height: "800px", overflow: "hidden" }}>
            <iframe
              title="Asylum Seeker Application Form"
              src={asylumSection.url}
              width="100%"
              height="100%"
              frameBorder="0"
              marginHeight="0"
              marginWidth="0"
            >
              Loading…
            </iframe>
          </div>
        </div>
      )}

      {activeTab === 'standard' && (
        <div className="tab-content" style={{ animation: "fadeIn 0.3s ease-in-out" }}>
          <h2>{formSection.title}</h2>
          <p>{formSection.intro}</p>
          <div style={{ height: "800px", overflow: "hidden" }}>
            <iframe
              title="Standard Application Form"
              src={formSection.googleFormUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              marginHeight="0"
              marginWidth="0"
            >
              Loading…
            </iframe>
          </div>
        </div>
      )}

      <div className="application-locations">
        <h3>{locationSection.title}</h3>
        <div className="locations-list">
          <div className="location-item">
            <div className="location-name">{locationSection.name}</div>
            <div className="location-address">
              {locationSection.address}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
