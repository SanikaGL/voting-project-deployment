const otpsession = require("../models/otpsession-for-voter");
const Voter = require("../models/voter");
const otpService = require("../services/otp-service");
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // ✅ 1. Validate input
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    // ✅ 2. Check if voter already exists
    const existingVoter = await Voter.findOne({ email });

    // If voter exists AND already verified
    if (existingVoter && existingVoter.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already registered. Please login."
      });
    }

    // ✅ 3. If voter exists but NOT verified → allow OTP resend
    // ✅ 4. If voter does not exist → allow OTP sending
    const otpexist = await otpsession.findOne({email});
    if(otpexist){

    await otpService.createAndSendOtp(email);

    return res.status(200).json({
      success: true,
      message: "new OTP sent successfully to email"
    });
    }
    await otpService.createAndSendOtp(email);
    return res.status(200).json({
      success: true,
      message: " OTP sent successfully to email"

  })} catch (error) {
    console.error("Send OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending OTP"
    });
  }
};
exports.register = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // 1️⃣ Required validation
    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required"
      });
    }

    // 2️⃣ Find OTP session
    const check = await otpsession.findOne({ email });

    if (!check) {
      return res.status(400).json({
        message: "OTP expired or not found"
      });
    }

    // 3️⃣ Expiry check (important even if TTL exists)
    if (check.expiresAt < new Date()) {
      await otpsession.deleteMany({ email });

      return res.status(400).json({
        message: "OTP expired"
      });
    }

    // 4️⃣ Match OTP
    if (check.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    // 5️⃣ Create user
    await Voter.create({
      email,
      role: "voter",
      isVerified: true
    });

    // 6️⃣ Delete OTP after successful registration
    await otpsession.deleteMany({ email });

    return res.status(200).json({
      message: "Registered successfully"
    });

  } catch (error) {
    return res.status(500).json({
      message: "Registration failed"
    });
  }
};