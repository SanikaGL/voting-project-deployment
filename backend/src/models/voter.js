const mongoose = require("mongoose");

const voterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
   
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  hasVoted:{
    type: Boolean,default:false
  },
  role:{
    type: String,
    default:"none"
  }
}, { timestamps: true });

module.exports = mongoose.model("Voter", voterSchema);