import Queue from "bull";
import mongo from "./mongo.js";

const redisCredentials = {
  port: process.env["PORT_REDIS"],
  host: process.env["URL_REDIS"],
  ...(process.env["REDIS_PASSWORD"] && {
    password: process.env["REDIS_PASSWORD"],
  }),
};

export const visitQueue = new Queue("visit", {
  redis: redisCredentials,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: true,
  },
});

visitQueue.process(10, async (job) => {
  return mongo.updateOne({ hash: job.data.hash }, { $inc: { visits: 1 } });
});
