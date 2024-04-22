import Redis from "ioredis";

let redisClient = null;

try {
  redisClient = new Redis({
    port: process.env["PORT_REDIS"],
    host: process.env["URL_REDIS"],
    password: process.env["REDIS_PASSWORD"],
    connectionName: "url-shortener",
    lazyConnect: false,
  });

  redisClient.on("ready", () => {
    console.log("Redis server is ready.");
  });

  redisClient.on("error", (error) => {
    console.log("Error in Redis server: " + error);
  });
} catch {}

export const isUp = () => {
  if (redisClient.status === "ready") {
    return true;
  } else {
    console.log("Redis is not up");
    return false;
  }
};
export default redisClient;
