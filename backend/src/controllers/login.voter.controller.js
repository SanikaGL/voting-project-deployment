const otpsession = require("../models/otpsession-for-voter");
const voter = require("../models/voter"); 
const otpService = require("../services/otp-service");
const jwt = require("jsonwebtoken")
require("dotenv").config();
exports.login_otp= async(req,res)=>{ // when they click send otp then this function is used for voter
    try{ 
     const email = req.body.email;
     if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
     }
     const user_found = await voter.findOne({email}); //--------->>>>>>>>>>>>>>>. here await
     if(user_found && user_found.isVerified){
          await otpService.createAndSendOtp(email);
          return res.status(200).json({
            success: true,
            message: " OTP sent successfully to email"
          })
     }
     return res.json({
        message:" You are not registered as voter"
     })
   }catch(error){
    res.status(500).json({
        message:"something went wrong"
    })
}
}
exports.login_verify = async(req,res)=>{//voter login verifier function
 try {
     const { email, otp } = req.body;
 
     // 1️⃣ Required validation
     if (!email || !otp) {
       return res.status(400).json({
         message: "Email and OTP are required"
       });
     }
 
     // 2️⃣ Find OTP session
     const user = await otpsession.findOne({ email });
 
     if (!user) {
       return res.status(400).json({
         message: "OTP expired or not found"
       });
     }
 
     // 3️⃣ Expiry check (important even if TTL exists)
     if (user.expiresAt < new Date()) {
       await otpsession.deleteMany({ email });
 
       return res.status(400).json({
         message: "OTP expired"
       });
     }
 
     // 4️⃣ Match OTP
     if (user.otp !== otp) {
       return res.status(400).json({
         message: "Invalid OTP"
       });
     }
 
    
     const token = jwt.sign(
      {
        email: user.email,
        role: "admin"
      },
      process.env.JWT_SECRET,
      { expiresIn: "1m" }
     );
     // 6️⃣ Delete OTP after successful registration
     await otpsession.deleteMany({ email });
 
     return res.status(200).json({
       message: "Logged in successfully.",
       token
     });
 
   } catch (error) {
     return res.status(500).json({
       message: "Login failed"
     });
   }
 };
