import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AdminAddComponent.css";

const CATEGORIES = [
  "Buttons", "Cards", "Modals", "Forms", "Tables",
  "Navigation", "Badges", "Alerts", "Spinners", "Inputs",
  "Layout", "Typography", "Icons", "Other",
];

const STATUS_OPTIONS = ["active", "draft", "deprecated"];

export default function AdminAddComponent() {

  const { user, authFetch, GATEWAY_URL } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    codeSnippet: "",
    props: "",
    status: "active",
    tagInput: "",
  });

  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Redirect non-admins
  useEffect(() => {
    if (user && user.roleId !== 2) {
      navigate("/dashboard", { replace: true });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = form.tagInput.trim();
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
      }
      setForm({ ...form, tagInput: "" });
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const validate = () => {
    const errs = [];
    if (!form.name.trim()) errs.push("Component name is required");
    if (!form.category) errs.push("Category is required");
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const errs = validate();
    if (errs.length > 0) {
      setError(errs.join(". "));
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: form.name.trim(),
        category: form.category,
        description: form.description.trim(),
        codeSnippet: form.codeSnippet,
        props: form.props,
        status: form.status,
        tags: tags,
        createdBy: user?.name || "Admin",
      };

      const res = await authFetch(`${GATEWAY_URL}/api/mongo/components`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(`Component "${data.name}" created successfully in MongoDB!`);
        // Reset form
        setForm({ name: "", category: "", description: "", codeSnippet: "", props: "", status: "active", tagInput: "" });
        setTags([]);
      } else {
        setError(data.detail || data.error || "Failed to create component");
      }
    } catch (err) {
      setError(err.message || "Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-component-page">
      <h1>Add New Component</h1>
      <p className="page-subtitle">
        Create a new UI component and store it in MongoDB. Only admins can access this page.
      </p>

      {success && <div className="alert-success">{success} <Link to="/admin">Back to Admin Panel</Link></div>}
      {error && <div className="alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="form-card">

        <div className="form-row">
          <div className="form-group">
            <label>Component Name <span className="required">*</span></label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Primary Button"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Category <span className="required">*</span></label>
            <select name="category" value={form.category} onChange={handleChange} required>
              <option value="">-- Select Category --</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            placeholder="Describe what this component does, its use cases, and key features..."
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Code Snippet</label>
          <textarea
            name="codeSnippet"
            placeholder="<button class=&quot;btn btn-primary&quot;>Click Me</button>"
            value={form.codeSnippet}
            onChange={handleChange}
            style={{ minHeight: "150px" }}
          />
          <div className="form-hint">HTML/JSX code that demonstrates the component</div>
        </div>

        <div className="form-group">
          <label>Props (JSON)</label>
          <textarea
            name="props"
            placeholder='{ "variant": "primary", "size": "md", "disabled": false }'
            value={form.props}
            onChange={handleChange}
            style={{ minHeight: "80px" }}
          />
          <div className="form-hint">Optional props/attributes as JSON</div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Tags</label>
            <div className="tag-input-wrapper">
              {tags.map((tag, i) => (
                <span key={i} className="tag-item">
                  {tag}
                  <button type="button" onClick={() => removeTag(i)}>×</button>
                </span>
              ))}
              <input
                type="text"
                name="tagInput"
                placeholder={tags.length === 0 ? "Type and press Enter to add tags" : "Add more..."}
                value={form.tagInput}
                onChange={handleChange}
                onKeyDown={handleTagKeyDown}
              />
            </div>
            <div className="form-hint">Press Enter or comma to add a tag</div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit-component" disabled={loading}>
            {loading ? "Creating..." : "Create Component"}
          </button>
          <Link to="/admin" className="btn-cancel">Cancel</Link>
        </div>

      </form>
    </div>
  );
}
