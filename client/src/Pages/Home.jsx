import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import JobCard from "../Components/JobCard";
import { useEffect, useState } from "react";
import api from "../api/api";
import { Search } from 'lucide-react';
import { MapPin } from 'lucide-react';
import { BriefcaseBusiness } from 'lucide-react';

function Home() {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchType, setSearchType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        const response = await api.get("/jobs");
        console.log("Jobs API Response:", response.data);
        if (response.data && response.data.jobs) {
          setFeaturedJobs(response.data.jobs.slice(0, 6));
        }
      } catch (error) {
        console.error("Error fetching featured jobs:", error);
      }
    };

    fetchFeaturedJobs();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    navigate("/jobs");
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-badge">
            <span> Welcome to your professional job community</span>
          </div>

          <h1 className="hero-title">
            Land your next opportunity with <span className="highlight-text">HireFlow</span>
          </h1>

          <p className="hero-subtitle">
            Explore thousands of verified job postings from top employers. Connect directly, apply seamlessly, and accelerate your career growth.
          </p>

          <div className="hero-cta-buttons">
            <Link to="/jobs" className="btn-primary-lg">
              Explore Jobs
            </Link>
            <Link to="/register" className="btn-secondary-lg">
              Post a Job / Join Now
            </Link>
          </div>
        </div>
      </section>

      {/* Floating Quick Search Bar */}
      <section className="search-section">
        <div className="search-card-container">
          <form className="quick-search-form" onSubmit={handleHeroSearch}>
            <div className="search-field">
              <span className="search-field-icon"><Search /></span>
              <input
                type="text"
                placeholder="Job title, skill, or company"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="search-divider" />

            <div className="search-field">
              <span className="search-field-icon"><MapPin /></span>
              <input
                type="text"
                placeholder="City, state, or 'Remote'"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </div>

            <div className="search-divider" />

            <div className="search-field">
              <span className="search-field-icon"><BriefcaseBusiness /></span>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="">All Job Types</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="remote">Remote</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            <button type="submit" className="search-submit-btn">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="featured-section">
        <div className="featured-container">
          <div className="section-header-row">
            <div>
              <h2 className="section-title">Featured Opportunities</h2>
              <p className="section-subtitle">
                Handpicked recent job openings matched to top talent.
              </p>
            </div>
            <Link to="/jobs" className="view-all-link">
              View All Jobs <span className="arrow">→</span>
            </Link>
          </div>

          {featuredJobs.length > 0 ? (
            <div className="jobs-grid">
              {featuredJobs.map((job) => (
                <JobCard key={job._id || job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="empty-featured-card">
              <p>No featured jobs available at the moment.</p>
              <Link to="/jobs" className="btn-secondary-sm">
                Browse All Openings
              </Link>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}

export default Home;
