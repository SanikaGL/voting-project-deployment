const express = require("express");
const router = express.Router();

const {admin_token_verify,admin_Only} = require("../middleware/admin.token.verify");
const { candidate_approval, candidate_reject } = require("../controllers/candidate.approval");
console.log({
  admin_token_verify,
  admin_Only,
  candidate_approval
});
router.post("/accept",admin_token_verify,admin_Only,candidate_approval);
router.post("/reject",admin_token_verify,admin_Only,candidate_reject);

module.exports = router;//used as candidate approval router handler"/accept",middleware,candidate_reject);
