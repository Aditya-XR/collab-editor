import "./env.js";
import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;

const redisClient = redisUrl
  ? new Redis(redisUrl, {
      maxRetriesPerRequest: 3
    })
  : null;

if (redisClient) {
  redisClient.on("connect", () => {
    console.log("Redis connected");
  });

  redisClient.on("error", (error) => {
    console.error(`Redis error: ${error.message}`);
  });
}

export default redisClient;
