import redis from "redis";

const redisClient = redis.createClient({
  url:
    process.env.NODE_ENV === "development"
      ? "redis://localhost:6379"
      : process.env.REDIS_URL,
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
