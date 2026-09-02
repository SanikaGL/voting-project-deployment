require("dotenv").config();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const login = async (req,res)=>{
     const { password } = req.body;
      console.log("req reached");
        if (password != process.env.ADMIN_PASSWORD) {
             return  res.status(401).send("wrong password");
             
        }
    
        const token = jwt.sign(
            { role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "1m" }
        );
    
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure:false
        });
        res.send("ok");     
    
}
module.exports = {
    login

}