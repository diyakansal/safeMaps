const Feedback = require('../models/feedback'); // Assuming the Feedback model is in the models folder

exports.createFeedback = async (req, res) => {
    try {
        const { name, locality, problem, measures, landmark } = req.body;

        // Check if required fields are present
        if (!name || !locality || !problem || !measures || !landmark) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Create and save the feedback in the database
        const newFeedback = new Feedback({
            name,
            locality,
            problem,
            measures,
            landmark
        });

        await newFeedback.save();

        // Return the created feedback
        return res.status(201).json({
            success: true,
            message: "Feedback created successfully",
            feedback: newFeedback
        });

    } catch (err) {
        console.error("Error creating feedback:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
