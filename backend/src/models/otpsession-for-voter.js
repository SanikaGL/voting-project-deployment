const mongoose = require("mongoose");

const otpSchema_for_voter = new mongoose.Schema({
  email: String,
  otp: String,
  expiresAt: {
    type:Date,
    required: true,
    index:{expires:0}
  }
});

module.exports = mongoose.model("OtpSession", otpSchema_for_voter);