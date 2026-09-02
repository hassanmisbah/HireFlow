import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import "./ApplyJob.css";
import "./Auth.css";

function ApplyJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  console.log("Apply Page Job ID:", jobId);

  const [coverLetter, setCoverLetter] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if Job ID exists
    if (!jobId) {
      setMessage("Job ID missing. Please open the job again.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await api.post(
        `/applications/${jobId}`,
        {
          coverLetter: coverLetter,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message || "Application submitted successfully!"
      );

      setTimeout(() => {
        navigate("/jobs");
      }, 1500);
    } catch (error) {
      console.log(
        "Application Error:",
        error.response?.data || error.message
      );

      setMessage(
        error.response?.data?.message || "Application failed"
      );
    }
  };

  const isSuccess = message.toLowerCase().includes("success");

  return (
    <div className="apply-page">
      <div className="apply-card">
        <div className="apply-header">
          <Link to={`/jobs/${jobId}`} className="apply-back-link">
            ← Back to job details
          </Link>
          <h1 className="apply-title">Easy Apply</h1>
          <p className="apply-subtitle">
            Submit your application directly to the hiring employer.
          </p>
        </div>

        {message && (
          <div className={`auth-alert ${isSuccess ? "success" : "error"}`}>
            <span>{isSuccess ? "✅" : "⚠️"}</span>
            <span>{message}</span>
          </div>
        )}

        <form className="apply-form" onSubmit={handleSubmit}>
          <div>
            <label className="apply-label">
              <span>Cover Letter / Pitch</span>
              <span className="apply-label-hint">Explain why you're a great fit</span>
            </label>
            <textarea
              className="apply-textarea"
              placeholder="Highlight your relevant experience, key skills, and why you are interested in this position..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              required
              rows="8"
            />
          </div>

          <div className="apply-actions">
            <button
              type="button"
              className="btn-apply-cancel"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button type="submit" className="btn-apply-submit">
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplyJob;