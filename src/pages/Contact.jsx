import contactData from "../content/pages/contact.json";

export default function Contact() {
  return (
    <div className="container" style={{ paddingBottom: '4rem', paddingTop: '2rem' }}>
      <h1>{contactData.title}</h1>
      <p>Email: {contactData.email}</p>
      <p>For correspondence only: {contactData.address}</p>
      <div className="bank-details">
        <h3>Bank Details for Donations:</h3>
        <div className="details-list">
          <div className="detail-item">
            <span className="label">Bank:</span>
            <span className="value">{contactData.bankName}</span>
          </div>
          <div className="detail-item">
            <span className="label">Account Name:</span>
            <span className="value">{contactData.accountName}</span>
          </div>
          <div className="detail-item">
            <span className="label">Sort Code:</span>
            <span className="value">{contactData.sortCode}</span>
          </div>
          <div className="detail-item">
            <span className="label">Account Number:</span>
            <span className="value">{contactData.accountNumber}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
