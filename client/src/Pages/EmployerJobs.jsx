import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import "./Employer.css";
import "./Auth.css";
import {
  MapPin,
  Banknote,
  SquarePen,
  Trash,
  UserRoundArrowLeft
} from "lucide-react";

function EmployerJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const fetchMyJobs = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/jobs/my-jobs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("My Jobs:", response.data);

      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error("My Jobs Error:", error.response?.data);

      setMessage(error.response?.data?.message || "Failed to load your jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setJobs((previousJobs) =>
        previousJobs.filter((job) => job._id !== jobId)
      );

      setMessage("Job deleted successfully");
    } catch (error) {
      console.error("Delete Job Error:", error.response?.data);

      setMessage(error.response?.data?.message || "Failed to delete job");
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  if (loading) {
    return (
      <div className="employer-page">
        <div className="employer-container">
          <div className="jobs-loading-container">
            <div className="linkedin-spinner" />
            <p>Loading your posted jobs...</p>
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
            <h1 className="employer-title">Employer Dashboard</h1>
            <p className="employer-subtitle">
              Manage your active job postings and candidate applications.
            </p>
          </div>

          <Link to="/employer/create-job" className="btn-post-job">
            + Create a New Job
          </Link>
        </div>

        {message && (
          <div className={`auth-alert ${isSuccess ? "success" : "error"}`}>
            <span>{isSuccess ? "✅" : "⚠️"}</span>
            <span>{message}</span>
          </div>
        )}

        {jobs.length === 0 ? (
          <div className="no-apps-card">
            <div className="no-apps-icon">💼</div>
            <h2>No jobs posted yet</h2>
            <p>You haven't posted any jobs under this employer account yet.</p>
            <Link to="/employer/create-job" className="btn-post-job" style={{ marginTop: "16px" }}>
              + Post Your First Job
            </Link>
          </div>
        ) : (
          <div className="employer-jobs-list">
            {jobs.map((job) => (
              <div key={job._id} className="employer-job-card">
                <div className="emp-card-header">
                  <div>
                    <h2 className="emp-job-title">{job.title}</h2>
                    <p className="emp-job-company">🏢 {job.company}</p>
                  </div>
                  <span className="job-type-badge">{job.jobType}</span>
                </div>

                <div className="emp-job-meta">
                  <span className="emp-meta-item">
                    <MapPin size={16} />
                    <span>{job.location}</span>
                  </span>
                  {job.salary && (
                    <span className="emp-meta-item">
                      <Banknote size={16} />
                      <span>{Number(job.salary).toLocaleString()} PKR</span>
                    </span>
                  )}
                </div>

                <div className="emp-actions-row">
                  <button
                    className="btn-view-apps"
                    onClick={() =>
                      navigate(`/employer/applications/${job._id}`)
                    }
                  >
                    <span>View Applications</span>
                    <UserRoundArrowLeft size={16} />
                  </button>

                  <button
                    className="btn-edit-job"
                    onClick={() => navigate(`/employer/edit-job/${job._id}`)}
                  >
                    <span>Edit Job</span>
                    <SquarePen size={16} />
                  </button>

                  <button
                    className="btn-delete-job"
                    onClick={() => handleDelete(job._id)}
                  >
                    <span>Delete Job</span>
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployerJobs;
