import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { categories } from "../data/componentsData";
import { useEffect, useState } from "react";
import "./Dashboard.css";

export default function Dashboard() {

  const { user } = useAuth();
  const navigate = useNavigate();

  const [fastApiComponents, setFastApiComponents] = useState([]);
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(true);

  // FASTAPI FETCH
  useEffect(() => {

    fetch("http://127.0.0.1:8000/components")

      .then((res) => {

        if (!res.ok) {
          throw new Error("FastAPI server error");
        }

        return res.json();
      })

      .then((data) => {

        setFastApiComponents(data.components);
        setLoading(false);

      })

      .catch((err) => {

        console.error("FastAPI Error:", err);

        setApiError(
          "FastAPI server is offline. Please start FastAPI backend."
        );

        setLoading(false);

      });

  }, []);

  return (

    <div className="dashboard-page">

      {/* HERO SECTION */}

      <div className="dashboard-hero">

        <h1>
          Welcome, <span className="hero-name">{user?.name}</span> 👋
        </h1>

        <p className="hero-subtitle">
          Explore our library of reusable, modular UI components.
          Browse categories, preview components live,
          and copy ready-to-use code.
        </p>

        <div className="hero-stats">

          <div className="stat-card">
            <span className="stat-number">16</span>
            <span className="stat-label">Components</span>
          </div>

          <div className="stat-card">
            <span className="stat-number">6</span>
            <span className="stat-label">Categories</span>
          </div>

          <div className="stat-card">
            <span className="stat-number">100%</span>
            <span className="stat-label">Reusable</span>
          </div>

        </div>

      </div>

      {/* FASTAPI SECTION */}

      <div className="dashboard-section">

        <h2 className="section-title">
          FastAPI Live Components
        </h2>

        {loading && (
          <p>Loading FastAPI components...</p>
        )}

        {apiError && (
          <div className="alert alert-error">
            {apiError}
          </div>
        )}

        {!loading && !apiError && (

          <div className="categories-grid">

            {fastApiComponents.map((item, index) => (

              <div
                key={index}
                className="category-card"
              >

                <span className="category-icon">
                  ⚡
                </span>

                <h3>{item}</h3>

                <p>
                  Loaded dynamically from FastAPI backend
                </p>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* CATEGORY SECTION */}

      <div className="dashboard-section">

        <h2 className="section-title">
          Browse by Category
        </h2>

        <div className="categories-grid">

          {categories.map((cat) => (

            <div
              key={cat.id}
              className="category-card"
              onClick={() =>
                navigate(`/components?category=${cat.id}`)
              }
            >

              <span className="category-icon">
                {cat.icon}
              </span>

              <h3>{cat.name}</h3>

              <p>{cat.description}</p>

              <span className="category-action">
                Browse Components →
              </span>

            </div>

          ))}

        </div>

      </div>

      {/* QUICK START SECTION */}

      <div className="dashboard-section">

        <h2 className="section-title">
          Quick Start
        </h2>

        <div className="quickstart-card">

          <div className="quickstart-step">

            <span className="step-number">
              1
            </span>

            <div>

              <h4>Browse Components</h4>

              <p>
                Explore our categorized library
                of reusable UI components.
              </p>

            </div>

          </div>

          <div className="quickstart-step">

            <span className="step-number">
              2
            </span>

            <div>

              <h4>Interactive Previews</h4>

              <p>
                Test each component with live controls
                and see real-time changes.
              </p>

            </div>

          </div>

          <div className="quickstart-step">

            <span className="step-number">
              3
            </span>

            <div>

              <h4>Copy & Use</h4>

              <p>
                Grab the code snippets and use them
                directly in your projects.
              </p>

            </div>

          </div>

          <button
            className="btn-get-started"
            onClick={() => navigate("/components")}
          >
            Get Started Now
          </button>

        </div>

      </div>

    </div>
  );
}