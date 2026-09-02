const express = require("express");
const { voter_candidate_token_verify, voter_and_candidate_Only} = require("../middleware/voter-candidate.token.verify.js");
const {vote_handler_controller} = require("../controllers/vote-handler.controller.js")
const router = express.Router();
router.get("/vote",voter_candidate_token_verify, voter_and_candidate_Only,vote_handler_controller)
module.exports=router;
