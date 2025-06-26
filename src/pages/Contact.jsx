export default function Contact() {
  return (
    <div>
      <h1>Contact Us</h1>
      <p>Email: info@gloucesterzakatfund.org.uk</p>
      <p>For correspondence only: Gloucester Zakat Fund, PO Box 123, Gloucester, GL1 2AB</p>
      <div className="bank-details">
        <h3>Bank Details for Donations:</h3>
        <div className="details-list">
          <div className="detail-item">
            <span className="label">Bank:</span>
            <span className="value">Gloucester Community Bank</span>
          </div>
          <div className="detail-item">
            <span className="label">Account Name:</span>
            <span className="value">Gloucester Zakat Fund</span>
          </div>
          <div className="detail-item">
            <span className="label">Sort Code:</span>
            <span className="value">12-34-56</span>
          </div>
          <div className="detail-item">
            <span className="label">Account Number:</span>
            <span className="value">12345678</span>
          </div>
        </div>
      </div>
    </div>
  );
}
