import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../api/api";
import "./Employer.css";
import "./Auth.css";

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    jobType: "full-time",
    description: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get(`/jobs/${id}`);

        const job = response.data.job;

        setFormData({
          title: job.title || "",
          company: job.company || "",
          location: job.location || "",
          salary: job.salary || "",
          jobType: job.jobType || "full-time",
          description: job.description || "",
        });
      } catch (error) {
        console.error("Fetch Job Error:", error.response?.data);

        setMessage(
          error.response?.data?.message || "Failed to load job"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await api.put(
        `/jobs/${id}`,
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
        response.data.message || "Job updated successfully"
      );

      setTimeout(() => {
        navigate("/employer/jobs");
      }, 1000);
    } catch (error) {
      console.error("Update Job Error:", error.response?.data);

      setMessage(
        error.response?.data?.message || "Failed to update job"
      );
    }
  };

  if (loading) {
    return (
      <div className="employer-page">
        <div className="employer-container">
          <div className="jobs-loading-container">
            <div className="linkedin-spinner" />
            <p>Loading job details...</p>
          </div>
        </div>
      </div>
    );
  }

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
              <h1 className="employer-title">Edit Job Posting</h1>
              <p className="employer-subtitle">
                Update details for this role to attract qualified candidates.
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
                  placeholder="e.g. Acme Corp"
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
                  placeholder="e.g. 150000"
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
                >
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
                  placeholder="Provide details about responsibilities, qualifications, tech stack, and benefits..."
                  value={formData.description}
                  onChange={handleChange}
                  rows="8"
                  required
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
              <button type="submit" className="btn-auth-submit" style={{ width: "auto", padding: "12px 30px" }}>
                Update Job Posting
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditJob;