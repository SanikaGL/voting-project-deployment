const express = require("express");
const router = express.Router();
const {voterPage_preload_data} = require("../controllers/voting-page-peload-data.js")
const { voter_candidate_token_verify, voter_and_candidate_Only} = require("../middleware/voter-candidate.token.verify.js");
router.get("/voterPage-preload-candidate",voter_candidate_token_verify, voter_and_candidate_Only,voterPage_preload_data);
module.exports=router;