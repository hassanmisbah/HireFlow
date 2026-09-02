import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MapPin } from 'lucide-react';
import { BriefcaseBusiness } from 'lucide-react';
import { Banknote } from 'lucide-react';

import api from "../api/api";
import "./JobDetails.css";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get(`/jobs/${id}`);

        console.log("JOB API RESPONSE:", response.data);

        // API ke andar actual job object
        setJob(response.data.job);
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="job-details-loading">
        <div className="linkedin-spinner" />
        <p>Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="job-not-found-container">
        <div className="not-found-card">
          <h2>Job Not Found</h2>
          <p>This job listing may have expired or is no longer available.</p>
          <Link to="/jobs" className="btn-secondary-md">
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  const companyInitial = job.company?.charAt(0).toUpperCase() || "J";

  return (
    <section className="job-details-page">
      <div className="job-details-container">
        {/* Navigation Breadcrumb */}
        <Link to="/jobs" className="back-link">
          ← Back to all jobs
        </Link>

        {/* Main Job Card */}
        <div className="job-details-main-card">
          <div className="job-details-header">
            <div className="company-header-row">
              <div className="company-logo-lg">{companyInitial}</div>
              <div className="job-title-info">
                <h1 className="job-details-title">{job.title}</h1>
                <h2 className="job-details-company">{job.company}</h2>
              </div>
            </div>

            <span className="job-type-pill">{job.jobType}</span>
          </div>

          {/* Quick Info Bar */}
          <div className="job-meta-chips-bar">
            <div className="meta-chip">
              <span className="chip-icon"><MapPin/></span>
              <div>
                <span className="chip-label">Location</span>
                <span className="chip-value">{job.location}</span>
              </div>
            </div>

            <div className="meta-chip">
              <span className="chip-icon"><Banknote/></span>
              <div>
                <span className="chip-label">Offered Salary</span>
                <span className="chip-value">
                  {Number(job.salary).toLocaleString()} PKR
                </span>
              </div>
            </div>

            <div className="meta-chip">
              <span className="chip-icon"><BriefcaseBusiness/></span>
              <div>
                <span className="chip-label">Employment Type</span>
                <span className="chip-value capitalize">{job.jobType}</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="job-action-row">
            <button
              className="apply-btn-primary"
              onClick={() => {
                const token = localStorage.getItem("token");

                if (!token) {
                  navigate("/login");
                  return;
                }

                console.log("JOB OBJECT:", job);
                console.log("JOB ID:", job._id);

                navigate(`/apply/${job._id}`);
              }}
            >
              Apply Now <span className="arrow">↗</span>
            </button>
          </div>

          {/* Job Description Content */}
          <div className="job-description-section">
            <h3 className="section-heading-text">About the role</h3>
            <div className="job-description-body">
              <p>{job.description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default JobDetails;