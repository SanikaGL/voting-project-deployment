require("dotenv").config();


const { S3Client } = require("@aws-sdk/client-s3");
console.log("REGION:", process.env.AWS_REGION);
console.log("ACCESS KEY:", !!process.env.AWS_ACCESS_KEY_ID);
console.log("SECRET KEY:", !!process.env.AWS_SECRET_ACCESS_KEY);


const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
console.log("REGION:", process.env.AWS_REGION);
console.log("ACCESS KEY EXISTS:", !!process.env.AWS_ACCESS_KEY);
console.log("SECRET KEY EXISTS:", !!process.env.AWS_SECRET_KEY);

module.exports = s3;

