import { useState, useEffect } from "react";
import aboutData from "../content/pages/about.json";
import "./About.css";

const trustees = [
  {
    name: "Imam Abdullah Patel",
    role: "Chairperson",
    bio: "Imam Abdullah Abdul Samad Patel is a highly respected figure in the local Muslim community and serves as an Imam at Masjid e Umar. He is also the Head Teacher at Al-Ashraf Primary School, the first Islamic Primary School in the Southwest, and leads Peace Inclusion, advocating for educational access and community cohesion. Since 2025, he has served as a trustee for the Gloucester Rugby Charitable Foundation."
  },
  {
    name: "Farouq Ginwalla",
    role: "Trustee",
    bio: "Farouq Ginwalla brings extensive professional experience to the board as the Director of FG Immigration Ltd. As a long-standing resident of Gloucester, his expertise in governance and regulation ensures the charity operates with high standards of compliance and integrity, overseeing the responsible distribution of funds to those most in need."
  },
  {
    name: "Kamel Boulkenafet",
    role: "Trustee",
    bio: "Kamel Boulkenafet is a dedicated community advocate who previously served as a Director for Gloucestershire Action for Refugees and Asylum Seekers (GARAS). He was honored with the \"Community Upstander Award\" for his exceptional efforts in supporting vulnerable youth, reflecting the compassionate values at the heart of the Gloucester Zakat Charity."
  },
  {
    name: "Mariam Qureshi",
    role: "Trustee",
    bio: "Mariam Qureshi is an active trustee dedicated to social welfare within Gloucester. Her role involves assessing complex hardship cases and ensuring the fund's resources are directed towards impactful interventions for local families, helping to maintain the vital link between the charity and the community it serves."
  },
  {
    name: "Hashim Moolla",
    role: "Trustee",
    bio: "Hashim Moolla serves as a trustee with a focus on operational efficiency and community outreach. He assists in the rigorous verification of zakat applications, ensuring that every donation is accounted for and reaches eligible recipients in accordance with both charitable law and Islamic principles."
  }
];

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
            About Gloucester<br />
            <span>Zakat Charity</span>
          </h1>
          <p>
            Your Local Neighbourhood Zakat Distributors. Collecting zakat and sadaqa
            to assist local residents in Gloucester.
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
                <h2>Charity Information</h2>
                <p>
                  The Gloucester Zakat Charity is a registered entity dedicated to transparency and adhering to UK charity laws.
                </p>

                <div className="charity-info-table-wrapper">
                  <table className="charity-info-table">
                    <tbody>
                      <tr>
                        <td>Charity Number</td>
                        <td>1215932</td>
                      </tr>
                      <tr>
                        <td>Registration</td>
                        <td>England & Wales</td>
                      </tr>
                      <tr>
                        <td>Focus Area</td>
                        <td>Gloucester & Surrounds</td>
                      </tr>
                      <tr>
                        <td>Target Community</td>
                        <td>Local Residents In Need</td>
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
              <h2>Our Key Services</h2>
              <p>
                We strive to identify the most vulnerable in our community and provide them with dignified support.
              </p>
            </div>
            <div></div>
          </div>

          <div className="mission-grid">
            {/* Service 1 */}
            <div className="mission-card">
              <div className="mission-icon">
                <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>verified_user</span>
              </div>
              <h2>Qualify Individuals</h2>
              <p>
                We carefully assess applications to ensure zakat reaches those who are genuinely eligible according to Islamic principles (As-Sadaqat).
              </p>
            </div>

            {/* Service 2 */}
            <div className="mission-card">
              <div className="mission-icon">
                <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>payments</span>
              </div>
              <h2>Secure Payments</h2>
              <p>
                Convenient and secure online payment system allowing you to fulfill your zakat obligations from anywhere, anytime.
              </p>
            </div>

            {/* Service 3 */}
            <div className="mission-card">
              <div className="mission-icon">
                <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>handshake</span>
              </div>
              <h2>Local Distribution</h2>
              <p>
                We ensure your zakat goes directly to those in need within the Gloucester community, strengthening local bonds.
              </p>
            </div>
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
              <h2>Meet the Trustees</h2>
              <p>
                To ensure effective governance, leadership, and vision, our trustees bring specialized skills and extensive experience to the charity.
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
            <h2>GZF in the Community</h2>
            <p>
              Alhamdulillah, most of us are blessed, but many neighbors aren't as fortunate. We provide assistance to local charities and vulnerable families right here on our doorstep.
            </p>
          </div>

          <div className="timeline-list">
            {/* Item 1 */}
            <div className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-item-content">
                <span className="timeline-badge">Food Support</span>
                <h3>Supermarket Vouchers</h3>
                <p>
                  We provide ongoing supplies of supermarket gift cards to partner organizations, allowing families in need to purchase food and basic dignity supplies discreetly.
                </p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-item-content">
                <span className="timeline-badge">Crisis Aid</span>
                <h3>Emergency Support Grants</h3>
                <p>
                  Small grants for families in crisis to assist with essential expenses such as utilities, rent arrears, and emergency food supplies during critical times.
                </p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-item-content">
                <span className="timeline-badge">Education</span>
                <h3>School Support</h3>
                <p>
                  Assisting families with school-related costs, including uniform grants and educational supplies, ensuring every child can attend school with confidence.
                </p>
              </div>
            </div>
          </div>
          {/* Merged Partners Section */}
          <div className="partners-inline-content">
            <h3>Partner Organisations</h3>
            <p>We work closely with local organizations to ensure effective distribution of Zakat and Sadaqa.</p>
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
