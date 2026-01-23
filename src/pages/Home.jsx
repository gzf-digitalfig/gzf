import { Link } from "react-router-dom";
import defaultLocalImpactImage from "../assets/donation.webp";
import defaultHeroImage from "../assets/zakat.webp";
import homeData from "../content/pages/home.json";

// Load activities from the CMS (JSON files)
const activityModules = import.meta.glob("../content/activities/*.json", {
  eager: true,
});

const activities = Object.values(activityModules)
  .map((mod) => mod.default || mod)
  .sort((a, b) => new Date(b.date) - new Date(a.date));

export default function Home() {
  const latestActivities = activities.slice(0, 5);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section
        className="home-section text-center home-hero"
        style={{ backgroundImage: `url(${homeData.heroImage || defaultHeroImage})` }}
      >
        <div className="container">
          <div className="fade-in">
            <h1 className="mb-4">
              {homeData.heroTitle}
            </h1>
            <p className="lead mb-8" style={{ maxWidth: '700px', margin: '0 auto 3rem' }}>
              {homeData.heroSubtitle}
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/calculatezakat" className="btn btn-primary btn-large">Calculate & Give Zakat</Link>
              <Link to="/apply" className="btn btn-secondary btn-large">Apply for Support</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      {latestActivities.length > 0 && (
        <section className="home-section" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="container">
            <div className="text-center mb-4">
              <h2>Latest news</h2>
            </div>
            <div className="achievements-list">
              {latestActivities.map((activity, index) => (
                <div key={index} className="achievement-item">
                  <span
                    className="year"
                    style={{ width: "auto", padding: "0 1rem", borderRadius: "20px" }}
                  >
                    {formatDate(activity.date)}
                  </span>
                  <div className="achievement-content" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    {activity.image && (
                      <div className="achievement-image" style={{ width: '120px', height: '80px', flexShrink: 0 }}>
                        <img src={activity.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                      </div>
                    )}
                    <span className="description">{activity.description}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center" style={{ marginTop: "2rem" }}>
              <Link to="/news">
                Read more
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <section className="home-section" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="text-center mb-8">
            <h2>A Simple & Transparent Process</h2>
            <p className="lead">Your Zakat journey with us is clear, simple, and impactful.</p>
          </div>
          <div className="grid grid-3">
            {homeData.steps.map((step, index) => {
              const icons = ["calculate", "volunteer_activism", "diversity_3"];
              const links = ["/calculatezakat", "/donate", "/about"];
              return (
                <div key={index} className="step-card slide-up" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="step-icon-wrapper">
                    <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>{icons[index]}</span>
                  </div>
                  <h3>
                    <Link to={links[index]} className="step-link">
                      {step.number}. {step.title}
                    </Link>
                  </h3>
                  <p>{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="section">
        <div className="container">
          <div className="impact-section">
            <div className="fade-in impact-text">
              <h2>{homeData.impactTitle}</h2>
              <p>{homeData.impactText}</p>
              <Link to="/about" className="btn">{homeData.impactBtnText}</Link>
            </div>
            <div className="slide-up impact-image">
              <img
                src={homeData.impactImage || defaultLocalImpactImage}
                alt="Community support"
                style={{ width: '100%', borderRadius: '16px', boxShadow: 'var(--shadow-lg)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="text-center mb-8">
            <h2>Voices from Our Community</h2>
          </div>
          <div className="grid grid-3">
            {homeData.testimonials.map((testimonial, index) => (
              <div key={index} className="card testimonial-card slide-up" style={{ animationDelay: `${index * 0.2}s` }}>
                <blockquote>"{testimonial.quote}"</blockquote>
                <p style={{ fontWeight: '600', marginTop: '1rem', color: 'var(--text-primary)' }}>- {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" style={{ paddingBottom: '3rem' }}>
        <div className="container">
          <div className="card cta-geometric-box" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2>{homeData.ctaTitle}</h2>
            <p>{homeData.ctaText}</p>
            <Link to="/calculatezakat" className="btn">{homeData.ctaBtnText}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
