const generateOtp = require("../utils/generateOtp");
const OtpSession = require("../models/otpsession-for-voter");
const emailService = require("./email-service");

exports.createAndSendOtp = async (email) => {

  const otp = generateOtp();

  const expiresAt = new Date(Date.now() + 1 * 60 * 1000);

  await OtpSession.deleteMany({ email });

  await OtpSession.create({
    email,
    otp,
    expiresAt
  });

  await emailService.sendOtpEmail(email, otp);
};