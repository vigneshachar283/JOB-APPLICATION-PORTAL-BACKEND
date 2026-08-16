const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { applyJob ,getJobApplications,updateapplicationStatus,getJobs} = require("../controllers/applicationController");



router.post(
    "/:jobId",
    authMiddleware,
    applyJob
);
router.get("/jobs", authMiddleware, getJobs);
router.get("/:jobId", authMiddleware, getJobApplications);
router.put("/:applicationId", authMiddleware, updateapplicationStatus);

module.exports = router;