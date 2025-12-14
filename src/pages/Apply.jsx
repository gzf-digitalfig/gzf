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
        <h3>Application Location:</h3>
        <div className="locations-list">
          <div className="location-item">
            <div className="location-name">Masjid E Umar</div>
            <div className="location-address">
              14 Conduit St, Gloucester, GL1 4LX
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
