import "./Apply.css";
import applyData from '../content/pages/apply.json';

export default function Apply() {
  const { pageTitle, introText, formSection, locationSection } = applyData;

  return (
    <div className="apply-page container" style={{ paddingBottom: '4rem', paddingTop: '4rem' }}>
      <h1>{pageTitle}</h1>
      <p>
        {introText}
      </p>

      <h2>{formSection.title}</h2>
      <p>{formSection.intro}</p>
      <div style={{ height: "800px", overflow: "hidden" }}>
        <iframe
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
