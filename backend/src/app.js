const express = require("express");
const voter_route = require("./routes/register.voter.routes.js")
const app = express();
const connectDB = require("./config/db")
const login = require("./routes/login.voter.routes.js")
const candidate_approval = require("./routes/candidate.approval.routes.js")
const admin_preload = require("./routes/admin-preload.routes.js")
const admin_logout = require("./routes/admin-logout.routes.js");
const admin_login = require("./routes/admin-login.routes.js");
const publics_page_data = require("./controllers/public-page-data.js")
const voter_page_route = require("./routes/voter-page-load.routes.js") // hereeeeeeeeeee
const vote_handler = require("./routes/vote-handler.routes.js")
const { admin_token_verify, admin_Only} = require("./middleware/admin.token.verify.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

app.use(cors({ 
    origin: "http://127.0.0.1:3000",   // allow requests from frontend origin as frontend is in port 3000 and backend is in 5000
    credentials: true //allow cookies or auth data to be sent
}));
app.use(cookieParser());//middleware to read cookies from incoming requests



connectDB();//connects to the database when server starts


app.use(express.json());// Middleware to parse JSON




// app.use(express.static(path.join(__dirname,"../../frontend")))//serves static frontend files

app.get("/", (req, res) => {
  res.json({ message: "Backend is running 🚀" });
});//test route to chech whether backend is working
// app.get("/admin-page", admin_token_verify, admin_Only, (req, res) => {
//     res.sendFile(path.join(__dirname, "../../frontend/admin-page.html"));
// });//protected admin route :
//1.checks if admin token is valid 
//2.check if logged-in user is actaually admin
//3.if yes,send admin page HTML page 
//only looged in admin can get dataa loaded in that page to verify if he is logged in and has token so that he can get data on page and going to page without token wont load content in that page 
app.use("/admin-login",admin_login);
app.use("/register",voter_route);//handles  voter registration routes
app.use("/login",login);//handles voter  login related routes
app.use("/candidate-approval",candidate_approval);//handles candidate approval or rejection routes
app.use("/admin-preload",admin_preload);//handles candidate data tpreload in the admin page to accept or reject candidate
app.use("/admin-logout",admin_logout);//handles admin logout route
app.get("/public-page",publics_page_data.load_data)
app.use("/voter-page",voter_page_route)
app.use("/vote",vote_handler)
app.use("/admin-login",admin_login)
app.get("/instance-info", async (req, res) => {

    const token = await fetch(
        "http://169.254.169.254/latest/api/token",
        {
            method: "PUT",
            headers: {
                "X-aws-ec2-metadata-token-ttl-seconds": "21600"
            }
        }
    ).then(r => r.text());

    const az = await fetch(
        "http://169.254.169.254/latest/meta-data/placement/availability-zone",
        {
            headers: {
                "X-aws-ec2-metadata-token": token
            }
        }
    ).then(r => r.text());

    const instanceId = await fetch(
        "http://169.254.169.254/latest/meta-data/instance-id",
        {
            headers: {
                "X-aws-ec2-metadata-token": token
            }
        }
    ).then(r => r.text());

    res.json({
        instanceId,
        az
    });
});
module.exports = app;//exporting app so that it can be used in server.js 
