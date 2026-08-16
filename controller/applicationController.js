const Application = require("../models/Application");
const Job = require("../models/Job");

const applyJob = async (req, res) => {
    try {
        const { jobId } = req.params;

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: req.user.userId
        });

        if (existingApplication) {
            return res.status(400).json({
                message: "Already applied for this job"
            });
        }

        const application = await Application.create({
            job: jobId,
            applicant: req.user.userId,
            coverLetter: req.body.coverLetter
        });

        res.status(201).json({
            message: "Application submitted successfully",
            application
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};





module.exports = {
    applyJob
};