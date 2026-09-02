const mongoose = require("mongoose");
const otpsession_for_candidate = new mongoose.Schema({
    email : {
        type:String,
        unique:true,
        required:true},
    name : {type:String},
    photo:{
        type:String,
        required:true
    },
    otp : {type:String},
    expiresAt:{
        type:Date,
        required:true,
        index:{expires:0}
    },
    role:{
        type: String
    }

})