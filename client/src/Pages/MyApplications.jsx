import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import "./MyApplications.css";
import "./Auth.css";
import { Search } from 'lucide-react';
import { MapPin } from 'lucide-react';
import { Calendar  } from 'lucide-react';
import { Banknote } from 'lucide-react';

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/applications/my-applications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("My Applications:", response.data);

      setApplications(response.data.applications || []);
    } catch (error) {
      console.error("My Applications Error:", error.response?.data);

      setMessage(
        error.response?.data?.message || "Failed to load applications"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="my-apps-page">
        <div className="my-apps-container">
          <div className="jobs-loading-container">
            <div className="linkedin-spinner" />
            <p>Loading your job applications...</p>
          </div>
        </div>
      </div>
    );
  }

  const isSuccess = message.toLowerCase().includes("success");

  return (
    <div className="my-apps-page">
      <div className="my-apps-container">
        <div className="my-apps-header">
          <div>
            <h1 className="my-apps-title">My Applications</h1>
            <p className="my-apps-subtitle">
              Track the status of your submitted job applications.
            </p>
          </div>
          <Link to="/jobs" className="btn-secondary-md">
            + Explore More Jobs
          </Link>
        </div>

        {message && (
          <div className={`auth-alert ${isSuccess ? "success" : "error"}`}>
            <span>{isSuccess ? "✅" : "⚠️"}</span>
            <span>{message}</span>
          </div>
        )}

        {applications.length === 0 ? (
          <div className="no-apps-card">
            <div className="no-apps-icon">📄</div>
            <h2>No applications submitted yet</h2>
            <p>
              You have not applied for any jobs yet. Start exploring open opportunities today!
            </p>
            <Link to="/jobs" className="btn-primary-lg">
              Browse Open Jobs
            </Link>
          </div>
        ) : (
          <div className="apps-list">
            {applications.map((application) => {
              const status = application.status || "pending";
              return (
                <div key={application._id} className="application-card">
                  <div className="application-card-header">
                    <div>
                      <h2 className="app-job-title">
                        {application.job?.title || "Job Title"}
                      </h2>
                      <p className="app-company-name">
                        🏢 {application.job?.company || "N/A"}
                      </p>
                    </div>

                    <span className={`status-badge ${status}`}>
                      {status === "pending" && "🟡 Under Review"}
                      {status === "accepted" && "🟢 Accepted"}
                      {status === "rejected" && "🔴 Not Selected"}
                    </span>
                  </div>

                  <div className="app-meta-row">
                    <span className="app-meta-item">
                      <MapPin size={19}/> {application.job?.location || "N/A"}
                    </span>
                    <span className="app-meta-item">
                      <Calendar size={19}/>Applied on:{" "}
                      {application.createdAt
                        ? new Date(application.createdAt).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : "N/A"}
                    </span>
                  </div>

                  <div className="app-cover-box">
                    <div className="app-cover-label">Cover Letter</div>
                    <p className="app-cover-text">
                      {application.coverLetter || "No cover letter submitted."}
                    </p>
                  </div>

                  {status === "pending" && (
                    <div className="app-status-message pending">
                      ⏳ Your application is currently under review by the employer.
                    </div>
                  )}
                  {status === "accepted" && (
                    <div className="app-status-message accepted">
                      🎉 Congratulations! Your application has been accepted. The employer may reach out soon.
                    </div>
                  )}
                  {status === "rejected" && (
                    <div className="app-status-message rejected">
                      ℹ️ Thank you for your interest. The employer has decided not to proceed at this time.
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

export default MyApplications;