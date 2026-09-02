require("dotenv").config();
const { PutObjectCommand} = require("@aws-sdk/client-s3");//this command is a class from aws sdk
const { DeleteObjectCommand} = require("@aws-sdk/client-s3");



const s3 = require("../config/s3");
//file =req.file ; this should in controller which comes from multer in middleware which inserts image to req.file
const uploadToS3 = async (file, email) => {

  const key = `candidates/${email}-${file.originalname}`;//unique key we should only create

  const params = {//this is required object for s3 putobjectcommand
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,//it is key for the object we upload as image to bucket usi9ng this we can delte the that particular object later
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  await s3.send(new PutObjectCommand(params));

  const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  return { imageUrl, key };
};
const deleteFromS3 = async (key) => {//same key is used to delete that object note here object is photo
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    };

    const command = new DeleteObjectCommand(params);
    console.log("reached till command delete for s3 client in utill s3")
    await s3.send(command);

    console.log("File deleted successfully from S3");
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    throw error;
  }
};
module.exports ={ uploadToS3,deleteFromS3};
