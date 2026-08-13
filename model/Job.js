const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        company: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        location: {
            type: String,
            required: true
        },

        salary: {
            type: Number
        },

        jobType: {
            type: String,
            enum: ["Full-time", "Part-time", "Internship", "Contract"],
            required: true
        },

        skills: {
            type: [String],
            required: true
        },

        experience: {
            type: Number,
            default: 0
        },

        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Job", jobSchema);