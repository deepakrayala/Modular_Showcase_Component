import { useState } from "react";

export default function ModalShowcase() {
  const [isOpen, setIsOpen] = useState(false);
  const [size, setSize] = useState("md");
  const [closeOnOverlay, setCloseOnOverlay] = useState(true);

  const sizes = { sm: "320px", md: "480px", lg: "640px" };

  return (
    <div className="showcase-component">
      <div className="showcase-preview">
        <div className="preview-area">
          <button className="demo-btn-primary" onClick={() => setIsOpen(true)}>
            Open Modal ({size})
          </button>

          {isOpen && (
            <div
              className="modal-overlay"
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                padding: "24px",
              }}
              onClick={(e) => {
                if (closeOnOverlay && e.target === e.currentTarget) {
                  setIsOpen(false);
                }
              }}
            >
              <div
                className="modal-content"
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  width: "100%",
                  maxWidth: sizes[size],
                  maxHeight: "80vh",
                  overflow: "auto",
                  boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
                  animation: "modalIn 0.25s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "20px 24px",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <h3 style={{ margin: 0, color: "#111827" }}>Modal Title</h3>
                  <button
                    className="modal-close-btn"
                    onClick={() => setIsOpen(false)}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "1.3rem",
                      cursor: "pointer",
                      color: "#6b7280",
                      padding: "4px 8px",
                      borderRadius: "6px",
                    }}
                  >
                    ✕
                  </button>
                </div>
                <div style={{ padding: "24px" }}>
                  <p style={{ margin: "0 0 16px", color: "#374151", lineHeight: "1.6" }}>
                    This is a {size} modal dialog. You can click outside to
                    close{!closeOnOverlay && " (disabled)"}. Modal components are
                    great for confirmations, forms, and detailed content
                    overlays.
                  </p>
                  <div
                    style={{
                      background: "#f9fafb",
                      padding: "16px",
                      borderRadius: "10px",
                      marginBottom: "16px",
                    }}
                  >
                    <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem" }}>
                      Modal content area — can hold any React components.
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    padding: "16px 24px",
                    borderTop: "1px solid #e5e7eb",
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                  }}
                >
                  <button
                    className="demo-btn-secondary"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="demo-btn-primary"
                    onClick={() => {
                      alert("Confirmed!");
                      setIsOpen(false);
                    }}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="showcase-controls">
        <div className="control-group">
          <label>Size</label>
          <div className="control-buttons">
            {Object.keys(sizes).map((s) => (
              <button
                key={s}
                className={`ctrl-btn ${size === s ? "active" : ""}`}
                onClick={() => setSize(s)}
              >
                {s} ({sizes[s]})
              </button>
            ))}
          </div>
        </div>

        <div className="control-group row">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={closeOnOverlay}
              onChange={(e) => setCloseOnOverlay(e.target.checked)}
            />
            Close on overlay click
          </label>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
