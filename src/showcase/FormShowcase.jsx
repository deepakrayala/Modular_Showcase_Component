import { useState } from "react";

export default function FormShowcase() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "developer",
    message: "",
  });
  const [submitted, setSubmitted] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = "Invalid email format";
    if (!formData.message.trim()) errs.message = "Message is required";
    return errs;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitted({ ...formData });
    setFormData({ name: "", email: "", role: "developer", message: "" });
  };

  return (
    <div className="showcase-component">
      <div className="showcase-preview">
        <div className="preview-area">
          {submitted ? (
            <div className="form-success">
              <span className="success-icon">✅</span>
              <h3>Form Submitted!</h3>
              <p>
                <strong>Name:</strong> {submitted.name}
              </p>
              <p>
                <strong>Email:</strong> {submitted.email}
              </p>
              <p>
                <strong>Role:</strong> {submitted.role}
              </p>
              <p>
                <strong>Message:</strong> {submitted.message}
              </p>
              <button
                className="demo-btn-secondary"
                onClick={() => setSubmitted(null)}
                style={{ marginTop: "16px" }}
              >
                Reset
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{ width: "100%", maxWidth: "400px" }}
            >
              <div className="demo-form-group">
                <label>Full Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={errors.name ? "input-err" : ""}
                />
                {errors.name && (
                  <span className="demo-field-error">{errors.name}</span>
                )}
              </div>

              <div className="demo-form-group">
                <label>Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={errors.email ? "input-err" : ""}
                />
                {errors.email && (
                  <span className="demo-field-error">{errors.email}</span>
                )}
              </div>

              <div className="demo-form-group">
                <label>Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="developer">Developer</option>
                  <option value="designer">Designer</option>
                  <option value="manager">Manager</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="demo-form-group">
                <label>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message..."
                  rows={4}
                  className={errors.message ? "input-err" : ""}
                />
                {errors.message && (
                  <span className="demo-field-error">{errors.message}</span>
                )}
              </div>

              <button type="submit" className="demo-btn-primary">
                Submit Form
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="showcase-controls">
        <p className="control-hint">
          Fill in the form fields and click submit to see validation and form
          handling in action.
        </p>
      </div>
    </div>
  );
}
