import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState(
    location.state?.message || ""
  );
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = "Invalid email format";
    if (!formData.password) errs.password = "Password is required";
    else if (formData.password.length < 6)
      errs.password = "Password must be at least 6 characters";
    return errs;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate("/dashboard");
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <div className="auth-brand">
            <span className="auth-brand-icon">◆</span>
            <h1>CompShowcase</h1>
          </div>
          <p className="auth-tagline">
            Explore, test, and interact with <strong>modular UI components</strong>.
          </p>
          <div className="auth-features">
            <div className="auth-feature">
              <span className="feature-icon">📦</span>
              <span>Modular Components</span>
            </div>
            <div className="auth-feature">
              <span className="feature-icon">🔍</span>
              <span>Smart Search</span>
            </div>
            <div className="auth-feature">
              <span className="feature-icon">🎯</span>
              <span>Interactive Previews</span>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-card">
            <h2>Welcome back</h2>
            <p className="auth-subtitle">Sign in to your account</p>

            {successMsg && <div className="alert alert-success">{successMsg}</div>}
            {serverError && <div className="alert alert-error">{serverError}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "input-error" : ""}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "input-error" : ""}
                />
                {errors.password && (
                  <span className="field-error">{errors.password}</span>
                )}
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? <span className="btn-loader" /> : "Sign In"}
              </button>
            </form>

            <p className="auth-alt">
              Don&apos;t have an account? <Link to="/signup">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
