const User = require("../models/user");
const { hashPassword, comparePassword } = require("../helper/auth");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken'); //if matches then genterate jwt token and cookie 
const nodemailer = require("nodemailer");


const test = (req, res) => {
    res.json('test is working');
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name) {
            return res.json({
                error: 'name is req'
            })
        };
        if (!password || password.length < 6) {
            return res.json({
                error: 'Password is req and shoul be at least 6 character'
            })
        };

        const exist = await User.findOne({ email });
        if (exist) {
            return res.json({
                error: 'email is taken'
            })
        }

        const hashedPassword = await hashPassword(password)

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })
        return res.json(user);
    }

    catch (error) {
        console.log(error)
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                error: "No User Found"
            })
        }
        const matching = await comparePassword(password, user.password)
        if (matching) {
            jwt.sign({email:user.email,id:user._id,name:user.name},process.env.jWT_SECRET,{},(err,token)=>{
                if(err) throw err;
                res.cookie("token",token).json(user)
            })
        }
        if(!matching){
            res.json({
                error:"password do not match"      
                })
    }}
    catch (err) {
        console.log(err);
    }
}

const getProfile = async(req,res) => {
const {token} = req.cookies
if(token){
    jwt.verify(token,process.env.JWT_SECRET,{},(err,user)=>{
        if(err) throw err;
        res.json(user)
    })
}else{
  res.json(null)  
}
}

const forgotPassword = async(req,res)=>{
    const {email} = req.body;

    const user = await User.findOne({email});
    try{
        if(!user){
            return res.json({message:"user not registered"});
        }
        const token = jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn:'5m'})
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'shivanshgarg587@gmail.com',
              pass: 'vpey sfbh bstw cbaq'
            }
          });
          const encodedtoken = encodeURIComponent(token).replace(/\./g,"%2E")
          var mailOptions = {
            from: 'shivanshgarg587@gmail.com',
            to: email,
            subject: 'Reset Password',
            // text:`http://localhost:5173/resetpassword/${token}`
            text:`http://localhost:5173/resetpassword/${encodedtoken}`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                return res.json({message:"error sending email"})
            } else {
              return res.json({status: true,message:'Email sent: ' });
            }
          });
    }catch(err){
        console.log(err)
    }
}

const resetPassword = async (req,res) =>{
        const { token } = req.params;
        const { password } = req.body
      
        try {
          
          const decoded = await jwt.verify(token, process.env.JWT_SECRET);
          const id = decoded.id;
      
          const hashedPassword = await bcrypt.hash(password, 10);
      
          await User.findByIdAndUpdate({_id:id}, { password: hashedPassword })
      
          return res.json({ status: true, message: "Password updated successfully" });
        } catch (err) {
          console.error(err);
          return res.json({ message: "Invalid or expired token" });
        }
      
    }

    // // Create a new report
    // const createReport = async (req, res) => {
    //     try {
    //         const { title, type, description, time } = req.body;
    
    //         // Check for required fields
    //         if (!title || !type || !description || !time) {
    //             return res.status(400).json({ error: 'All fields are required' });
    //         }
    
    //         // Handle image uploads
    //         let imageUrls = [];
    //         if (req.files && req.files.images) {
    //             const images = req.files.images;
    //             for (const image of images) {
    //                 // Upload image to Cloudinary
    //                 const result = await cloudinary.uploader.upload(image.path);
    //                 imageUrls.push(result.secure_url);
    
    //                 // Remove file from local storage after upload
    //                 fs.unlinkSync(image.path);
    //             }
    //         }
    
    //         // Create a new report instance
    //         const newReport = new Report({
    //             title,
    //             type,
    //             description,
    //             images: imageUrls,
    //             time,
                
    //         });
    
    //         // Save the report to the database
    //         await newReport.save();
    
    //         res.status(201).json({ success: true, report: newReport });
    //     } catch (error) {
    //         console.error('Error creating report:', error);
    //         res.status(500).json({ error: 'Internal server error' });
    //     }
    // };
    
    
    
   

module.exports = {
    test, registerUser, loginUser , getProfile , forgotPassword , resetPassword 
    
}