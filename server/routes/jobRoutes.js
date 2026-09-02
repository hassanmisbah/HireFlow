const express = require("express");

const {
  createJob,
  getAllJobs,
  getSingleJob,
  updateJob,
  deleteJob,
  getMyJobs,
} = require("../controllers/jobController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Create job - Employer only
router.post("/", protect, authorize("employer"), createJob);

// Get all jobs
router.get("/", getAllJobs);

router.get("/my-jobs", protect, authorize("employer"), getMyJobs);

// Finding job by id 
router.get("/:id", getSingleJob);

// Update job by finding id  
router.put("/:id", protect, authorize("employer"), updateJob);

// Delete job
router.delete("/:id", protect, authorize("employer"), deleteJob);

module.exports = router;