const express = require("express");
const { admin_token_verify, admin_Only} = require("../middleware/admin.token.verify.js");
const {preload_data} = require("../controllers/admin-page-preload-data")
const router = express.Router();
router.get("/preload-candidate",admin_token_verify,admin_Only,preload_data);
module.exports=router;
 //  ,admin_verify.admin_token_verify,admin_verify.admin_Onl
 //  add the above after testing 