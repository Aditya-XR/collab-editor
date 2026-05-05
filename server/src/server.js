import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";
import redisClient from "./config/redis.js";

const PORT = process.env.PORT;

const startServer = async () => {
  if (!PORT) {
    console.error("PORT is not defined");
    process.exit(1);
  }

  await connectDB();

  if (!process.env.REDIS_URL) {
    console.error("REDIS_URL is not defined");
    process.exit(1);
  }

  await redisClient.ping();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
