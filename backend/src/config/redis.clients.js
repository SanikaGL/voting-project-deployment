// import { createClient } from "redis";
require("dotenv").config();
const { createClient } = require("redis"); 
const redisConfig = {
  url:process.env.REDIS_URL,
  socket: {
    keepAlive: 5000, // keeps connection alive
    reconnectStrategy: (retries) => {
      console.log("Retry attempt:", retries);

      if (retries > 10) {
        return new Error("Max retries reached");
      }

      return Math.min(retries * 100, 3000);
     }} // retry delay 
    
};
//using different clients for different purpose
// For DB-like usage (SET/GET/INCR)
const redisForSetGet = createClient(redisConfig);

// For publishing events
 const redisPublisher = createClient(redisConfig);

// For subscribing events
 const redisSubscriber = createClient(redisConfig);
 const attachEvents = (client, name) => {
  client.on("error", (err) => {
    console.error(`${name} Redis Error:`, err.message);
  });

  client.on("end", () => {
    console.log(`${name} connection closed`);
  });

  client.on("reconnecting", () => {//client.on listeners for event from redis this should come frirst because if client connects first then thre is no listeners then error handling fails
    console.log(`${name} reconnecting...`);
  });

  client.on("ready", () => {
    console.log(`${name} ready ✅`);
  });
};

// attach to all clients
attachEvents(redisForSetGet, "SETGET");
attachEvents(redisPublisher, "PUBLISHER");
attachEvents(redisSubscriber, "SUBSCRIBER");
  const create = async()=>{
  await redisForSetGet.connect();
  console.log("redis connected");
  await redisPublisher.connect();
  await redisSubscriber.connect();
 }
 create();
 module.exports = {
  redisForSetGet,redisPublisher,redisSubscriber
} 


