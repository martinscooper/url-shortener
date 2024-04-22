import redisClient, { isUp } from "./redis.js";
import mongo from "./mongo.js";
import { customAlphabet } from "nanoid";
import { convertToUrlObject, sanitizeUrl } from "./utils.js";
import { visitQueue } from "./queue.js";

const nanoId = customAlphabet(
  "123456789abcdefghkmnpqrstuvwxyzABCDEFGHKLMNPQRSTUVWXYZ",
  6
);

const queryUrlByHash = async (hash, useCache = true) => {
  const cachedurl =
    useCache && isUp(redisClient) ? await redisClient.get(hash) : null;
  if (cachedurl) return cachedurl;
  const result = await mongo.findOne({ hash });
  if (result) {
    const url = result.url;
    useCache && isUp(redisClient) && redisClient.set(hash, url);
    return url;
  }
  return null;
};

const queryByurl = async (url) => {
  const result = await mongo.findOne({ url });
  return result;
};

export const redirect = async (req, res, next) => {
  const hash = req.params.id;
  const url = await queryUrlByHash(hash);
  if (url) {
    visitQueue.add({ hash: hash });
    return res.redirect(url);
  }
  next(new Error("The url doesnt exist"));
};

const generateNonCollisionHash = async () => {
  const newHash = nanoId();
  const query = await queryUrlByHash(newHash, false);
  const collision = query !== null;
  if (collision) return generateNonCollisionHash();
  else return newHash;
};

export const createHash = async (req, res, next) => {
  const body = req.body;
  const url = sanitizeUrl(body.url);
  const query = await queryByurl(url);
  const urlExists = query !== null;
  if (urlExists) {
    return res.send(query);
  }

  const urlObj = convertToUrlObject(url);
  if (urlObj === null) {
    next(new Error("The url is invalid"));
  }

  const hash = await generateNonCollisionHash();

  const hashToUrl = {
    hash,
    url,
    visits: 0,
  };

  mongo.insertOne(hashToUrl);

  res.send(hashToUrl);
};

export const getAll = async (req, res, next) => {
  const rows = await mongo.find({}).toArray();
  const cache = isUp(redisClient) ? await redisClient.keys("*") : null;
  res.send({
    rows,
    cache,
  });
};
