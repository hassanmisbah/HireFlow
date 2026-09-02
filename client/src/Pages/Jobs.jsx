import { useEffect, useState } from "react";
import JobCard from "../Components/JobCard";
import api from "../api/api";
import "./Jobs.css";
import { Search } from 'lucide-react';
import { MapPin } from 'lucide-react';
import { BriefcaseBusiness } from 'lucide-react';
import { Banknote } from 'lucide-react';

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [minSalary, setMinSalary] = useState("");

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const params = {};

      if (keyword.trim()) {
        params.keyword = keyword;
      }

      if (location.trim()) {
        params.location = location;
      }

      if (jobType) {
        params.jobType = jobType;
      }

      if (minSalary) {
        params.minSalary = minSalary;
      }

      const response = await api.get("/jobs", {
        params,
      });

      console.log("Jobs API Response:", response.data);

      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const clearFilters = () => {
    setKeyword("");
    setLocation("");
    setJobType("");
    setMinSalary("");

    setTimeout(() => {
      fetchJobs();
    }, 0);
  };

  return (
    <section className="jobs-page">
      <div className="jobs-container">
        {/* Header */}
        <div className="jobs-page-header">
          <h1 className="jobs-page-title">Explore Opportunities</h1>
          <p className="jobs-page-subtitle">
            Find and apply to the best roles matching your career ambitions.
          </p>
        </div>

        {/* Search & Filters Bar */}
        <div className="job-filters-card">
          <form className="job-filters" onSubmit={handleSearch}>
            <div className="filter-input-group">
              <span className="filter-icon"><Search /></span>
              <input
                type="text"
                placeholder="Job title or company..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>

            <div className="filter-input-group">
              <span className="filter-icon"><MapPin /></span>
              <input
                type="text"
                placeholder="Location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="filter-input-group">
              <span className="filter-icon"><BriefcaseBusiness /></span>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
              >
                <option value="">All Job Types</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="internship">Internship</option>
                <option value="remote">Remote</option>
              </select>
            </div>

            <div className="filter-input-group">
              <span className="filter-icon"><Banknote /></span>
              <input
                type="number"
                placeholder="Min salary (PKR)"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
              />
            </div>

            <div className="filter-actions-group">
              <button type="submit" className="btn-search-submit">
                Search Jobs
              </button>

              <button
                type="button"
                className="clear-btn"
                onClick={clearFilters}
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Results Metadata */}
        <div className="results-meta-bar">
          <span className="results-count-badge">
            {loading ? "Searching..." : `${jobs.length} jobs available`}
          </span>
        </div>

        {/* Jobs Grid / States */}
        {loading ? (
          <div className="jobs-loading-container">
            <div className="linkedin-spinner" />
            <p>Loading open roles...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="no-jobs-card">
            <div className="no-jobs-icon"><Search/></div>
            <h2>No matching jobs found</h2>
            <p>
              Try adjusting your search keywords, location, or clearing the filters to discover more openings.
            </p>
            <button className="btn-secondary-md" onClick={clearFilters}>
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="jobs-grid">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Jobs;