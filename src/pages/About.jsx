import aboutData from "../content/pages/about.json";

// Use import.meta.glob to load all JSON files from the activities content directory
const activityModules = import.meta.glob("../content/activities/*.json", {
  eager: true,
});

// Convert the modules object into an array of activity objects
const activities = Object.values(activityModules)
  .map((mod) => mod.default || mod) // Handle default export if present, or raw JSON
  .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending

export default function About() {
  // Helper to format date as "Month Year"
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };
  return (
    <div className="about-page">
      <div className="hero-section">
        <h1>About Gloucester Zakat Charity</h1>
        <p className="tagline">Your Local Neighbourhood Zakat Distributors</p>
        <p className="primary-message">
          Collecting zakat and sadaqa to assist local residents in Gloucester
        </p>
      </div>

      <div className="services-section">
        <h2>Our Key Services</h2>
        <div className="services-grid">
          <div className="service-item">
            <h3>Qualify Individuals for Zakat</h3>
            <p>
              We carefully assess applications to ensure zakat reaches those who
              are genuinely eligible according to Islamic principles.
            </p>
          </div>
          <div className="service-item">
            <h3>Pay Zakat Online and via Mobile</h3>
            <p>
              Convenient and secure online payment system allowing you to fulfill
              your zakat obligations from anywhere.
            </p>
          </div>
          <div className="service-item">
            <h3>Direct Local Distribution</h3>
            <p>
              We ensure your zakat goes directly to those in need within the
              Gloucester community.
            </p>
          </div>
        </div>
      </div>

      <div className="trustees-section">
        <h2>Meet the Trustees</h2>
        <p>
          To ensure good effective governance, provide leadership and vision it
          is essential for a charity to have trustees who have particular
          qualities and specialised skills. This allows the charity to fulfil
          its purpose in a manner that instils confidence in the hearts and
          minds of its supporters and beneficiaries.
        </p>
        <p>
          The Gloucester Zakat Charity is overseen by five trustees who are
          well-known reputable members of Gloucester&apos;s Muslim community. All
          the trustees have extensive experience in leadership roles which,
          combined with the experience gained from managing other successful
          local charities, provide the Gloucester Zakat Charity vision and
          strategic direction.
        </p>

        <div className="trustees-grid">
          <div className="trustee-card">
            <h3>Imam Abdullah Patel (Chair)</h3>
            <p>
              Imam Abdullah Abdul Samad Patel is a highly respected figure in the
              local Muslim community and serves as an Imam at Masjid e Umar. He is
              also the Head Teacher at Al-Ashraf Primary School, the first Islamic
              Primary School in the Southwest, and leads Peace Inclusion, advocating
              for educational access and community cohesion. Since 2025, he has
              served as a trustee for the Gloucester Rugby Charitable Foundation.
            </p>
          </div>

          <div className="trustee-card">
            <h3>Farouq Ginwalla (Trustee)</h3>
            <p>
              Farouq Ginwalla brings extensive professional experience to the
              board as the Director of FG Immigration Ltd. As a long-standing
              resident of Gloucester, his expertise in governance and regulation
              ensures the charity operates with high standards of compliance and
              integrity, overseeing the responsible distribution of funds to those
              most in need.
            </p>
          </div>

          <div className="trustee-card">
            <h3>Kamel Boulkenafet (Trustee)</h3>
            <p>
              Kamel Boulkenafet is a dedicated community advocate who previously
              served as a Director for Gloucestershire Action for Refugees and
              Asylum Seekers (GARAS). He was honored with the &quot;Community
              Upstander Award&quot; for his exceptional efforts in supporting
              vulnerable youth, reflecting the compassionate values at the heart
              of the Gloucester Zakat Charity.
            </p>
          </div>

          <div className="trustee-card">
            <h3>Mariam Qureshi (Trustee)</h3>
            <p>
              Mariam Qureshi is an active trustee dedicated to social welfare within
              Gloucester. Her role involves assessing complex hardship cases and
              ensuring the fund&apos;s resources are directed towards impactful
              interventions for local families, helping to maintain the vital link
              between the charity and the community it serves.
            </p>
          </div>

          <div className="trustee-card">
            <h3>Hashim Moolla (Trustee)</h3>
            <p>
              Hashim Moolla serves as a trustee with a focus on operational
              efficiency and community outreach. He assists in the rigorous
              verification of zakat applications, ensuring that every donation is
              accounted for and reaches eligible recipients in accordance with
              both charitable law and Islamic principles.
            </p>
          </div>
        </div>
      </div>

      <div className="charity-info">
        <h2>Charity Information</h2>
        <div className="charity-details">
          <div className="detail-row">
            <span className="label">Charity Number:</span>
            <span className="value">1215932</span>
          </div>
          <div className="detail-row">
            <span className="label">Registration:</span>
            <span className="value">Registered Charity in England and Wales</span>
          </div>
          <div className="detail-row">
            <span className="label">Geographic Focus:</span>
            <span className="value">Gloucester and surrounding areas</span>
          </div>
          <div className="detail-row">
            <span className="label">Target Community:</span>
            <span className="value">Local residents, particularly Muslim community</span>
          </div>
        </div>
      </div>

      <div className="community-section">
        <h2>Gloucester Zakat Charity in the Community</h2>
        <p>
          Throughout the year the Gloucester Zakat Charity provides assistance to a
          number of local charities, vulnerable residents and families.
          Alhamdulillah most of us are blessed with good health, wealth and
          family and friends to provide support in challenging times. However
          there are a number of neighbours and families who aren&apos;t as
          fortunate right here on our local doorstep.
        </p>

        <div className="community-services">
          <div className="service-block">
            <h3>Supermarket Vouchers</h3>
            <p>
              The Gloucester Zakat Charity provides local charities and
              organisations with a regular supply of supermarket gift
              cards/vouchers which can be used by local families and individuals
              in need to purchase food and other basic supplies.
            </p>
          </div>

          <div className="service-block">
            <h3>Emergency Support Grants</h3>
            <p>
              We provide small grants to families in crisis situations to assist
              with essential expenses such as utilities, rent assistance, and
              emergency food supplies.
            </p>
          </div>

          <div className="service-block">
            <h3>School Support</h3>
            <p>
              The Fund provides assistance to families struggling with
              school-related costs, including uniform grants and educational
              supplies for children in need.
            </p>
          </div>
        </div>

        <div className="beneficiary-organisations">
          <div style={{ height: "3rem" }}></div>
          <h2>Partner Organisations</h2>
          <p>
            We work closely with local organisations to ensure effective
            distribution of zakat and sadaqa:
          </p>
          <div className="organisations-grid">
            {aboutData.organizations.map((org, index) => (
              <div key={index} className="org-item">{org.name}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="achievements-section">
        <h2>Community Stories</h2>
        <div className="testimonials-grid">
          <div className="testimonial card">
            <p>
              "The food vouchers from Gloucester Zakat Charity were a lifesaver for
              my family. We are incredibly grateful for their support during a
              difficult time."
            </p>
            <cite>- A grateful mother</cite>
          </div>
          <div className="testimonial card">
            <p>
              "I was struggling to pay my rent and was on the verge of being
              evicted. The emergency grant from GZF gave me the breathing room I
              needed to get back on my feet."
            </p>
            <cite>- A local resident</cite>
          </div>
          <div className="testimonial card">
            <p>
              "Thanks to the school uniform grant, my children could start the
              new school year with confidence and a sense of belonging. Thank
              you, GZF!"
            </p>
            <cite>- A happy parent</cite>
          </div>
        </div>
      </div>
    </div >
  );
}
