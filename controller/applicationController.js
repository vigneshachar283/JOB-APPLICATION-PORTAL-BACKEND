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

const getJobs = async (req, res) => {
    try {
       
        const { search } = req.query;

        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

      
        const filter = {};

        if (search) {
            filter.title = {
                $regex: search,
                $options: "i"
            };
        }

      
        const totalJobs = await Job.countDocuments(filter);

        
        const totalPages = Math.ceil(totalJobs / limit);

        
        const jobs = await Job.find(filter)
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            page,
            limit,
            totalJobs,
            totalPages,
            jobs
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

const getJobApplications = async (req, res) => {
    try {
        const { jobId } = req.params;

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        if (job.postedBy.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "You are not authorized to view these applications"
            });
        }

        const applications = await Application.find({
            job: jobId
        }).populate("applicant", "name email");

        res.status(200).json({
            count: applications.length,
            applications
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};


const updateapplicationStatus = async (req, res) => {

    try{
        const applicationId = req.params.applicationId;
        const application =await Application.findById(applicationId);

        if(!application)
        {
            return res.status(404).json({message:"application not found"});

        }

        const job =await Job.findById(application.job);

        if(!job)
        {
            return res.status(404).json({message:"job not found"});
        }
    if(job.postedBy.toString()!==req.user.userId)
    {
        return res.status(403).json({message:"you are not authorized to update this application status"});
    }

  const allowedStatuses = [
    "Applied",
    "Shortlisted",
    "Interview",
    "Offer",
    "Rejected"
];

if (!allowedStatuses.includes(req.body.status)) {
    return res.status(400).json({
        message: "Invalid application status"
    });
}

application.status = req.body.status;
await application.save();

res.status(200).json({
    message: "Application status updated successfully",
    application
});

    }catch(err)
    {
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
}




module.exports = {
    applyJob,
    getJobs,
    getJobApplications,
    updateapplicationStatus
};