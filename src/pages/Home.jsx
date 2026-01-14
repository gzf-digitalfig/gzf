import { Link } from "react-router-dom";
import placeholder from "../assets/placeholder.webp";
import heroImage from "../assets/zakat.webp";
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
    <div>
      {/* Hero Section */}
      <section
        className="section text-center home-hero"
        style={{ backgroundImage: `url(${heroImage})` }}
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
        <section className="section" style={{ backgroundColor: 'var(--bg-secondary)' }}>
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
                  <span className="description">{activity.description}</span>
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
      <section className="section" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="text-center mb-8">
            <h2>A Simple & Transparent Process</h2>
            <p className="lead">Your Zakat journey with us is clear, simple, and impactful.</p>
          </div>
          <div className="grid grid-3">
            {homeData.steps.map((step, index) => (
              <div key={index} className="card text-center slide-up" style={{ animationDelay: `${index * 0.2}s` }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--primary-green)' }}>{step.number}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
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
                src={placeholder}
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
              <div key={index} className="card slide-up" style={{ animationDelay: `${index * 0.2}s` }}>
                <blockquote>"{testimonial.quote}"</blockquote>
                <p style={{ fontWeight: '600', marginTop: '1rem', color: 'var(--text-primary)' }}>- {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" style={{ paddingBottom: '3rem' }}>
        <div className="container text-center">
          <div className="card" style={{ background: 'var(--gradient-primary)', color: 'white', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ color: 'white' }}>{homeData.ctaTitle}</h2>
            <p style={{ color: 'rgba(255,255,255,0.9)' }}>{homeData.ctaText}</p>
            <Link to="/calculatezakat" className="btn btn-secondary">{homeData.ctaBtnText}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
