const candidate = require("../models/candidate");
const load_data = async (req,res)=>{
  try{ 
       const candidate_data = await candidate.find({status: approved});
       res.status(200).json(candidate_data);
       console.log(candidate_data);
    }catch(error){
        res.status(500).json({
            message:"error fetchting the candidate-list"
        })
    }
}

module.exports = {
   load_data
}