import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import componentsData from "../data/componentsData";
import ButtonShowcase from "../showcase/ButtonShowcase";
import CardShowcase from "../showcase/CardShowcase";
import ModalShowcase from "../showcase/ModalShowcase";
import FormShowcase from "../showcase/FormShowcase";
import TableShowcase from "../showcase/TableShowcase";
import "./ComponentDetail.css";

const showcaseMap = {
  button: ButtonShowcase,
  card: CardShowcase,
  modal: ModalShowcase,
  form: FormShowcase,
  table: TableShowcase,
};

export default function ComponentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [copied, setCopied] = useState(false);

  // Check if this is a MongoDB component passed via state
  const mongoComponent = location.state?.mongoComponent;

  // Determine which component to display
  const component = mongoComponent || componentsData.find((c) => c.id === id);

  if (!component) {
    return (
      <div className="detail-not-found">
        <span className="not-found-icon">🔍</span>
        <h2>Component not found</h2>
        <p>The component does not exist in our library.</p>
        <button className="demo-btn-primary" onClick={() => navigate("/components")}>
          Browse Components
        </button>
      </div>
    );
  }

  const isMongo = !!mongoComponent;
  const ShowcaseComponent = isMongo ? null : showcaseMap[component.id];

  const handleCopy = () => {
    const code = component.usage || component.codeSnippet || "";
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tags = component.tags || [];
  const propsList = component.props || [];
  const codeSnippet = component.usage || component.codeSnippet || "";

  return (
    <div className="component-detail-page">
      {/* Breadcrumb */}
      <div className="detail-breadcrumb">
        <button onClick={() => navigate("/components")}>Components</button>
        <span>/</span>
        <span className="current">{component.name}</span>
        {isMongo && <span className="mongo-source-badge">MongoDB</span>}
      </div>

      <div className="detail-header">
        <div className="detail-title-section">
          <h1>{component.name}</h1>
          <span className="detail-category">{component.category}</span>
        </div>
        <p className="detail-description">{component.description}</p>
        {tags.length > 0 && (
          <div className="detail-tags">
            {tags.map((tag, i) => (
              <span key={i} className="card-tag">#{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Preview (static components only) */}
      {!isMongo && (
        <section className="detail-section">
          <h2>Interactive Preview</h2>
          <div className="preview-container">
            {ShowcaseComponent ? (
              <ShowcaseComponent />
            ) : (
              <div className="preview-placeholder">
                <p>Interactive preview for {component.name} is being built.</p>
                <div
                  style={{
                    marginTop: "16px",
                    padding: "24px",
                    background: "#f9fafb",
                    borderRadius: "10px",
                    border: "2px dashed #d1d5db",
                    textAlign: "center",
                    color: "#6b7280",
                  }}
                >
                  <span style={{ fontSize: "2rem" }}>🚧</span>
                  <p style={{ margin: "8px 0 0" }}>
                    {component.name} Showcase — Coming Soon
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Props Table (static components) or Component Info (MongoDB) */}
      {!isMongo && propsList.length > 0 && (
        <section className="detail-section">
          <h2>Props</h2>
          <div className="props-table-wrapper">
            <table className="props-table">
              <thead>
                <tr>
                  <th>Prop</th>
                  <th>Type</th>
                  <th>Default</th>
                </tr>
              </thead>
              <tbody>
                {propsList.map((prop) => (
                  <tr key={prop.name}>
                    <td className="prop-name">{prop.name}</td>
                    <td className="prop-type">
                      <code>{prop.type}</code>
                    </td>
                    <td className="prop-default">
                      <code>{prop.default}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {isMongo && component.props && component.props.length > 0 && (
        <section className="detail-section">
          <h2>Component Props</h2>
          <div className="props-table-wrapper">
            <table className="props-table">
              <thead>
                <tr><th>Name</th><th>Details</th></tr>
              </thead>
              <tbody>
                {component.props.map((prop, i) => (
                  <tr key={i}>
                    <td className="prop-name">{prop.name || prop}</td>
                    <td className="prop-type"><code>{prop.type || prop}</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Code Snippet */}
      {codeSnippet && (
        <section className="detail-section">
          <div className="code-section-header">
            <h2>Code</h2>
            <button className="btn-copy" onClick={handleCopy}>
              {copied ? "✅ Copied!" : "📋 Copy Code"}
            </button>
          </div>
          <div className="code-block-wrapper">
            <pre className="code-block">
              <code>{codeSnippet}</code>
            </pre>
          </div>
        </section>
      )}

      {/* Related (static components only) */}
      {!isMongo && (
        <section className="detail-section">
          <h2>Related Components</h2>
          <div className="related-grid">
            {componentsData
              .filter((c) => c.category === component.category && c.id !== component.id)
              .slice(0, 4)
              .map((related) => (
                <div
                  key={related.id}
                  className="related-card"
                  onClick={() => navigate(`/components/${related.id}`)}
                >
                  <h4>{related.name}</h4>
                  <p>{related.description.slice(0, 80)}...</p>
                </div>
              ))}
            {componentsData.filter(
              (c) => c.category === component.category && c.id !== component.id
            ).length === 0 && (
              <p className="no-related">No other components in this category.</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
