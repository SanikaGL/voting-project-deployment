const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendOtpEmail = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}`
  });
};
exports.sendMsg = async(email,message)=>{
  await  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "mail from admin",
    text:message
  });
};

