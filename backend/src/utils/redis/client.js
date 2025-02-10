import redis from "redis";

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  //   password: process.env.REDIS_PASSWORD || undefined,
});

redisClient.on("error", (error) => console.log("Redis error: ", error));

redisClient.on("connect", () => console.log("Connected to Redis server"));

redisClient.on("ready", () => console.log("Redis client is ready"));

export const initializeRedis = () => {
  redisClient.connect().catch((error) => {
    console.error("Failed to connect to Redis", error);
  });
};

export default redisClient;
