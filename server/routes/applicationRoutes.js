const express = require("express");

const {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");


const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:jobId", protect, authorize("jobseeker"), applyForJob);

router.get("/my-applications", protect, authorize("jobseeker"),getMyApplications);

router.get("/job/:jobId", protect, authorize("employer"), getJobApplications);

router.put("/:applicationId/status", protect, authorize("employer"), updateApplicationStatus);

module.exports = router;