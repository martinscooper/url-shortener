import { MongoClient } from "mongodb";
const url = process.env["DATABASE_URL"];

const client = new MongoClient(url);
const dbName = "shorturldb";
await client.connect();
console.log("Connected successfully to mongodb");
const db = client.db(dbName);
const mongo = db.collection("hashToUrl");

export default mongo;
