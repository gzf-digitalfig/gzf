import { Link, useSearchParams } from "react-router-dom";

const activityModules = import.meta.glob("../content/activities/*.json", {
  eager: true,
});

const activities = Object.values(activityModules)
  .map((mod) => mod.default || mod)
  .sort((a, b) => new Date(b.date) - new Date(a.date));

const PAGE_SIZE = 10;

export default function News() {
  const [searchParams, setSearchParams] = useSearchParams();

  const requestedPage = parseInt(searchParams.get("page") || "1", 10);
  const totalPages = Math.max(1, Math.ceil(activities.length / PAGE_SIZE) || 1);
  const currentPage = Number.isNaN(requestedPage)
    ? 1
    : Math.min(Math.max(requestedPage, 1), totalPages);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageActivities = activities.slice(startIndex, startIndex + PAGE_SIZE);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const goToPage = (page) => {
    if (page <= 1) {
      setSearchParams({});
    } else {
      setSearchParams({ page: String(page) });
    }
  };

  if (activities.length === 0) {
    return (
      <div className="about-page">
        <div className="hero-section">
          <h1>Community news</h1>
          <p className="tagline">Updates from Gloucester Zakat Charity</p>
        </div>
        <p>No news entries are available yet.</p>
      </div>
    );
  }

  return (
    <div className="about-page">
      <div className="hero-section">
        <h1>Community news</h1>
        <p className="tagline">Updates from Gloucester Zakat Charity</p>
      </div>

      <div className="achievements-section">
        <h2>All news</h2>
        <div className="achievements-list">
          {pageActivities.map((activity, index) => (
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

        {totalPages > 1 && (
          <div
            className="text-center"
            style={{
              marginTop: "2rem",
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Previous
            </button>
            <span style={{ fontWeight: 500 }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
            </button>
          </div>
        )}

        <div className="text-center" style={{ marginTop: "2rem" }}>
          <Link to="/" className="btn">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

