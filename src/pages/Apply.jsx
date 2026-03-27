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

      <div className="apply-tabs">
        <button 
          onClick={() => setActiveTab('asylum')}
          className={`apply-tab ${activeTab === 'asylum' ? 'active' : ''}`}
        >
          Asylum Seeker Only
        </button>
        <button 
          onClick={() => setActiveTab('standard')}
          className={`apply-tab ${activeTab === 'standard' ? 'active' : ''}`}
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
