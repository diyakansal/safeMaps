const express = require("express");
require("dotenv").config();
const cors = require("cors");
const {mongoose} = require("mongoose");
const cookieParser = require("cookie-parser");

const app = express();

// mongodb setup
mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log('Database Connected'))
.catch((err)=>console.log("Database not connected",err))


//middleware 
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));

//for cloudinary
const fileupload = require("express-fileupload");
app.use(fileupload({
    useTempFiles:true,
    tempFileDir:'/tmp/'
}))


const cloudinary = require("./config/cloudinary");
cloudinary.cloudinaryConnect();


// const API_URL = 'https://newsapi.org/v2/everything';
// const BLOG_API_KEY = '4a67f4475ee1445ea7f95ee8c447a347';

app.use('/',require('./routes/authRoutes'));


const port = 3000;

app.listen(port,()=>console.log(`Server running on ${port}`));
