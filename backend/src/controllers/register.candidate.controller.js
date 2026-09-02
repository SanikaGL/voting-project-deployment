const otpsession = require("../models/otpsession-for-voter");
const otpService = require("../services/otp-service");
const Candidate = require("../models/candidate");
const voter = require("../models/voter")
const s3command = require("../utils/s3");
const {redisForSetGet,redisPublisher,redisSubscriber} = require("../config/redis.clients")
const emailService = require("../services/email.service-for-candidate");
const s3 = require("../config/s3");
const candidate = require("../models/candidate");

const sendOtp =  async(req,res)=>{
    try{
        const existing = await Candidate.findOne({ email });
        const check_voter = await voter.findOne({email});

        if (existing || check_voter) {
            return res.json({ message: "Email already registered" });
        }
        const file = req.file;
        const email = req.email;
        const{imageUrl,key} = s3command.uploadToS3(file,email);
        //redis for otp session

        const generateOtp = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
        };
        const otp = generateOtp();
        emailService.SendOtp_to_email(email);
        await redisForSetGet.set(email, otp, {
        EX: 60,  // 1 minutes
        });
        redisForSetGet.set('photo:${email}',JSON.stringify({
            imageUrl:imageUrl,
            imageKey:key
        }));//to store image url and image key in s3
        res.status(200).json({
                message:"otp sent successfully"
        })
        
    

    }catch(error){
                s3command.deleteFromS3(key);
                console.log(error)
                res.status(500).json({
                    message:"something went wrong while sending otp request new otp"
                })
    }
}
const register_candidate = async(req,res) =>{
 try{
        const email = req.email;
        const otp = req.otp;
        const candidate_check = await candidate.findOne(email);
        
        if(candidate_check){
            res.json({
                message:"email already registered check status of approval or rejection through email"
            })
        }
        if(!email || !otp){
            res.json({
                message:"email required"
            })
            const otp_in_redis = redisClient.get("email");
            if(!otp_in_redis){
                res.json({
                    message:"otp expired request new otp "
                })
            }
        }
        const photo_data = redisClient.get('photo:${email}');
        const parsed = JSON.parse(photo_data);
        const imageUrl = parsed.imageUrl;
        const imageKey = parsed.imageKey;
        if(otp_in_redis!=otp){
        
        //delete
        await s3command.deleteFromS3(imageKey);
        res.json({
            message:"otp not matching please request another otp"
        })
        }
        const description = req.description;

        //otp match then uploading to candidate collection with status pending to be continued...
        if(otp_in_redis==otp){
        await Candidate.create({
                email,//keyand variable matches then directly u can update with variable
                role: "candidate",
                isVerified: true,
                status:"pending",
                photo:imageUrl,
                key:imageKey,
                description
            });
            const candidateData = candidate.findOne(email);
            const pending_candidate_data = {
                candidateID:candidateData.id,
                email:candidateData.email,
                status:candidateData.status,
                photo:{
                    url:candidateData.photo,
                    key:candidateData.key
                },
                description:candidateData.description,
                voteCount:candidateData.voteCount,
                isVerified:candidateData.isVerified,
            }
            //fetch from db based on the same email because  we need to do live updates 
            // other candidates with status pending are already pre fetching from db 
            redisPublisher.publish("pending_candidate_chanel",JSON.stringify(pending_candidate_data));
            //   io.to("admin room").emit("pending_candidate_chanel",candidatedata);//for real time to admins is
            // there work pending
            res.staus(200).json({
                message:"registered successfully once approved mail will be sent to ur gmail"
            })
        
        
        
    }catch(error){
    res.status(500).json({
        message:"something went wrong please try again to register"
        
    })
  }
 }

}
module.exports = {
    register_candidate,sendOtp
}