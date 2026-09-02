const express = require("express");
const router = express.Router();
const controller = require("../controllers/register.voter.controller")
router.post("/send-otp",controller.sendOtp)//middleware 
router.post("/otp-register",controller.register)
module.exports = router;