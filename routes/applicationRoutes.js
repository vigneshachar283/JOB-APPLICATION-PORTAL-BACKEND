const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { applyJob } = require("../controllers/applicationController");

router.post(
    "/:jobId",
    authMiddleware,
    applyJob
);

module.exports = router;