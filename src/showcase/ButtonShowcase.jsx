import { useState } from "react";

export default function ButtonShowcase() {
  const [variant, setVariant] = useState("primary");
  const [size, setSize] = useState("md");
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clicked, setClicked] = useState("");

  const variants = ["primary", "secondary", "outline", "ghost", "danger"];
  const sizes = ["sm", "md", "lg"];

  const handleClick = (label) => {
    if (disabled || loading) return;
    setClicked(`"${label}" clicked!`);
    setTimeout(() => setClicked(""), 2000);
  };

  const btnStyle = {
    primary: {
      background: disabled ? "#9ca3af" : "#6366f1",
      color: "#ffffff",
      border: "none",
    },
    secondary: {
      background: disabled ? "#9ca3af" : "#6b7280",
      color: "#ffffff",
      border: "none",
    },
    outline: {
      background: "transparent",
      color: disabled ? "#9ca3af" : "#6366f1",
      border: `2px solid ${disabled ? "#d1d5db" : "#6366f1"}`,
    },
    ghost: {
      background: "transparent",
      color: disabled ? "#9ca3af" : "#6366f1",
      border: "none",
    },
    danger: {
      background: disabled ? "#9ca3af" : "#ef4444",
      color: "#ffffff",
      border: "none",
    },
  };

  const sizeStyles = {
    sm: { padding: "6px 14px", fontSize: "0.8rem" },
    md: { padding: "10px 22px", fontSize: "0.9rem" },
    lg: { padding: "14px 32px", fontSize: "1rem" },
  };

  return (
    <div className="showcase-component">
      <div className="showcase-preview">
        <div className="preview-area">
          <button
            style={{
              ...btnStyle[variant],
              ...sizeStyles[size],
              borderRadius: "8px",
              fontWeight: 600,
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "all 0.2s",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
            disabled={disabled || loading}
            onClick={() => handleClick(`${variant} button`)}
          >
            {loading && <span className="demo-spinner" />}
            {loading ? "Loading..." : `${variant.charAt(0).toUpperCase() + variant.slice(1)} Button`}
          </button>
          {clicked && <p className="click-feedback">{clicked}</p>}
        </div>
      </div>

      <div className="showcase-controls">
        <div className="control-group">
          <label>Variant</label>
          <div className="control-buttons">
            {variants.map((v) => (
              <button
                key={v}
                className={`ctrl-btn ${variant === v ? "active" : ""}`}
                onClick={() => setVariant(v)}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="control-group">
          <label>Size</label>
          <div className="control-buttons">
            {sizes.map((s) => (
              <button
                key={s}
                className={`ctrl-btn ${size === s ? "active" : ""}`}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="control-group row">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={disabled}
              onChange={(e) => setDisabled(e.target.checked)}
            />
            Disabled
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={loading}
              onChange={(e) => setLoading(e.target.checked)}
            />
            Loading
          </label>
        </div>
      </div>
    </div>
  );
}
