import { Link } from "react-router-dom";
import placeholder from "../assets/placeholder.webp";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="section text-center">
        <div className="container">
          <div className="fade-in">
            <h1 className="mb-4">
              Supporting Our Community Through Zakat
            </h1>
            <p className="lead mb-8" style={{maxWidth: '700px', margin: '0 auto 3rem'}}>
              The Gloucester Zakat Fund is your trusted local charity for collecting and distributing Zakat to those in need within our community.
            </p>
            <div style={{display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap'}}>
              <Link to="/calculatezakat" className="btn btn-primary btn-large">Calculate & Give Zakat</Link>
              <Link to="/apply" className="btn btn-secondary btn-large">Apply for Support</Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section" style={{backgroundColor: 'var(--bg-secondary)'}}>
        <div className="container">
          <div className="text-center mb-8">
            <h2>A Simple & Transparent Process</h2>
            <p className="lead">Your Zakat journey with us is clear, simple, and impactful.</p>
          </div>
          <div className="grid grid-3">
            <div className="card text-center slide-up">
              <div style={{fontSize: '3rem', marginBottom: '1rem', color: 'var(--primary-green)'}}>1</div>
              <h3>Calculate Your Zakat</h3>
              <p>Use our easy-to-use calculator to determine the amount of Zakat you need to pay.</p>
            </div>
            <div className="card text-center slide-up" style={{animationDelay: '0.2s'}}>
              <div style={{fontSize: '3rem', marginBottom: '1rem', color: 'var(--primary-green)'}}>2</div>
              <h3>Give Securely Online</h3>
              <p>Make your Zakat payment through our secure online portal with confidence.</p>
            </div>
            <div className="card text-center slide-up" style={{animationDelay: '0.4s'}}>
              <div style={{fontSize: '3rem', marginBottom: '1rem', color: 'var(--primary-green)'}}>3</div>
              <h3>Impact Your Community</h3>
              <p>We ensure your Zakat is distributed effectively to eligible recipients in Gloucester.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="section">
        <div className="container">
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', gap: '4rem'}}>
            <div className="slide-up">
              <img 
                src={placeholder} 
                alt="Community support"
                style={{width: '100%', borderRadius: '16px', boxShadow: 'var(--shadow-lg)'}}
              />
            </div>
            <div className="fade-in">
              <h2>Your Zakat, Your Local Impact</h2>
              <p>Every penny of your Zakat is a lifeline for someone in our community. We support families facing hardship, individuals seeking education, and those in critical need of assistance. Your contribution fosters a stronger, more resilient Gloucester for everyone.</p>
              <Link to="/about" className="btn">Learn More About Our Work</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section" style={{backgroundColor: 'var(--bg-secondary)'}}>
        <div className="container">
          <div className="text-center mb-8">
            <h2>Voices from Our Community</h2>
          </div>
          <div className="grid grid-3">
            <div className="card slide-up">
              <blockquote>"The support from GZF was a blessing during a very difficult time for my family. We are so grateful."</blockquote>
              <p style={{fontWeight: '600', marginTop: '1rem', color: 'var(--text-primary)'}}>- A Supported Family</p>
            </div>
            <div className="card slide-up" style={{animationDelay: '0.2s'}}>
              <blockquote>"Giving my Zakat through GZF gives me peace of mind, knowing it's helping people right here in my city."</blockquote>
              <p style={{fontWeight: '600', marginTop: '1rem', color: 'var(--text-primary)'}}>- A Local Donor</p>
            </div>
            <div className="card slide-up" style={{animationDelay: '0.4s'}}>
              <blockquote>"As a student, the educational grant I received made all the difference. Thank you, GZF!"</blockquote>
              <p style={{fontWeight: '600', marginTop: '1rem', color: 'var(--text-primary)'}}>- A Student Recipient</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container text-center">
          <div className="card" style={{background: 'var(--gradient-primary)', color: 'white', maxWidth: '800px', margin: '0 auto'}}>
            <h2 style={{color: 'white'}}>Ready to Fulfill Your Zakat?</h2>
            <p style={{color: 'rgba(255,255,255,0.9)'}}>Join us in strengthening our community. Your contribution, big or small, makes a world of difference.</p>
            <Link to="/calculatezakat" className="btn btn-secondary">Give Your Zakat Now</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
