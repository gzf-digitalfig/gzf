import { useEffect } from "react";
import globalData from "../content/settings/global.json";
import policiesData from "../content/pages/policies.json";

export default function Policies() {
    const { title, intro, policies } = policiesData;

    useEffect(() => {
        document.title = `${title} | ${globalData.siteTitle}`;
    }, [title]);

    return (
        <div className="page-container">
            <div className="hero-small">
                <div className="container">
                    <h1>{title}</h1>
                </div>
            </div>

            <section className="section">
                <div className="container" style={{ maxWidth: "800px" }}>
                    <p className="lead-text">{intro}</p>

                    <div className="policies-list">
                        {policies && policies.length > 0 ? (
                            <div className="grid-list">
                                {policies.map((policy, index) => (
                                    <div key={index} className="policy-card">
                                        <div className="policy-info">
                                            <h3>{policy.name}</h3>
                                        </div>
                                        <a
                                            href={policy.file}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-secondary"
                                        >
                                            <span className="material-symbols-outlined">description</span>
                                            Download PDF
                                        </a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <p>No policies are currently available for download.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <style>{`
        .hero-small {
          background-color: var(--primary-color);
          color: white;
          padding: 4rem 0 2rem;
          margin-bottom: 2rem;
        }
        
        .hero-small h1 {
          font-size: 2.5rem;
          margin: 0;
        }

        .policies-list {
          margin-top: 3rem;
        }

        .grid-list {
          display: grid;
          gap: 1.5rem;
        }

        .policy-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          border: 1px solid #e5e7eb;
        }

        .policy-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .policy-info h3 {
          margin: 0;
          color: var(--text-color);
          font-size: 1.1rem;
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background-color: #f3f4f6;
          color: var(--text-color);
          padding: 0.5rem 1rem;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .btn-secondary:hover {
          background-color: #e5e7eb;
        }

        .btn-secondary .material-symbols-outlined {
          font-size: 1.2rem;
        }

        .empty-state {
          text-align: center;
          padding: 3rem;
          background: #f9fafb;
          border-radius: 8px;
          color: #6b7280;
        }

        @media (max-width: 600px) {
          .policy-card {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }
          
          .btn-secondary {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
        </div>
    );
}
