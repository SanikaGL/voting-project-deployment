const express = require("express");
const router = express.Router();
const voter_login_controller = require("../controllers/login.voter.controller")
router.post("/voter-login-otp",voter_login_controller.login_otp)
router.post("/voter-login-verify",voter_login_controller.login_verify)

module.exports = router;