const express = require("express");
const router = express.Router();
const path = require("path");
const jwt = require("jsonwebtoken");
const admin_login_controller = require("../controllers/admin.login.controller");
const { admin_token_verify, admin_Only} = require("../middleware/admin.token.verify.js");

router.post("/login",admin_login_controller.login);
router.get("/check-auth",admin_token_verify, admin_Only,(req, res) => {
        res.status(201).json({
            authenticated: true
        })
});
    
module.exports = router;  