import { Link } from "react-router-dom";
import "./JobCard.css";
import { MapPin } from 'lucide-react';
import { BriefcaseBusiness } from 'lucide-react';
import { Banknote } from 'lucide-react';

function JobCard({ job }) {
  const companyInitial = job.company?.charAt(0).toUpperCase() || "J";

  return (
    <div className="job-card">
      <div className="job-card-top">
        <div className="job-card-title-group">
          <div className="company-logo">
            {companyInitial}
          </div>
          <div className="job-title-container">
            <h3 className="job-title" title={job.title}>
              {job.title}
            </h3>
            <p className="company-name">{job.company}</p>
          </div>
        </div>
        <span className="job-type-badge">{job.jobType}</span>
      </div>

      <div className="job-meta-row">
        <span className="job-meta-item">
          <span className="meta-icon"><MapPin/></span> {job.location}
        </span>
        <span className="job-meta-item">
          <span className="meta-icon"><Banknote/></span> {Number(job.salary).toLocaleString()} PKR
        </span>
      </div>

      <p className="job-description">
        {job.description
          ? `${job.description.substring(0, 110)}${job.description.length > 110 ? "..." : ""}`
          : "No description available."}
      </p>

      <div className="job-card-footer">
        <Link to={`/jobs/${job._id}`} className="details-btn">
          View Details <span className="arrow">→</span>
        </Link>
      </div>
    </div>
  );
}

export default JobCard;
