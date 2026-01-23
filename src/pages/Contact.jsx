import "./Contact.css";
import contactData from "../content/pages/contact.json";

export default function Contact() {
  return (
    <div className="contact-page container" style={{ paddingBottom: '4rem', paddingTop: '4rem' }}>
      <h1>{contactData.title}</h1>
      <p>Email: {contactData.email}</p>
      <p>For correspondence only: {contactData.address}</p>
      <div className="card cta-geometric-box" style={{ maxWidth: '800px', margin: '2rem auto' }}>
        <h3>Bank Details for Donations:</h3>
        <div className="details-list" style={{ textAlign: 'left', width: '100%', maxWidth: '400px', margin: '0 auto' }}>
          <div className="detail-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--primary-green-light)' }}>
            <span className="label" style={{ fontWeight: 'bold' }}>Bank:</span>
            <span className="value">{contactData.bankName}</span>
          </div>
          <div className="detail-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--primary-green-light)' }}>
            <span className="label" style={{ fontWeight: 'bold' }}>Account Name:</span>
            <span className="value">{contactData.accountName}</span>
          </div>
          <div className="detail-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--primary-green-light)' }}>
            <span className="label" style={{ fontWeight: 'bold' }}>Sort Code:</span>
            <span className="value">{contactData.sortCode}</span>
          </div>
          <div className="detail-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
            <span className="label" style={{ fontWeight: 'bold' }}>Account Number:</span>
            <span className="value">{contactData.accountNumber}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
