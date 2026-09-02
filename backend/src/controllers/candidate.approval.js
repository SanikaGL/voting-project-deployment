//requirement import
const { redisPublisher } = require("../config/redis.clients");
const Candidate = require("../models/candidate");
const { sendMsg } = require("../services/email-service");
const s3command = require("../utils/s3");


const candidate_approval = async (req, res) => {
    console.log("accept fetch reached backend");
   
    //first check if id exists 
     const { candidate_id } = req.body;

  // ✅ correct query + await
     const get_candidate = await Candidate.findOne({ _id: candidate_id });

    if (!get_candidate){
        return res.json({
            message:"candidate not found"
        })
    }
    if (get_candidate.status == "approved") {
        return
        res.json({
            message: "candidate already approved"
        })//based on this display pop up in frontend
    }
    //update status
    
    await Candidate.updateOne(
        { _id: candidate_id },
        { $set: { status: "approved" } }
    );
    const message = "your application accepted";
    console.log(message)
    const candidate_gmail = get_candidate.email;
    // await sendMsg(candidate_gmail, message);
    console.log("mail sent for acceptance")
    //take complete detail of the candidate from db to publish
    const candidate_data = await Candidate.findById(candidate_id);


    //publish event
    redisPublisher.publish("approved_candidate_chanel", JSON.stringify(candidate_id));
    console.log("res for acceptence is in next line ")
    return res.status(200).json({ // u cant use await because res is not promise 
        message: "status updated"
    })//based on this update the frontend 
    console.log("res sent for acceptence through res")
}
const candidate_reject = async (req, res) => {
    const { candidate_id } = req.body;
    
    const candidate_data = await Candidate.findById(candidate_id);
     if (!candidate_data) {
        console.log("no candidate ")
    }

    const candidate_gmail = candidate_data.email;
    const message = "your application rejected";
    // sendMsg(candidate_gmail, message);
    
    const image_key = candidate_data.key;

    console.log("reached till deleteting candidate rejected")
    await s3command.deleteFromS3(image_key);
    await Candidate.findByIdAndDelete(candidate_id);
    console.log("deleted")
    redisPublisher.publish("rejected_candidate_chanel", JSON.stringify(candidate_id));//frontend delete that candidate from page
    return res.status(200).json({message:"ok"})
    
    

}
module.exports = {
   candidate_approval,candidate_reject
}