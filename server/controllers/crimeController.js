

const Report = require('../models/complaint'); // Assuming the Report model is in the models folder
const cloudinary = require('cloudinary').v2; // Assuming Cloudinary is used for image storage
const fs = require('fs'); // To handle file system operations

// Helper function to check if file type is supported
function isSupported(type, supportedTypes) {
    return supportedTypes.includes(type);
}

// Function to upload file to Cloudinary
async function uploadFileToCloudinary(file, folder) {
    const options = { folder };
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}

exports.createReport = async (req, res) => {
    try {
        const { title, type, description, time, contact, address,latitude,longitude } = req.body;
        
        // Check if required fields are present
        if (!title || !type || !description || !time || !contact || !address) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        let imageUrls = [];
        
        // Check if images are provided
        if (req.files && req.files.images) {
            const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images]; // Handle multiple images
            
            const supportedTypes = ["jpeg", "jpg", "png"];
            
            for (const file of files) {
                const fileType = file.name.split('.').pop().toLowerCase(); // Extract file extension
                
                // Check if the file type is supported
                if (!isSupported(fileType, supportedTypes)) {
                    return res.status(400).json({
                        success: false,
                        message: "File type not supported"
                    });
                }

                // Upload the image to Cloudinary
                const response = await uploadFileToCloudinary(file, "Reports");
                imageUrls.push(response.secure_url); // Push Cloudinary URL to imageUrls array

                // Optionally delete local temp file after upload
                fs.unlinkSync(file.tempFilePath);
            }
        }

        // Create and save the report in the database
        const newReport = new Report({
            title,
            type,
            description,
            time,
            contact,
            address,
            images: imageUrls, // Save array of image URLs,
            latitude,
            longitude
        });

        await newReport.save();

        // Return the created report
        return res.status(201).json({
            success: true,
            message: "Report created successfully",
            report: newReport
        });

    } catch (err) {
        console.error("Error creating report:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

exports.getReports = async (req, res) => {
    try {
        // Fetch all reports from the database
        const reports = await Report.find();

        // Send the reports in the response
        return res.status(200).json({
            success: true,
            data: reports
        });
    } catch (err) {
        console.error("Error fetching reports:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};