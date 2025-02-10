import redis from "redis";

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined, // Use this if your Redis is password protected
});

redisClient.on("error", (error) => console.log("Redis error: ", error));

// Log successful connection
redisClient.on("connect", () => console.log("Connected to Redis server"));

// Log when the client is ready to use
redisClient.on("ready", () => console.log("Redis client is ready"));

export const initializeRedis = () => {
  redisClient.connect().catch((error) => {
    console.error("Failed to connect to Redis", error);
  });
};

export default redisClient;
