const express = require("express");
const router = express.Router();
const cors = require("cors");
const {test , registerUser , loginUser ,getProfile , forgotPassword, resetPassword } = require("../controllers/authControllers")
const {createReport , getReports} = require("../controllers/crimeController");
const {createFeedback} = require("../controllers/feedbackController");
//middlware
router.use(
    cors({
        credentials:true,
        origin:'http://localhost:5173'
    })
)


router.get('/',test);
router.post('/register',registerUser); //import it from controllers and connect to path 
router.post("/login",loginUser);
router.get("/profile",getProfile);
router.post("/forgot",forgotPassword)
router.post("/reset/:token",resetPassword)
router.post('/report', createReport);
router.get('/getReports',getReports);
router.post('/feedback',createFeedback);


module.exports = router;