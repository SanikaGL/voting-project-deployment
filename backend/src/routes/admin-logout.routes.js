const express = require("express");
const router = express.Router();
const {logout}  = require("../controllers/logout.admin.controller");
router.post("/logout",logout);
module.exports = router;