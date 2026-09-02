const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    photo: {
      type: String,
      required: true
    },
    key:{
      type:String,
      required:true
    },

    description: {
      type: String,
      required: true
    },

    role: {
      type: String,
      default: "candidate"
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"]
      
    },
    voteCount:{
      type:Number,
      default:0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Candidate", candidateSchema);