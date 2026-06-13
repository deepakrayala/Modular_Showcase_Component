import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Signup.css";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    else if (formData.name.trim().length < 2)
      errs.name = "Name must be at least 2 characters";

    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = "Invalid email format";

    if (!formData.password) errs.password = "Password is required";
    else if (formData.password.length < 6)
      errs.password = "Password must be at least 6 characters";
    else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(formData.password))
      errs.password = "Password must contain at least 1 letter and 1 number";

    if (!formData.confirmPassword)
      errs.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      errs.confirmPassword = "Passwords do not match";

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
      await signup(formData.name, formData.email, formData.password);
      navigate("/login", {
        state: { message: "Account created successfully! Please sign in." },
      });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container signup-container">
        <div className="auth-left">
          <div className="auth-brand">
            <span className="auth-brand-icon">◆</span>
            <h1>CompShowcase</h1>
          </div>
          <p className="auth-tagline">
            Join the community and start building with <strong>beautiful modular components</strong>.
          </p>
          <div className="auth-features">
            <div className="auth-feature">
              <span className="feature-icon">✨</span>
              <span>Curated Component Library</span>
            </div>
            <div className="auth-feature">
              <span className="feature-icon">📖</span>
              <span>Detailed Documentation</span>
            </div>
            <div className="auth-feature">
              <span className="feature-icon">⚡</span>
              <span>Live Interactive Previews</span>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-card">
            <h2>Create account</h2>
            <p className="auth-subtitle">Get started with a free account</p>

            {serverError && <div className="alert alert-error">{serverError}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "input-error" : ""}
                />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>

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
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "input-error" : ""}
                />
                {errors.password && (
                  <span className="field-error">{errors.password}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Repeat your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? "input-error" : ""}
                />
                {errors.confirmPassword && (
                  <span className="field-error">{errors.confirmPassword}</span>
                )}
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? <span className="btn-loader" /> : "Create Account"}
              </button>
            </form>

            <p className="auth-alt">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
