import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";
import "./Employer.css";
import "./Auth.css";

function EmployerApplications() {
  const { jobId } = useParams();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Get applications for this job
  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(`/applications/job/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Job Applications:", response.data);

      setApplications(response.data.applications || []);
    } catch (error) {
      console.error("Applications Error:", error.response?.data);

      setMessage(
        error.response?.data?.message || "Failed to load applications"
      );
    } finally {
      setLoading(false);
    }
  };

  // Load applications when page opens
  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  // Accept / Reject application
  const updateStatus = async (applicationId, status) => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.put(
        `/applications/${applicationId}/status`,
        {
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Status Updated:", response.data);

      setMessage(
        response.data.message || "Application status updated successfully"
      );

      // Reload applications after updating status
      await fetchApplications();
    } catch (error) {
      console.error("Status Update Error:", error.response?.data);

      setMessage(
        error.response?.data?.message || "Failed to update application status"
      );
    }
  };

  // Loading screen
  if (loading) {
    return (
      <div className="employer-page">
        <div className="employer-container">
          <div className="jobs-loading-container">
            <div className="linkedin-spinner" />
            <p>Loading candidate applications...</p>
          </div>
        </div>
      </div>
    );
  }

  const isSuccess = message.toLowerCase().includes("success");

  return (
    <div className="employer-page">
      <div className="employer-container">
        <div className="employer-header">
          <div>
            <Link to="/employer/jobs" className="back-link">
              ← Back to My Jobs
            </Link>
            <h1 className="employer-title">Received Applications</h1>
            <p className="employer-subtitle">
              Review and manage candidate applications for this position.
            </p>
          </div>
        </div>

        {/* Success / Error message */}
        {message && (
          <div className={`auth-alert ${isSuccess ? "success" : "error"}`}>
            <span>{isSuccess ? "✅" : "⚠️"}</span>
            <span>{message}</span>
          </div>
        )}

        {/* No applications */}
        {applications.length === 0 ? (
          <div className="no-apps-card">
            <div className="no-apps-icon">👥</div>
            <h2>No applications yet</h2>
            <p>No candidates have applied for this job listing yet.</p>
            <Link to="/employer/jobs" className="btn-secondary-md">
              Return to Dashboard
            </Link>
          </div>
        ) : (
          <div className="employer-apps-list">
            {applications.map((application) => {
              const status = application.status || "pending";
              return (
                <div key={application._id} className="applicant-card">
                  <div className="applicant-header">
                    <div>
                      <h2 className="applicant-name">
                        👤 {application.applicant?.name || "Applicant"}
                      </h2>
                      <p className="applicant-email">
                        ✉️ {application.applicant?.email || "N/A"}
                      </p>
                    </div>

                    <span className={`status-badge ${status}`}>
                      {status === "pending" && "🟡 Under Review"}
                      {status === "accepted" && "🟢 Accepted"}
                      {status === "rejected" && "🔴 Rejected"}
                    </span>
                  </div>

                  <div className="app-cover-box">
                    <div className="app-cover-label">Cover Letter / Pitch</div>
                    <p className="app-cover-text">
                      {application.coverLetter || "No cover letter provided."}
                    </p>
                  </div>

                  {/* Accept / Reject buttons */}
                  {status === "pending" && (
                    <div className="applicant-decision-row">
                      <button
                        className="btn-accept-app"
                        onClick={() => updateStatus(application._id, "accepted")}
                      >
                        ✓ Accept Candidate
                      </button>

                      <button
                        className="btn-reject-app"
                        onClick={() => updateStatus(application._id, "rejected")}
                      >
                        ✕ Reject
                      </button>
                    </div>
                  )}

                  {/* Already processed application */}
                  {status === "accepted" && (
                    <div className="app-status-message accepted">
                      ✅ Application Accepted — Candidate marked for next round.
                    </div>
                  )}

                  {status === "rejected" && (
                    <div className="app-status-message rejected">
                      ❌ Application Rejected — Candidate not selected.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployerApplications;