import { useState } from "react";

export default function CardShowcase() {
  const [hoverable, setHoverable] = useState(true);
  const [showImage, setShowImage] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [clickCount, setClickCount] = useState(0);

  return (
    <div className="showcase-component">
      <div className="showcase-preview">
        <div className="preview-area" style={{ display: "flex", justifyContent: "center" }}>
          <div
            className={`demo-card ${hoverable ? "hoverable" : ""}`}
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              overflow: "hidden",
              width: "300px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              if (hoverable) {
                e.currentTarget.style.boxShadow =
                  "0 12px 30px rgba(0,0,0,0.12)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow =
                "0 2px 8px rgba(0,0,0,0.06)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {showImage && (
              <div
                style={{
                  height: "160px",
                  background:
                    "linear-gradient(135deg, #6366f1, #a78bfa)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontSize: "2rem",
                  fontWeight: 700,
                }}
              >
                Image
              </div>
            )}
            <div style={{ padding: "20px" }}>
              <h3 style={{ margin: "0 0 4px", color: "#111827" }}>
                Card Title
              </h3>
              <p style={{ margin: "0 0 4px", color: "#6b7280", fontSize: "0.85rem" }}>
                Optional subtitle
              </p>
              <p
                style={{
                  margin: "12px 0 0",
                  color: "#374151",
                  fontSize: "0.9rem",
                  lineHeight: "1.5",
                }}
              >
                This is the card body content. It can contain any React nodes
                such as text, images, or other components.
              </p>
            </div>
            {showFooter && (
              <div
                style={{
                  padding: "14px 20px",
                  borderTop: "1px solid #e5e7eb",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "8px",
                }}
              >
                <button
                  style={{
                    padding: "7px 16px",
                    background: "#6366f1",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    cursor: "pointer",
                  }}
                  onClick={() => setClickCount((c) => c + 1)}
                >
                  Action
                </button>
                <button
                  style={{
                    padding: "7px 16px",
                    background: "transparent",
                    color: "#6b7280",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontWeight: 500,
                    fontSize: "0.8rem",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          {clickCount > 0 && (
            <p className="click-feedback">
              Action clicked {clickCount} time{clickCount > 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      <div className="showcase-controls">
        <div className="control-group row">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={hoverable}
              onChange={(e) => setHoverable(e.target.checked)}
            />
            Hoverable
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showImage}
              onChange={(e) => setShowImage(e.target.checked)}
            />
            Show Image
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showFooter}
              onChange={(e) => setShowFooter(e.target.checked)}
            />
            Show Footer
          </label>
        </div>
      </div>
    </div>
  );
}
