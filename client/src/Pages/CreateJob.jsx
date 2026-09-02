import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import "./Employer.css";
import "./Auth.css";

function CreateJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    jobType: "",
    description: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");

      const response = await api.post(
        "/jobs",
        {
          ...formData,
          salary: Number(formData.salary),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message || "Job created successfully!"
      );

      setTimeout(() => {
        navigate("/employer/jobs");
      }, 1000);
    } catch (error) {
      console.error("Create Job Error:", error.response?.data);

      setMessage(
        error.response?.data?.message || "Failed to create job"
      );
    } finally {
      setLoading(false);
    }
  };

  const isSuccess = message.toLowerCase().includes("success");

  return (
    <div className="employer-page">
      <div className="employer-container">
        <div className="edit-job-card">
          <div className="employer-header">
            <div>
              <Link to="/employer/jobs" className="back-link">
                ← Back to My Jobs
              </Link>
              <h1 className="employer-title">Post a New Job</h1>
              <p className="employer-subtitle">
                Fill in the details below to publish an opening and reach qualified talent.
              </p>
            </div>
          </div>

          {message && (
            <div className={`auth-alert ${isSuccess ? "success" : "error"}`}>
              <span>{isSuccess ? "✅" : "⚠️"}</span>
              <span>{message}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="edit-form-grid">
              <div className="form-group">
                <label className="form-label">Job Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-input"
                  placeholder="e.g. Senior Frontend Developer"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input
                  type="text"
                  name="company"
                  className="form-input"
                  placeholder="e.g. Acme Technologies"
                  value={formData.company}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  name="location"
                  className="form-input"
                  placeholder="e.g. Lahore, PK or Remote"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Salary (PKR)</label>
                <input
                  type="number"
                  name="salary"
                  className="form-input"
                  placeholder="e.g. 120000"
                  value={formData.salary}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group form-group-full">
                <label className="form-label">Employment Type</label>
                <select
                  name="jobType"
                  className="form-select"
                  value={formData.jobType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Job Type</option>
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="internship">Internship</option>
                  <option value="remote">Remote</option>
                </select>
              </div>

              <div className="form-group form-group-full">
                <label className="form-label">Job Description & Requirements</label>
                <textarea
                  name="description"
                  className="apply-textarea"
                  placeholder="Provide detailed description of responsibilities, requirements, skills, and benefits..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="8"
                />
              </div>
            </div>

            <div className="apply-actions">
              <button
                type="button"
                className="btn-apply-cancel"
                onClick={() => navigate("/employer/jobs")}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-auth-submit"
                style={{ width: "auto", padding: "12px 32px" }}
              >
                {loading ? "Publishing Job..." : "Publish Job Opening"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateJob;