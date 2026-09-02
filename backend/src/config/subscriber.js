const { redisSubscriber } = require("./redis.clients");

let isSubscribed = false;

module.exports = (io) => {
  const setupSubscriber = async () => {
    if (isSubscribed) return; // prevent duplicate subscribe

    try {
      await redisSubscriber.subscribe("pending-candidate-chanel", (message) => {
        console.log("pending_candidate_chanel");
        io.emit("pending-candidate-event", JSON.parse(message));
      });

      await redisSubscriber.subscribe("approved_candidate_chanel", (message) => {
        io.emit("approved_candidate_event", JSON.parse(message));
      });

      await redisSubscriber.subscribe("reject_candidate_chanel", (message) => {
        io.emit("reject_candidate_event", JSON.parse(message));
      });

      isSubscribed = true;
      console.log("Redis channels subscribed ✅");
    } catch (err) {
      console.error("Subscription error:", err.message);
    }
  };

  // first time subscribe
  setupSubscriber();

  // when redis reconnects
  redisSubscriber.on("ready", async () => {
    console.log("Redis subscriber ready again...");
    isSubscribed = false; // allow subscribe again
    await setupSubscriber();
  });

  redisSubscriber.on("end", () => {
    console.log("Redis subscriber disconnected ❌");
    isSubscribed = false;
  });

  redisSubscriber.on("reconnecting", () => {
    console.log("Redis subscriber reconnecting...");
  });
};