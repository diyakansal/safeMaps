const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['Vandalism', 'Theft', 'Assault', 'Murder', 'Robbery'], // Restrict to these types
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    images: [
        {
            type: String, // This will store the file path or URL to the uploaded image //cloudinary
        },
     ]
    ,
    time:{
        type:String,
        required:true
    },
     createdAt: {
         type: Date,
         default: Date.now,
    },
    contact:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    latitude:{
        type:String,
        required:true,
    },longitude:{
        type:String,
        required:true,
    }
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
