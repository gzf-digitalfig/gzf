import placeholder from "../assets/placeholder.webp";

export default function Community() {
  return (
    <div className="about-page">
      <div className="hero-section">
        <h1>GZF in the Community</h1>
        <p className="tagline">Making a Difference Together</p>
        <p className="primary-message">
          We believe in the power of community. Gloucester Zakat Fund is dedicated to supporting local initiatives and working with partner organisations to uplift those in need.
        </p>
      </div>

      <div className="community-section">
        <h2>How We Help</h2>
        <div className="community-services">
          <div className="service-block card">
            <h3>Supermarket Vouchers</h3>
            <p>Providing families with the dignity of choice. Our voucher scheme allows families to purchase essential groceries and household items.</p>
          </div>
          <div className="service-block card">
            <h3>School Support</h3>
            <p>Investing in the future. We offer grants for school uniforms, essential supplies, and educational trips to ensure no child is left behind.</p>
          </div>
          <div className="service-block card">
            <h3>Emergency Grants</h3>
            <p>A lifeline in times of crisis. We provide one-off grants to help families facing unexpected financial hardship, preventing debt and eviction.</p>
          </div>
        </div>
      </div>

      <div className="beneficiary-organisations">
        <h2>Our Partners</h2>
        <p>We are proud to collaborate with a network of local charities and organisations to maximise our impact and reach every corner of the community.</p>
        <div className="organisations-grid">
          <div className="org-item">Gloucester Food Bank</div>
          <div className="org-item">Gloucestershire Bundles</div>
          <div className="org-item">The Friendship Cafe</div>
          <div className="org-item">Masjid-e-Noor</div>
          <div className="org-item">Gloucester City Council</div>
        </div>
      </div>

      <div className="achievements-section">
        <h2>Community Stories</h2>
        <div className="testimonials-grid">
          <div className="testimonial card">
            <p>"The food vouchers from Gloucester Zakat Fund were a lifesaver for my family. We are incredibly grateful for their support during a difficult time."</p>
            <cite>- A grateful mother</cite>
          </div>
          <div className="testimonial card">
            <p>"I was struggling to pay my rent and was on the verge of being evicted. The emergency grant from GZF gave me the breathing room I needed to get back on my feet."</p>
            <cite>- A local resident</cite>
          </div>
           <div className="testimonial card">
            <p>"Thanks to the school uniform grant, my children could start the new school year with confidence and a sense of belonging. Thank you, GZF!"</p>
            <cite>- A happy parent</cite>
          </div>
        </div>
      </div>
    </div>
  );
}
