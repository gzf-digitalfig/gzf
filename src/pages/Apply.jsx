import "./Apply.css";

export default function Apply() {
  return (
    <div className="apply-page">
      <h1>Apply for Assistance</h1>
      <p>
        If you are a Gloucester resident in need, you can apply for zakat or
        other support using our online form or by contacting us directly. We
        also accept referrals from local organisations and community leaders.
      </p>

      <h2>Online Application Form</h2>
      <p>Please fill out the form below to apply for assistance.</p>
      <div style={{ height: "800px", overflow: "hidden" }}>
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSc7TDJIWNNZuaxXMC7YxVP8YNO_Nhkit9muzRlzouRaKeUrhQ/viewform?embedded=true"
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
        <h3>Application Locations:</h3>
        <div className="locations-list">
          <div className="location-item">
            <div className="location-name">Gloucester Central Mosque</div>
            <div className="location-address">
              12 All Saints Road, Gloucester, GL1 4EE
            </div>
          </div>
          <div className="location-item">
            <div className="location-name">Masjid-e-Noor</div>
            <div className="location-address">
              45 Ryecroft Street, Gloucester, GL1 4LY
            </div>
          </div>
          <div className="location-item">
            <div className="location-name">Al-Huda Community Centre</div>
            <div className="location-address">
              88 Barton Street, Gloucester, GL1 4EX
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}